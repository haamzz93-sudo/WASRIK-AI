-- ==============================================================================
-- CETAK BIRU BASIS DATA RESMI: WASRIKAGENT AI v1.0
-- Dialek: PostgreSQL 16 + Ekstensi pgvector
-- Standar Keamanan: UU No. 27 Tahun 2022 (PDP) & PP No. 86 Tahun 2013 (TMP2T)
-- BPJS Kesehatan Healthkathon 2026 - Kategori: Efisiensi Risiko pada Pemberi Kerja
-- ==============================================================================

-- 1. Inisialisasi Ekstensi Vektor & UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. TABEL MASTER BADAN USAHA / PEMBERI KERJA (PPU)
DROP TABLE IF EXISTS active_learning_feedbacks CASCADE;
DROP TABLE IF EXISTS human_decisions_log CASCADE;
DROP TABLE IF EXISTS audit_findings CASCADE;
DROP TABLE IF EXISTS employees_payroll CASCADE;
DROP TABLE IF EXISTS tenants_employers CASCADE;

CREATE TABLE tenants_employers (
    employer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npwp VARCHAR(20) UNIQUE NOT NULL,
    nib VARCHAR(20),
    company_name VARCHAR(255) NOT NULL,
    sector_code VARCHAR(10) NOT NULL,          -- e.g., 'MFG', 'SRV', 'RET', 'CON'
    sector_name VARCHAR(100),
    address_text TEXT,
    city_code VARCHAR(10) NOT NULL,            -- e.g., 'CKR', 'BDG', 'SBY', 'JKT'
    branch_office VARCHAR(100) NOT NULL,       -- e.g., 'KC Cikarang', 'KC Bandung'
    total_active_employees INT NOT NULL DEFAULT 0,
    bpjs_registered_employees INT NOT NULL DEFAULT 0,
    compliance_risk_score NUMERIC(5,2) DEFAULT 0.00,
    risk_category VARCHAR(20) CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'LOW',
    arrears_amount NUMERIC(15,2) DEFAULT 0.00, -- Piutang Iuran Macet (Rp)
    arrears_months INT DEFAULT 0,              -- Lama Menunggak (Bulan)
    sanction_status VARCHAR(50) DEFAULT 'NORMAL', -- 'NORMAL', 'TEGURAN_1', 'TEGURAN_2', 'TMP2T_REKOMENDASI'
    last_audit_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employers_risk_score ON tenants_employers(compliance_risk_score DESC);
CREATE INDEX idx_employers_city ON tenants_employers(city_code);
CREATE INDEX idx_employers_category ON tenants_employers(risk_category);

-- 3. TABEL DATA PAYROLL DAN GAJI TERENKRIPSI (UU PDP)
CREATE TABLE employees_payroll (
    payroll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES tenants_employers(employer_id) ON DELETE CASCADE,
    nik_hash VARCHAR(64) NOT NULL,              -- HASH SHA-256 NIK DENGAN SALT
    employee_name_masked VARCHAR(100) NOT NULL, -- Format: B*** S******
    job_position VARCHAR(100),
    actual_base_salary NUMERIC(15,2) NOT NULL,  -- Gaji Pokok Riil (Slip / Rekening)
    actual_allowances NUMERIC(15,2) DEFAULT 0.00,
    reported_bpjs_salary NUMERIC(15,2) NOT NULL, -- Gaji yang Dilaporkan ke SIPP
    under_reported_gap NUMERIC(15,2) GENERATED ALWAYS AS ((actual_base_salary + actual_allowances) - reported_bpjs_salary) STORED,
    payroll_period DATE NOT NULL,
    source_document_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payroll_employer_period ON employees_payroll(employer_id, payroll_period);
CREATE INDEX idx_payroll_nik_hash ON employees_payroll(nik_hash);

-- 4. TABEL TEMUAN AUDIT MULTI-AGENT (XAI & EVIDENCE)
CREATE TABLE audit_findings (
    finding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES tenants_employers(employer_id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,           -- 'PAYROLL_AGENT', 'WORKFORCE_AGENT', 'COLLUSION_AGENT', 'SUPERVISOR_ORCHESTRATOR'
    anomaly_category VARCHAR(50) NOT NULL,     -- 'UNDER_REPORTING_WAGE', 'PDUK', 'SICK_LEAVE_FRAUD', 'REVENUE_LEAKAGE'
    confidence_score NUMERIC(4,3) NOT NULL,    -- 0.000 s.d 1.000
    estimated_loss_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    affected_employee_count INT DEFAULT 0,
    chain_of_thought_json JSONB NOT NULL,
    evidence_ocr_snippet TEXT,
    bounding_box_coordinates JSONB,            -- { "x": 120, "y": 240, "w": 400, "h": 150 }
    document_vector_embedding vector(1536),    -- pgvector similarity embedding
    finding_status VARCHAR(30) DEFAULT 'PENDING_HITL_REVIEW', -- 'PENDING_HITL_REVIEW', 'APPROVED', 'OVERRIDDEN', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_findings_status ON audit_findings(finding_status);
CREATE INDEX idx_findings_employer ON audit_findings(employer_id);

-- 5. TABEL LOG KEPUTUSAN AUDITOR (HUMAN-IN-THE-LOOP AUDIT TRAIL)
CREATE TABLE human_decisions_log (
    decision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID NOT NULL REFERENCES audit_findings(finding_id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL,
    auditor_name VARCHAR(150) NOT NULL,
    decision_type VARCHAR(20) NOT NULL CHECK (decision_type IN ('APPROVED', 'OVERRIDDEN', 'REJECTED')),
    original_estimated_loss NUMERIC(15,2) NOT NULL,
    final_approved_loss NUMERIC(15,2) NOT NULL,
    auditor_notes TEXT NOT NULL,
    sanction_letter_issued BOOLEAN DEFAULT FALSE,
    sanction_letter_number VARCHAR(100),
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decisions_auditor ON human_decisions_log(auditor_id);
CREATE INDEX idx_decisions_timestamp ON human_decisions_log(action_timestamp DESC);

-- 6. TABEL ACTIVE LEARNING FEEDBACK LOOP ENGINE
CREATE TABLE active_learning_feedbacks (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES human_decisions_log(decision_id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    original_prompt_context TEXT NOT NULL,
    auditor_override_reason TEXT NOT NULL,
    loss_delta_amount NUMERIC(15,2) NOT NULL,
    applied_to_prompt_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. STORED PROCEDURE: KALKULASI SKOR KEPATUHAN BADAN USAHA
CREATE OR REPLACE FUNCTION fn_calculate_compliance_score(p_employer_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_payroll_loss NUMERIC(15,2);
    v_pduk_gap INT;
    v_arrears_months INT;
    v_final_score NUMERIC(5,2);
BEGIN
    -- Hitung potensi kerugian dari audit payroll
    SELECT COALESCE(SUM(estimated_loss_amount), 0.00) INTO v_payroll_loss
    FROM audit_findings 
    WHERE employer_id = p_employer_id AND agent_type = 'PAYROLL_AGENT';
    
    -- Hitung selisih pekerja tidak didaftarkan (PDUK)
    SELECT (total_active_employees - bpjs_registered_employees), arrears_months 
    INTO v_pduk_gap, v_arrears_months
    FROM tenants_employers WHERE employer_id = p_employer_id;
    
    -- Formula Scoring Matriks Wasrik BPJS Kesehatan
    -- Bobot: Under-reporting (40%) + PDUK (40%) + Penunggakan Iuran (20%)
    v_final_score := LEAST(100.00, 
        ((v_payroll_loss / 50000000.0) * 40.0) + 
        (LEAST(1.0, v_pduk_gap::numeric / 50.0) * 40.0) + 
        (LEAST(1.0, v_arrears_months::numeric / 6.0) * 20.0)
    );
    
    -- Update Master Badan Usaha
    UPDATE tenants_employers 
    SET compliance_risk_score = ROUND(v_final_score, 2),
        risk_category = CASE 
            WHEN v_final_score >= 80 THEN 'CRITICAL'
            WHEN v_final_score >= 60 THEN 'HIGH'
            WHEN v_final_score >= 40 THEN 'MEDIUM'
            ELSE 'LOW'
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE employer_id = p_employer_id;
    
    RETURN v_final_score;
END;
$$ LANGUAGE plpgsql;
