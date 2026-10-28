-- ==============================================================================
-- CETAK BIRU BASIS DATA RESMI: WASRIKAGENT AI v2.0 (MYSQL / MARIADB)
-- Dialek: MySQL 8.0+ / MariaDB 10.4+
-- Kepatuhan: UU No. 24/2011, PP No. 86/2013, UU PDP No. 27/2022
-- BPJS Kesehatan Healthkathon 2026 - Kategori 3: Efisiensi Risiko Pemberi Kerja
-- Berkas ini siap diimpor ke VPS dengan: mysql -u root -p < wasrik_db_mysql.sql
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `wasrik_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wasrik_db`;

-- Non-aktifkan foreign key sementara saat reset
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `raw_uploaded_documents`;
DROP TABLE IF EXISTS `active_learning_feedbacks`;
DROP TABLE IF EXISTS `human_decisions_log`;
DROP TABLE IF EXISTS `audit_findings`;
DROP TABLE IF EXISTS `employees_payroll`;
DROP TABLE IF EXISTS `tenants_employers`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. TABEL PENGGUNA (USERS) - AUTENTIKASI RIIL LOGIN & REGISTER
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('auditor', 'supervisor', 'auditee', 'admin') NOT NULL DEFAULT 'auditor',
  `role_title` VARCHAR(150) NOT NULL DEFAULT 'Auditor Wasrik Madya',
  `branch` VARCHAR(100) NOT NULL DEFAULT 'KC Cikarang',
  `nip` VARCHAR(50) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABEL MASTER BADAN USAHA (TENANTS_EMPLOYERS)
-- -----------------------------------------------------------------------------
CREATE TABLE `tenants_employers` (
  `id` VARCHAR(64) NOT NULL,
  `npwp` VARCHAR(30) NOT NULL,
  `nib` VARCHAR(30) DEFAULT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `sector_code` VARCHAR(20) NOT NULL,
  `sector_name` VARCHAR(150) NOT NULL,
  `branch_office` VARCHAR(100) NOT NULL,
  `total_active_employees` INT NOT NULL DEFAULT 0,
  `bpjs_registered_employees` INT NOT NULL DEFAULT 0,
  `compliance_risk_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `risk_category` ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'LOW',
  `arrears_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `arrears_months` INT NOT NULL DEFAULT 0,
  `sanction_status` ENUM('NORMAL', 'TEGURAN_1', 'TEGURAN_2', 'TMP2T_REKOMENDASI') NOT NULL DEFAULT 'NORMAL',
  `address` TEXT DEFAULT NULL,
  `last_audit_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_employers_npwp` (`npwp`),
  KEY `idx_employers_risk_score` (`compliance_risk_score`),
  KEY `idx_employers_category` (`risk_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. TABEL DATA PAYROLL TERENKRIPSI (UU PDP NO. 27/2022)
-- -----------------------------------------------------------------------------
CREATE TABLE `employees_payroll` (
  `id` VARCHAR(64) NOT NULL,
  `employer_id` VARCHAR(64) NOT NULL,
  `nik_hash` VARCHAR(64) NOT NULL COMMENT 'Salted SHA-256 Hashing',
  `employee_name_masked` VARCHAR(150) NOT NULL COMMENT 'Format B*** S******',
  `job_position` VARCHAR(150) DEFAULT NULL,
  `actual_base_salary` DECIMAL(15,2) NOT NULL,
  `actual_allowances` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total_actual_wage` DECIMAL(15,2) NOT NULL,
  `reported_bpjs_salary` DECIMAL(15,2) NOT NULL,
  `under_reported_gap` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `monthly_leakage_rp` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `status_jkn` ENUM('COMPLIANT', 'UNDER_REPORTED', 'UNREGISTERED_PDUK') NOT NULL DEFAULT 'COMPLIANT',
  `payroll_period` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payroll_employer` (`employer_id`),
  KEY `idx_payroll_nik_hash` (`nik_hash`),
  CONSTRAINT `fk_payroll_employer` FOREIGN KEY (`employer_id`) REFERENCES `tenants_employers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. TABEL TEMUAN AUDIT MULTI-AGENT (AUDIT_FINDINGS)
-- -----------------------------------------------------------------------------
CREATE TABLE `audit_findings` (
  `finding_id` VARCHAR(64) NOT NULL,
  `employer_id` VARCHAR(64) NOT NULL,
  `agent_type` ENUM('PAYROLL_AGENT', 'WORKFORCE_AGENT', 'COLLUSION_AGENT', 'SUPERVISOR_ORCHESTRATOR') NOT NULL,
  `anomaly_category` ENUM('UNDER_REPORTING_WAGE', 'PDUK', 'SICK_LEAVE_FRAUD', 'REVENUE_LEAKAGE') NOT NULL,
  `confidence_score` DECIMAL(4,3) NOT NULL,
  `estimated_loss_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `affected_employee_count` INT NOT NULL DEFAULT 0,
  `chain_of_thought_json` JSON NOT NULL,
  `evidence_ocr_snippet` TEXT DEFAULT NULL,
  `bounding_box_json` JSON DEFAULT NULL,
  `finding_status` ENUM('PENDING_HITL_REVIEW', 'APPROVED', 'OVERRIDDEN', 'REJECTED') NOT NULL DEFAULT 'PENDING_HITL_REVIEW',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finding_id`),
  KEY `idx_findings_employer` (`employer_id`),
  KEY `idx_findings_status` (`finding_status`),
  CONSTRAINT `fk_findings_employer` FOREIGN KEY (`employer_id`) REFERENCES `tenants_employers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. TABEL LOG KEPUTUSAN HITL AUDITOR (HUMAN_DECISIONS_LOG)
-- -----------------------------------------------------------------------------
CREATE TABLE `human_decisions_log` (
  `decision_id` VARCHAR(64) NOT NULL,
  `finding_id` VARCHAR(64) NOT NULL,
  `auditor_id` VARCHAR(64) NOT NULL,
  `auditor_name` VARCHAR(150) NOT NULL,
  `decision_type` ENUM('APPROVED', 'OVERRIDDEN', 'REJECTED') NOT NULL,
  `original_estimated_loss` DECIMAL(15,2) NOT NULL,
  `final_approved_loss` DECIMAL(15,2) NOT NULL,
  `auditor_notes` TEXT NOT NULL,
  `sanction_letter_issued` TINYINT(1) NOT NULL DEFAULT 0,
  `sanction_letter_number` VARCHAR(100) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`decision_id`),
  KEY `idx_decisions_finding` (`finding_id`),
  KEY `idx_decisions_auditor` (`auditor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. TABEL FEEDBACK ACTIVE LEARNING AI (ACTIVE_LEARNING_FEEDBACKS)
-- -----------------------------------------------------------------------------
CREATE TABLE `active_learning_feedbacks` (
  `feedback_id` VARCHAR(64) NOT NULL,
  `decision_id` VARCHAR(64) NOT NULL,
  `agent_type` VARCHAR(50) NOT NULL,
  `override_reason` TEXT NOT NULL,
  `loss_delta_amount` DECIMAL(15,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `idx_feedbacks_decision` (`decision_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. TABEL DOKUMEN PAYROLL RAW UNGGAHAN (RAW_UPLOADED_DOCUMENTS)
-- -----------------------------------------------------------------------------
CREATE TABLE `raw_uploaded_documents` (
  `doc_id` VARCHAR(64) NOT NULL,
  `uploaded_by` VARCHAR(64) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `file_size_bytes` INT NOT NULL DEFAULT 0,
  `records_count` INT NOT NULL DEFAULT 0,
  `total_detected_loss` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('UPLOADED', 'PARSED', 'AUDITED', 'ARCHIVED') NOT NULL DEFAULT 'UPLOADED',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- SEED DATA AWAL: PENGGUNA RESMI (PASSWORD SEMUA: wasrik2026)
-- Hash: $2b$12$mxWt0Jd3eFskwtNUB/bdB.m0ShWi/XywzXHLb3SFlGbU5rds.EYVy
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `role_title`, `branch`, `nip`) VALUES
('usr-darmawan-007', 'Darmawan Lahru Riatma', 'darmawan.wasrik@bpjs-kesehatan.go.id', '$2b$12$mxWt0Jd3eFskwtNUB/bdB.m0ShWi/XywzXHLb3SFlGbU5rds.EYVy', 'auditor', 'Auditor Wasrik Madya', 'KC Cikarang', '19940822 201802 1 002'),
('usr-siti-001', 'Siti Rahmawati, S.E., M.M.', 'siti.rahmawati@bpjs-kesehatan.go.id', '$2b$12$mxWt0Jd3eFskwtNUB/bdB.m0ShWi/XywzXHLb3SFlGbU5rds.EYVy', 'supervisor', 'Kepala Kantor Cabang (Supervisor)', 'KC Cikarang', '19830514 200701 2 001'),
('usr-bambang-003', 'Bambang Triyono', 'bambang.hr@sumbermaju.co.id', '$2b$12$mxWt0Jd3eFskwtNUB/bdB.m0ShWi/XywzXHLb3SFlGbU5rds.EYVy', 'auditee', 'HR Director (PT Sumber Maju Sentosa)', 'Auditee Mitra', 'BU-CKR-001'),
('usr-ilham-999', 'Ilham Eka, S.Kom.', 'ilham.admin@bpjs-kesehatan.go.id', '$2b$12$mxWt0Jd3eFskwtNUB/bdB.m0ShWi/XywzXHLb3SFlGbU5rds.EYVy', 'admin', 'System Administrator & Security', 'Kantor Pusat IT BPJS', '19961103 202012 1 004');

-- -----------------------------------------------------------------------------
-- SEED DATA AWAL: BADAN USAHA TARGET AUDIT
-- -----------------------------------------------------------------------------
INSERT INTO `tenants_employers` (`id`, `npwp`, `nib`, `company_name`, `sector_code`, `sector_name`, `branch_office`, `total_active_employees`, `bpjs_registered_employees`, `compliance_risk_score`, `risk_category`, `arrears_amount`, `arrears_months`, `sanction_status`, `address`, `last_audit_date`) VALUES
('bu-cikarang-001', '01.234.567.8-413.000', '9120003412984', 'PT Sumber Maju Sentosa', 'MFG', 'Manufaktur Komponen Otomotif', 'KC Cikarang', 180, 145, 84.50, 'CRITICAL', 168000000.00, 4, 'TEGURAN_1', 'Kawasan Industri GIIC Blok C-12, Cikarang Pusat, Kab. Bekasi', '2026-10-15'),
('bu-cikarang-002', '02.889.123.4-411.000', '8120009941235', 'PT Mega Pratama Logistik', 'LOG', 'Transportasi & Pergudangan Berikat', 'KC Cikarang', 240, 195, 76.20, 'HIGH', 95000000.00, 2, 'NORMAL', 'Jl. Raya Narogong KM 14.5, Cileungsi, Kab. Bogor', '2026-10-18'),
('bu-cikarang-003', '03.445.678.9-421.000', '1220005519823', 'PT Cipta Busana Mandiri', 'TEX', 'Industri Garmen & Tekstil Ekspor', 'KC Cikarang', 520, 410, 88.90, 'CRITICAL', 340000000.00, 5, 'TEGURAN_2', 'Kawasan Industri Jababeka Tahap II Blok J-4, Cikarang Baru', '2026-10-02'),
('bu-karawang-001', '04.112.334.5-432.000', '2210008891234', 'PT Karawang Presisi Steel', 'STL', 'Peleburan & Pengolahan Baja Ringan', 'KC Karawang', 310, 280, 68.40, 'HIGH', 112000000.00, 3, 'NORMAL', 'Kawasan Industri KIIC Kav. 42, Telukjambe Timur, Karawang', '2026-10-20'),
('bu-cikarang-004', '04.778.234.1-412.000', '7120004391820', 'PT Indo Mitra Lestari', 'SRV', 'Jasa Alih Daya & Fasilitas Industri', 'KC Cikarang', 110, 105, 42.10, 'MEDIUM', 12000000.00, 1, 'NORMAL', 'Ruko Commercial Center Blok B-8, Lippo Cikarang', '2026-09-28'),
('bu-cikarang-005', '05.112.987.6-414.000', '9220001182736', 'PT Solusi Prima Niaga', 'RET', 'Perdagangan Besar FMCG', 'KC Cikarang', 85, 85, 18.40, 'LOW', 0.00, 0, 'NORMAL', 'Jl. Teuku Umar No. 45, Cibitung, Bekasi', '2026-10-24');

-- -----------------------------------------------------------------------------
-- SEED DATA AWAL: TEMUAN AUDIT MULTI-AGENT
-- -----------------------------------------------------------------------------
INSERT INTO `audit_findings` (`finding_id`, `employer_id`, `agent_type`, `anomaly_category`, `confidence_score`, `estimated_loss_amount`, `affected_employee_count`, `chain_of_thought_json`, `evidence_ocr_snippet`, `bounding_box_json`, `finding_status`) VALUES
('find-001', 'bu-cikarang-001', 'PAYROLL_AGENT', 'UNDER_REPORTING_WAGE', 0.942, 275000000.00, 145, 
'["Langkah 1: Vision-LLM OCR membaca 150 berkas slip gaji PDF batch bulan September 2026.", "Langkah 2: Menghitung nilai rata-rata take-home pay riil = Rp 8.500.000/pekerja.", "Langkah 3: Membandingkan dengan master data SIPP BPJS = Rp 5.300.000/pekerja.", "Langkah 4: Terverifikasi Under-Reporting Wage Gap sebesar 37.6% pada 145 orang karyawan tetap.", "Langkah 5: Estimasi kebocoran iuran 4% pemberi kerja = Rp 275.000.000/tahun."]',
'Slip Gaji Fisik: Gaji Pokok Rp 7.000.000 + Tunj. Tetap Rp 1.500.000 = Rp 8.500.000. SIPP BPJS Terdaftar: Rp 5.300.000.',
'{"x": 140, "y": 280, "w": 420, "h": 90, "label": "⚠️ Gap Upah Terdeteksi: Selisih Rp 3.200.000/bln"}',
'PENDING_HITL_REVIEW'),

('find-002', 'bu-cikarang-001', 'WORKFORCE_AGENT', 'PDUK', 0.885, 150000000.00, 35,
'["Langkah 1: Mengunduh data Wajib Lapor Ketenagakerjaan (WLKP) & rekonsiliasi fingerprint HRIS.", "Langkah 2: Menemukan total tenaga kerja aktif di lokasi pabrik = 180 personel.", "Langkah 3: Memverifikasi nomor kepesertaan terdaftar di kantor cabang Wasrik = 145 peserta.", "Langkah 4: Ditemukan 35 pekerja bagian finishing belum didaftarkan sama sekali (Modus PDUK).", "Langkah 5: Potensi kerugian iuran 4% selama masa kerja aktif = Rp 150.000.000."]',
'Daftar Presensi Fingerprint: 180 Pekerja Aktif | Master Peserta BPJS: 145 Peserta Aktif (35 Tidak Didaftarkan).',
'{"x": 120, "y": 420, "w": 460, "h": 110, "label": "⚠️ Pekerja Sebagian (PDUK): 35 Personel Tidak Terdaftar"}',
'PENDING_HITL_REVIEW');
