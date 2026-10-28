import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Footer } from './components/Footer';
import { LandingPageView } from './components/LandingPageView';
import { LoginView } from './components/LoginView';
import { DualPaneWorkbench } from './components/DualPaneWorkbench';
import { PriorityQueueView } from './components/PriorityQueueView';
import { DashboardView } from './components/DashboardView';
import { MultiAgentLiveRunner } from './components/MultiAgentLiveRunner';
import { HermesConsoleView } from './components/HermesConsoleView';
import { RealFileUploader } from './components/RealFileUploader';
import { SyntheticDataGenerator } from './components/SyntheticDataGenerator';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { DatasheetModal } from './components/DatasheetModal';
import { SanctionLetterModal } from './components/SanctionLetterModal';

import { MOCK_EMPLOYERS, MOCK_FINDINGS, CURRENT_USER } from './data/mockData';
import { Employer, AgentFinding, UserProfile } from './types/wasrik';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wasrik_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          name: parsed.name || 'Darmawan Lahru Riatma',
          roleTitle: parsed.roleTitle || parsed.role_title || (parsed.role === 'supervisor' ? 'Kepala Cabang' : parsed.role === 'auditee' ? 'Perwakilan BU' : parsed.role === 'admin' ? 'Sys Admin' : 'Auditor Wasrik Madya'),
          role_title: parsed.role_title || parsed.roleTitle || 'Auditor Wasrik Madya',
          branch: parsed.branch || 'KC Cikarang',
          nip: parsed.nip || '19940822 201802 1 002',
        };
      } catch {
        return CURRENT_USER;
      }
    }
    return CURRENT_USER;
  });

  const [currentView, setCurrentView] = useState<string>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Live Database states
  const [employers, setEmployers] = useState<Employer[]>(MOCK_EMPLOYERS);
  const [findings, setFindings] = useState<AgentFinding[]>(MOCK_FINDINGS);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer>(MOCK_EMPLOYERS[0]);
  const [activeFinding, setActiveFinding] = useState<AgentFinding>(MOCK_FINDINGS[0]);

  // Modals state
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);

  // Fetch live data from MySQL backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const empRes = await fetch('http://localhost:8000/api/v1/employers/priority-queue');
        if (empRes.ok) {
          const empJson = await empRes.json();
          if (empJson.data && empJson.data.length > 0) {
            setEmployers(empJson.data);
            setSelectedEmployer(empJson.data[0]);
          }
        }

        const findRes = await fetch('http://localhost:8000/api/v1/findings');
        if (findRes.ok) {
          const findJson = await findRes.json();
          if (findJson && findJson.length > 0) {
            setFindings(findJson);
            setActiveFinding(findJson[0]);
          }
        }
      } catch (err) {
        console.log('Backend not reachable yet, using seeded cache:', err);
      }
    };

    fetchBackendData();
  }, []);

  // Navigate to finding from employer
  const handleSelectEmployer = (emp: Employer) => {
    setSelectedEmployer(emp);
    const related = findings.find((f) => f.employerId === emp.id) || findings[0];
    setActiveFinding(related);
    setCurrentView('workbench');
  };

  // Custom file upload loader
  const handleLoadCustomAudit = (newFinding: AgentFinding, newEmployer: Employer) => {
    setEmployers((prev) => [newEmployer, ...prev]);
    setFindings((prev) => [newFinding, ...prev]);
    setSelectedEmployer(newEmployer);
    setActiveFinding(newFinding);
    setCurrentView('workbench');
  };

  // Decision actions with MySQL persistence
  const handleApproveFinding = async (findingId: string, notes: string) => {
    try {
      await fetch('http://localhost:8000/api/v1/hitl/submit-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding_id: findingId,
          auditor_id: currentUser.id,
          auditor_name: currentUser.name,
          decision: 'APPROVED',
          final_approved_loss_rp: activeFinding.estimatedLossAmount,
          auditor_notes: notes,
          generate_sanction_letter: true,
        }),
      });
    } catch (e) {
      console.warn('Fallback offline approve:', e);
    }

    setFindings((prev) =>
      prev.map((f) =>
        f.findingId === findingId ? { ...f, findingStatus: 'APPROVED' } : f
      )
    );
    setEmployers((prev) =>
      prev.map((e) =>
        e.id === selectedEmployer.id ? { ...e, sanctionStatus: 'TEGURAN_1' } : e
      )
    );
    setIsSanctionModalOpen(true);
  };

  const handleOverrideFinding = async (findingId: string, adjustedLoss: number, notes: string) => {
    try {
      await fetch('http://localhost:8000/api/v1/hitl/submit-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding_id: findingId,
          auditor_id: currentUser.id,
          auditor_name: currentUser.name,
          decision: 'OVERRIDDEN',
          final_approved_loss_rp: adjustedLoss,
          auditor_notes: notes,
          generate_sanction_letter: false,
        }),
      });
    } catch (e) {
      console.warn('Fallback offline override:', e);
    }

    setFindings((prev) =>
      prev.map((f) =>
        f.findingId === findingId
          ? { ...f, estimatedLossAmount: adjustedLoss, findingStatus: 'OVERRIDDEN' }
          : f
      )
    );
    alert(`Temuan berhasil di-override menjadi Rp ${adjustedLoss.toLocaleString('id-ID')}. Perubahan dicatat permanen dalam audit trail MySQL.`);
  };

  const handleRejectFinding = async (findingId: string, notes: string) => {
    try {
      await fetch('http://localhost:8000/api/v1/hitl/submit-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding_id: findingId,
          auditor_id: currentUser.id,
          auditor_name: currentUser.name,
          decision: 'REJECTED',
          final_approved_loss_rp: 0,
          auditor_notes: notes,
          generate_sanction_letter: false,
        }),
      });
    } catch (e) {
      console.warn('Fallback offline reject:', e);
    }

    setFindings((prev) =>
      prev.map((f) =>
        f.findingId === findingId ? { ...f, findingStatus: 'REJECTED' } : f
      )
    );
    alert('Temuan AI ditolak oleh auditor. Kasus ditutup di database MySQL.');
  };

  // Full Screen Views without Sidebar (Landing & Login)
  if (currentView === 'landing') {
    return (
      <>
        <LandingPageView
          onGoToLogin={() => setCurrentView('login')}
          onGoToWorkbench={() => setCurrentView('workbench')}
          onGoToQueue={() => setCurrentView('queue')}
          onGoToUploader={() => setCurrentView('uploader')}
          onOpenDatasheet={() => setIsDatasheetOpen(true)}
        />
        <DatasheetModal
          isOpen={isDatasheetOpen}
          onClose={() => setIsDatasheetOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'login') {
    return (
      <>
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView('workbench');
          }}
          onBackToLanding={() => setCurrentView('landing')}
        />
        <DatasheetModal
          isOpen={isDatasheetOpen}
          onClose={() => setIsDatasheetOpen(false)}
        />
      </>
    );
  }

  // Enterprise Workspace (with persistent Sidebar, TopHeader, and Footer)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 100vh Sticky Responsive Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onOpenDatasheet={() => setIsDatasheetOpen(true)}
        onOpenLogout={() => {
          localStorage.removeItem('wasrik_token');
          setCurrentView('login');
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Header */}
          <TopHeader
            currentUser={currentUser}
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onOpenDatasheet={() => setIsDatasheetOpen(true)}
            onSwitchRole={(role) => {
              setCurrentUser((prev) => ({
                ...prev,
                role,
                roleTitle:
                  role === 'auditor'
                    ? 'Auditor Wasrik Madya'
                    : role === 'supervisor'
                    ? 'Kepala Kantor Cabang'
                    : role === 'auditee'
                    ? 'HR Director (Auditee)'
                    : 'System Administrator',
              }));
            }}
          />

          {/* Dynamic Workspace Body with smooth tab transitions */}
          <main key={currentView} className="flex-1 flex flex-col overflow-hidden animate-fade-in">
            {currentView === 'queue' && (
              <PriorityQueueView
                employers={employers}
                onSelectEmployer={handleSelectEmployer}
                selectedEmployerId={selectedEmployer.id}
              />
            )}

            {currentView === 'workbench' && (
              <DualPaneWorkbench
                finding={activeFinding}
                employer={selectedEmployer}
                onApprove={handleApproveFinding}
                onOverride={handleOverrideFinding}
                onReject={handleRejectFinding}
                onOpenSanctionModal={() => setIsSanctionModalOpen(true)}
              />
            )}

            {currentView === 'dashboard' && <DashboardView />}

            {currentView === 'uploader' && (
              <RealFileUploader onLoadCustomAudit={handleLoadCustomAudit} />
            )}

            {currentView === 'hermes' && <HermesConsoleView />}

            {currentView === 'agents' && <MultiAgentLiveRunner />}

            {currentView === 'synthetic' && <SyntheticDataGenerator />}

            {currentView === 'docs' && <ArchitectureDocsView />}
          </main>

          {/* Official Footer */}
          <Footer
            onOpenDatasheet={() => setIsDatasheetOpen(true)}
            onOpenDocs={() => setCurrentView('docs')}
          />
        </div>

        {/* Global Modals */}
        <DatasheetModal
          isOpen={isDatasheetOpen}
          onClose={() => setIsDatasheetOpen(false)}
        />

        <SanctionLetterModal
          isOpen={isSanctionModalOpen}
          onClose={() => setIsSanctionModalOpen(false)}
          finding={activeFinding}
          employer={selectedEmployer}
        />
      </div>
    );
  };
export default App;
