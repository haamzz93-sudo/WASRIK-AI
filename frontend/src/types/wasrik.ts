export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type UserRole = 'auditor' | 'supervisor' | 'auditee' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle?: string;
  role_title?: string;
  branch: string;
  nip: string;
  email?: string;
  avatarUrl?: string;
}

export interface Employer {
  id: string;
  npwp: string;
  nib: string;
  companyName: string;
  sectorCode: string;
  sectorName: string;
  branchOffice: string;
  totalActiveEmployees: number;
  bpjsRegisteredEmployees: number;
  complianceRiskScore: number;
  riskCategory: RiskLevel;
  arrearsAmount: number;
  arrearsMonths: number;
  sanctionStatus: 'NORMAL' | 'TEGURAN_1' | 'TEGURAN_2' | 'TMP2T_REKOMENDASI';
  address: string;
  lastAuditDate?: string;
}

export interface AgentFinding {
  findingId: string;
  employerId: string;
  companyName: string;
  agentType: 'PAYROLL_AGENT' | 'WORKFORCE_AGENT' | 'COLLUSION_AGENT' | 'SUPERVISOR_ORCHESTRATOR';
  anomalyCategory: 'UNDER_REPORTING_WAGE' | 'PDUK' | 'SICK_LEAVE_FRAUD' | 'REVENUE_LEAKAGE';
  confidenceScore: number;
  estimatedLossAmount: number;
  affectedEmployeeCount: number;
  chainOfThought: string[];
  evidenceOcrSnippet: string;
  boundingBox?: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
  };
  findingStatus: 'PENDING_HITL_REVIEW' | 'APPROVED' | 'OVERRIDDEN' | 'REJECTED';
  ocrPdfUrl?: string;
  createdAt: string;
}

export interface HITLDecision {
  decisionId: string;
  findingId: string;
  auditorId: string;
  auditorName: string;
  decisionType: 'APPROVED' | 'OVERRIDDEN' | 'REJECTED';
  originalEstimatedLoss: number;
  finalApprovedLoss: number;
  auditorNotes: string;
  sanctionLetterIssued: boolean;
  sanctionLetterNumber?: string;
  timestamp: string;
}

export interface SyntheticEmployee {
  recordId: string;
  nikHash: string;
  employeeNameMasked: string;
  jobPosition: string;
  actualBaseSalary: number;
  actualAllowances: number;
  totalActualWage: number;
  reportedBpjsSalary: number;
  underReportedGap: number;
  monthlyLeakageRp: number;
  statusJkn: 'COMPLIANT' | 'UNDER_REPORTED' | 'UNREGISTERED_PDUK';
}
