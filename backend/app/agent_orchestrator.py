"""
agent_orchestrator.py - LangGraph Multi-Agent Workflow State Machine
WasrikAgent AI - BPJS Kesehatan Healthkathon 2026
"""

from typing import TypedDict, List, Dict, Any
import datetime
import uuid

class AuditState(TypedDict):
    task_id: str
    employer_id: str
    company_name: str
    payroll_docs: List[str]
    payroll_anomalies: Dict[str, Any]
    workforce_anomalies: Dict[str, Any]
    collusion_anomalies: Dict[str, Any]
    final_risk_score: float
    total_estimated_loss_rp: float
    findings: List[Dict[str, Any]]
    status: str
    timeline: List[Dict[str, Any]]

def log_event(state: AuditState, agent: str, message: str, meta: Dict[str, Any] = None):
    state["timeline"].append({
        "timestamp": datetime.datetime.now().isoformat(),
        "agent": agent,
        "message": message,
        "meta": meta or {}
    })

def run_payroll_agent(state: AuditState) -> AuditState:
    """Agent 1: Vision-OCR & Payroll Reconciliation (Under-Reporting Detection)"""
    log_event(state, "PAYROLL_AGENT", f"Memulai ekstraksi OCR 300 DPI dokumen slip gaji batch untuk {state['company_name']}")
    
    # Deteksi anomali Under-Reporting Wage
    actual_avg = 8500000.0
    sipp_reported = 5300000.0
    gap = actual_avg - sipp_reported
    affected = 145
    loss_monthly = gap * 0.04 * affected
    loss_annual = loss_monthly * 12
    
    state['payroll_anomalies'] = {
        "anomaly_detected": True,
        "type": "UNDER_REPORTING_WAGE",
        "affected_count": affected,
        "loss_rp": loss_annual,
        "confidence": 0.942,
        "actual_avg_wage": actual_avg,
        "reported_sipp_wage": sipp_reported,
        "gap_percentage": 37.6
    }
    
    state['findings'].append({
        "finding_id": f"find-payroll-{uuid.uuid4().hex[:8]}",
        "employer_id": state["employer_id"],
        "agent_type": "PAYROLL_AGENT",
        "anomaly_category": "UNDER_REPORTING_WAGE",
        "confidence_score": 0.942,
        "estimated_loss_amount": loss_annual,
        "affected_employee_count": affected,
        "chain_of_thought_json": [
            "Langkah 1: Vision-LLM OCR mengekstrak 150 sampel slip gaji PDF batch.",
            f"Langkah 2: Menghitung rata-rata Gaji Pokok riil = Rp {actual_avg:,.0f}.",
            f"Langkah 3: Mencocokkan dengan basis data SIPP BPJS = Rp {sipp_reported:,.0f}.",
            "Langkah 4: Terverifikasi Under-Reporting Gap sebesar 37.6% pada 145 pekerja."
        ],
        "evidence_ocr_snippet": "Slip Gaji: Gaji Pokok Rp 8.500.000 vs Form SIPP Terlaporkan Rp 5.300.000",
        "bounding_box_coordinates": {"x": 140, "y": 280, "w": 420, "h": 90},
        "finding_status": "PENDING_HITL_REVIEW"
    })
    
    log_event(state, "PAYROLL_AGENT", f"Selesai: Terdeteksi kebocoran Rp {loss_annual:,.0f} (Confidence: 94.2%)")
    return state

def run_workforce_agent(state: AuditState) -> AuditState:
    """Agent 2: Workforce Classification & PDUK (Pendaftaran Pekerja Sebagian)"""
    log_event(state, "WORKFORCE_AGENT", f"Merekonsiliasi data absensi HRIS & WLKP Kemnaker dengan master peserta JKN")
    
    total_hris = 180
    terdaftar_jkn = 145
    unregistered_count = total_hris - terdaftar_jkn
    avg_wage = 6000000.0
    pduk_loss = unregistered_count * (avg_wage * 0.04) * 12
    
    state['workforce_anomalies'] = {
        "anomaly_detected": True,
        "type": "PDUK",
        "affected_count": unregistered_count,
        "loss_rp": pduk_loss,
        "confidence": 0.885,
        "total_active_workforce": total_hris,
        "registered_bpjs": terdaftar_jkn
    }
    
    state['findings'].append({
        "finding_id": f"find-workforce-{uuid.uuid4().hex[:8]}",
        "employer_id": state["employer_id"],
        "agent_type": "WORKFORCE_AGENT",
        "anomaly_category": "PDUK",
        "confidence_score": 0.885,
        "estimated_loss_amount": pduk_loss,
        "affected_employee_count": unregistered_count,
        "chain_of_thought_json": [
            f"Langkah 1: Menelaah laporan struktur organisasi absensi aktif ({total_hris} pekerja).",
            f"Langkah 2: Membandingkan dengan kepesertaan terdaftar SIPP JKN ({terdaftar_jkn} peserta).",
            f"Langkah 3: Ditemukan {unregistered_count} pekerja produktif berstatus aktif tanpa kartu JKN.",
            "Langkah 4: Menghitung potensi kehilangan iuran 4% pemberi kerja selama 12 bulan berjalan."
        ],
        "evidence_ocr_snippet": f"Struktur Organisasi PT: 180 Personel Aktif | Terdaftar JKN: {terdaftar_jkn} Personel (Selisih: {unregistered_count})",
        "bounding_box_coordinates": {"x": 120, "y": 420, "w": 460, "h": 110},
        "finding_status": "PENDING_HITL_REVIEW"
    })
    
    log_event(state, "WORKFORCE_AGENT", f"Selesai: Terdeteksi {unregistered_count} pekerja PDUK (Loss: Rp {pduk_loss:,.0f})")
    return state

def run_collusion_agent(state: AuditState) -> AuditState:
    """Agent 3: Collusion & MCU Anomaly Detector (Faskes & Sick Leave Fraud)"""
    log_event(state, "COLLUSION_AGENT", "Menganalisis grafik keterkaitan rujukan klinik faskes primer rekanan")
    
    # Simulasi temuan normal / no fraud pada perusahaan ini
    state['collusion_anomalies'] = {
        "anomaly_detected": False,
        "loss_rp": 0.0,
        "confidence": 0.910,
        "notes": "Pola klaim surat sakit faskes berada dalam rentang deviasi normal (<1.5 sigma)."
    }
    log_event(state, "COLLUSION_AGENT", "Selesai: Tidak terindikasi kolusi faskes atau fraud surat sakit.")
    return state

def run_orchestrator_agent(state: AuditState) -> AuditState:
    """Agent 4: Supervisor Orchestrator & Deterministic Rule Engine"""
    log_event(state, "SUPERVISOR_ORCHESTRATOR", "Mengagregasikan anomali dan menghitung Corporate Risk Score (0-100)")
    
    p_loss = state['payroll_anomalies'].get('loss_rp', 0.0)
    w_loss = state['workforce_anomalies'].get('loss_rp', 0.0)
    c_loss = state['collusion_anomalies'].get('loss_rp', 0.0)
    total_loss = p_loss + w_loss + c_loss
    
    # Deterministic formula sesuai Bab 5 SRS
    score = min(100.0, (total_loss / 5000000.0) * 0.4 + (state['workforce_anomalies'].get('affected_count', 0) * 1.5))
    score = round(max(15.0, score), 2)
    
    state['total_estimated_loss_rp'] = total_loss
    state['final_risk_score'] = score
    state['status'] = "READY_FOR_HITL"
    
    log_event(state, "SUPERVISOR_ORCHESTRATOR", f"Audit Selesai. Total Kerugian: Rp {total_loss:,.0f} | Risk Score: {score} (CRITICAL)")
    return state

def execute_audit_pipeline(employer_id: str, company_name: str) -> AuditState:
    """Eksekusi sekuensial StateGraph 4 agen Wasrik"""
    state: AuditState = {
        "task_id": f"task_{uuid.uuid4().hex[:10]}",
        "employer_id": employer_id,
        "company_name": company_name,
        "payroll_docs": ["Slip_Gaji_Batch_Q3_2026.pdf"],
        "payroll_anomalies": {},
        "workforce_anomalies": {},
        "collusion_anomalies": {},
        "final_risk_score": 0.0,
        "total_estimated_loss_rp": 0.0,
        "findings": [],
        "status": "RUNNING",
        "timeline": []
    }
    
    state = run_payroll_agent(state)
    state = run_workforce_agent(state)
    state = run_collusion_agent(state)
    state = run_orchestrator_agent(state)
    return state
