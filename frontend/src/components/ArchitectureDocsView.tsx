import React, { useState } from 'react';
import { IconCpu, IconDocument, IconBrain, IconShieldCheck } from './Icons';

export const ArchitectureDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'ddl' | 'api' | 'bdd'>('blueprint');

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cetak Biru Arsitektur &amp; Dokumen SRS (v2.0 Final Production)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Spesifikasi Kebutuhan Perangkat Lunak WasrikAgent AI • Terverifikasi Sesuai Cetak Biru di D:\projek warasik
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl">
              Target Sprint 1-4 Complete
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blueprint'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Arsitektur Multi-Agent (Bab 3)
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ddl'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skema SQL PostgreSQL 16 &amp; MySQL (Bab 5)
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Spesifikasi API &amp; WebSocket (Bab 6)
          </button>
          <button
            onClick={() => setActiveTab('bdd')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bdd'
                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skenario Uji BDD Gherkin (Bab 10)
          </button>
        </div>

        {/* TAB 1: BLUEPRINT */}
        {activeTab === 'blueprint' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  LangGraph Multi-Agent Architecture &amp; Nous-Hermes-3 Reasoning
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  SRS Bab 3 • PP No. 86/2013
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                WasrikAgent AI mengorkestrasi 4 agen AI dengan spesialisasi tugas yang terisolasi dan kontrak data kaku berbasis <strong>Nous-Hermes-3 Agentic CoT</strong>. Agen A1 (Payroll Intel) mengekstraksi slip fisik, Agen A2 (Workforce Classification) menghitung PDUK, Agen A3 (Collusion) mendeteksi anomali faskes rekanan, dan Agen A4 (Supervisor Orchestrator) mengkalkulasi Corporate Risk Score (0-100) serta menyiapkan draf Surat Teguran.
              </p>

              <div className="bg-slate-950 text-emerald-400 p-5 rounded-xl font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800">
                <pre className="whitespace-pre leading-snug">
{`+-----------------------------------------------------------------------------------+
|                        WASRIKAGENT AI MULTI-AGENT ARCHITECTURE                    |
|                                                                                   |
|  [ Ingestion Service ] ---> ( Vision-LLM OCR & PDF Parser Pipeline )              |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                 LANGGRAPH MULTI-AGENT ORCHESTRATOR ENGINE                   |  |
|  |                                                                             |  |
|  |   +-----------------------+           +---------------------------------+   |  |
|  |   | Agent 1: Payroll &    |           | Agent 2: Workforce              |   |  |
|  |   | Document Intel        |           | Classification                  |   |  |
|  |   | (OCR, Slip Gaji, SPT) |           | (PDUK, Misklasifikasi Status)   |   |  |
|  |   +-----------+-----------+           +----------------+----------------+   |  |
|  |               |                                        |                    |  |
|  |               +-------------------+--------------------+                    |  |
|  |                                   |                                         |  |
|  |   +-------------------------------+--------------------+                    |  |
|  |   | Agent 3: Collusion &          | Agent 4: Supervisor|                    |  |
|  |   | MCU Anomaly                   | Audit Orchestrator |                    |  |
|  |   | (Surat Sakit/MCU Fraud)       | (Risk Score & Loss)|                    |  |
|  |   +-------------------------------+---------+----------+                    |  |
|  +---------------------------------------------|-------------------------------+  |
|                                                v                                  |
|               [ HITL AUDIT WORKBENCH - AUDITOR VERIFICATION GATE ]                |
+-----------------------------------------------------------------------------------+`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DDL */}
        {activeTab === 'ddl' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              DDL Skema Basis Data PostgreSQL 16 &amp; MySQL / MariaDB
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tersedia lengkap di berkas <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">wasrik_db_mysql.sql</span> dan <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">backend/database.sql</span>.
            </p>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
              <pre className="whitespace-pre">
{`-- TABEL MASTER BADAN USAHA
CREATE TABLE tenants_employers (
    employer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npwp VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    sector_code VARCHAR(10) NOT NULL,
    address_text TEXT,
    city_code VARCHAR(10) NOT NULL,
    total_active_employees INT NOT NULL DEFAULT 0,
    bpjs_registered_employees INT NOT NULL DEFAULT 0,
    compliance_risk_score NUMERIC(5,2) DEFAULT 0.00,
    risk_category VARCHAR(20) CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    last_audit_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABEL DATA PAYROLL TERENKRIPSI (UU PDP)
CREATE TABLE employees_payroll (
    payroll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES tenants_employers(employer_id) ON DELETE CASCADE,
    nik_hash VARCHAR(64) NOT NULL, -- SHA-256 SALT
    employee_name_masked VARCHAR(100) NOT NULL,
    actual_base_salary NUMERIC(15,2) NOT NULL,
    actual_allowances NUMERIC(15,2) DEFAULT 0.00,
    reported_bpjs_salary NUMERIC(15,2) NOT NULL,
    under_reported_gap NUMERIC(15,2) GENERATED ALWAYS AS ((actual_base_salary + actual_allowances) - reported_bpjs_salary) STORED,
    payroll_period DATE NOT NULL
);`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: API */}
        {activeTab === 'api' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Spesifikasi Endpoint RESTful FastAPI, WebSocket &amp; Hermes Port 8787
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">POST</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">/api/v1/hermes/run-audit</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Memicu alur kerja koordinasi 4 agen AI Nous-Hermes-3 dan menghasilkan temuan audit serta Risk Score empiris.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">POST</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">/api/v1/hitl/submit-decision</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Otorisasi keputusan Petugas Wasrik ([Approve], [Adjust], [Reject]) dan penerbitan Surat Teguran resmi PP No. 86/2013.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">WS</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">/ws/v1/agent-stream/{'{task_id}'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Protokol WebSocket streaming dua arah token-by-token penalaran Chain-of-Thought agen AI ke UI Workbench.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">PORT 8787</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">http://0.0.0.0:8787/health &amp; /api/chat</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Endpoint server Hermes Web UI mandiri kompatibel Biznet Gio NEO Inference dan OpenAI API.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BDD GHERKIN */}
        {activeTab === 'bdd' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Skenario Uji Penerimaan Sistem (BDD Gherkin Matrix)
            </h2>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre">
{`Feature: Deteksi Under-Reporting Wage dan Eksekusi HITL

  Scenario: Auditor Wasrik menyetujui temuan Under-Reporting Wage berisiko tinggi
    Given Berkas slip gaji "PDF_PT_Sukses.pdf" diunggah ke sistem WasrikAgent AI
    And Gaji riil dalam slip adalah Rp 8.000.000 dan terlaporkan BPJS adalah Rp 5.000.000
    When Multi-Agent Engine mengeksekusi pemindaian Vision-OCR dan aturan deterministik
    Then System menghitung under_reporting_pct sebesar 37.5%
    And Corporate Risk Score dihasilkan sebesar 85.50 (Risiko Tinggi)
    When Auditor Wasrik meninjau Dual-Pane Workbench dan menekan tombol "APPROVE"
    Then System mencatat audit log dengan tindakan "APPROVE"
    And System menerbitkan draf rekomendasi sanksi TMP2T sesuai PP No. 86/2013.`}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArchitectureDocsView;
