from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = "auditor"  # auditor, supervisor, auditee, admin
    role_title: Optional[str] = "Auditor Wasrik Madya"
    branch: Optional[str] = "KC Cikarang"
    nip: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class EmployerCreateRequest(BaseModel):
    npwp: str
    nib: Optional[str] = None
    company_name: str
    sector_code: str
    sector_name: str
    branch_office: str
    total_active_employees: int
    bpjs_registered_employees: int
    arrears_amount: float = 0.0
    arrears_months: int = 0
    address: Optional[str] = None

class HITLDecisionRequest(BaseModel):
    finding_id: str
    auditor_id: str
    auditor_name: str
    decision: str  # 'APPROVED', 'OVERRIDDEN', 'REJECTED'
    final_approved_loss_rp: float
    auditor_notes: str
    generate_sanction_letter: bool = True

class HITLDecisionResponse(BaseModel):
    status: str
    decision_id: str
    sanction_letter_number: Optional[str] = None
    updated_employer_status: str
    message: str

class MultiAgentExecuteRequest(BaseModel):
    employer_id: str
    enable_agents: List[str] = ["PAYROLL_AGENT", "WORKFORCE_AGENT", "COLLUSION_AGENT"]
    confidence_threshold: float = 0.75

class SyntheticGenerateRequest(BaseModel):
    record_count: int = 100
    under_reporting_rate: float = 0.40
    pduk_rate: float = 0.20
