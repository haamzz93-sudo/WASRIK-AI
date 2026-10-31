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
import { InteractiveTourGuide } from './components/InteractiveTourGuide';

import { MOCK_EMPLOYERS, MOCK_FINDINGS, CURRENT_USER } from './data/mockData';
import { Employer, AgentFinding, UserProfile } from './types/wasrik';
import { getSavedSession, saveSession, updateActiveView, clearSession } from './utils/session';

export const App: React.FC = () => {
  // Enterprise Session & Cookie Restoration
  const session = getSavedSession();

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (session.isAuthenticated && session.user) {
      return {
        ...session.user,
        roleTitle: session.user.roleTitle || session.user.role_title || 'Auditor Wasrik Madya',
        role_title: session.user.role_title || session.user.roleTitle || 'Auditor Wasrik Madya',
        branch: session.user.branch || 'KC Cikarang',
        nip: session.user.nip || '19940822 201802 1 002',
      };
    }
    return CURRENT_USER;
  });

  // Persistent Active View: Survives F5 Hard Refresh via Cookies & localStorage & URL Hash
  const [currentView, setCurrentView] = useState<string>(() => {
    // 1. Check URL Hash (e.g., wasrik.unsmadiun.id/#hermes)
    const hash = window.location.hash.replace('#', '').trim();
    const validViews = ['workbench', 'queue', 'dashboard', 'hermes', 'agents', 'uploader', 'synthetic', 'docs', 'login', 'landing'];
    if (hash && validViews.includes(hash)) {
      return hash;
    }

    // 2. If session is authenticated, restore the view they were working on!
    if (session.isAuthenticated && session.view) {
      if (validViews.includes(session.view) && session.view !== 'landing' && session.view !== 'login') {
        return session.view;
      }
      return 'workbench';
    }

    // 3. Fallback to saved view or landing
    const saved = localStorage.getItem('wasrik_active_view');
    if (saved && validViews.includes(saved) && saved !== 'landing') {
      return saved;
    }

    return 'landing';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Database states
  const [employers, setEmployers] = useState<Employer[]>(MOCK_EMPLOYERS);
  const [findings, setFindings] = useState<AgentFinding[]>(MOCK_FINDINGS);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer>(MOCK_EMPLOYERS[0]);
  const [activeFinding, setActiveFinding] = useState<AgentFinding>(MOCK_FINDINGS[0]);

  // Modals state
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Unified persistent navigation
  const navigateTo = (view: string) => {
    setCurrentView(view);
    updateActiveView(view);
    window.location.hash = view;
    setIsMobileMenuOpen(false);
  };

  // Sync hash changes (e.g., browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validViews = ['workbench', 'queue', 'dashboard', 'hermes', 'agents', 'uploader', 'synthetic', 'docs', 'login', 'landing'];
      if (hash && validViews.includes(hash)) {
        setCurrentView(hash);
        updateActiveView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch live data from MySQL backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const empRes = await fetch('/api/v1/employers/priority-queue');
        let fetchedEmployers: Employer[] = [];
        if (empRes.ok) {
          const empJson = await empRes.json();
          if (empJson.data && empJson.data.length > 0) {
            fetchedEmployers = empJson.data;
            setEmployers(fetchedEmployers);
          }
        }

        const findRes = await fetch('/api/v1/findings');
        let fetchedFindings: AgentFinding[] = [];
        if (findRes.ok) {
          const findJson = await findRes.json();
          if (findJson && findJson.length > 0) {
            fetchedFindings = findJson;
            setFindings(fetchedFindings);
          }
        }

        // Restore previously selected employer & finding if stored
        const savedEmpId = localStorage.getItem('wasrik_employer_id');
        if (savedEmpId && fetchedEmployers.length > 0) {
          const matched = fetchedEmployers.find((e) => e.id === savedEmpId);
          if (matched) {
            setSelectedEmployer(matched);
            const relFinding = (fetchedFindings.length > 0 ? fetchedFindings : findings).find((f) => f.employerId === matched.id);
            if (relFinding) setActiveFinding(relFinding);
          }
        } else if (fetchedEmployers.length > 0) {
          setSelectedEmployer(fetchedEmployers[0]);
          if (fetchedFindings.length > 0) setActiveFinding(fetchedFindings[0]);
        }
      } catch (err) {
        console.log('Backend not reachable yet, using seeded cache:', err);
      }
    };

    fetchBackendData();
  }, []);

  // Navigate to finding from employer with persistent state
  const handleSelectEmployer = (emp: Employer) => {
    setSelectedEmployer(emp);
    localStorage.setItem('wasrik_employer_id', emp.id);
    const related = findings.find((f) => f.employerId === emp.id) || findings[0];
    setActiveFinding(related);
    localStorage.setItem('wasrik_finding_id', related.findingId);
    navigateTo('workbench');
  };

  // Custom file upload loader
  const handleLoadCustomAudit = (newFinding: AgentFinding, newEmployer: Employer) => {
    setEmployers((prev) => [newEmployer, ...prev]);
    setFindings((prev) => [newFinding, ...prev]);
    setSelectedEmployer(newEmployer);
    setActiveFinding(newFinding);
    navigateTo('workbench');
  };

  // Decision actions with MySQL persistence
  const handleApproveFinding = async (findingId: string, notes: string) => {
    try {
      await fetch('/api/v1/hitl/submit-decision', {
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
      await fetch('/api/v1/hitl/submit-decision', {
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
      await fetch('/api/v1/hitl/submit-decision', {
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
          onGoToLogin={() => navigateTo('login')}
          onGoToWorkbench={() => {
            if (!session.isAuthenticated) {
              saveSession(CURRENT_USER, 'wasrik_demo_session_token_2026', 'workbench');
              setCurrentUser(CURRENT_USER);
            }
            navigateTo('workbench');
          }}
          onGoToQueue={() => {
            if (!session.isAuthenticated) {
              saveSession(CURRENT_USER, 'wasrik_demo_session_token_2026', 'queue');
              setCurrentUser(CURRENT_USER);
            }
            navigateTo('queue');
          }}
          onGoToUploader={() => {
            if (!session.isAuthenticated) {
              saveSession(CURRENT_USER, 'wasrik_demo_session_token_2026', 'uploader');
              setCurrentUser(CURRENT_USER);
            }
            navigateTo('uploader');
          }}
          onOpenDatasheet={() => setIsDatasheetOpen(true)}
          onStartTour={() => setIsTourOpen(true)}
        />
        <DatasheetModal
          isOpen={isDatasheetOpen}
          onClose={() => setIsDatasheetOpen(false)}
        />
        <InteractiveTourGuide
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          currentView={currentView}
          onNavigate={(view) => {
            if (view !== 'landing' && !session.isAuthenticated) {
              saveSession(CURRENT_USER, 'wasrik_demo_session_token_2026', view);
              setCurrentUser(CURRENT_USER);
            }
            navigateTo(view);
          }}
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
            navigateTo('workbench');
          }}
          onBackToLanding={() => navigateTo('landing')}
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
        onNavigate={(view) => navigateTo(view)}
        currentUser={currentUser}
        onOpenDatasheet={() => setIsDatasheetOpen(true)}
        onOpenLogout={() => {
          clearSession();
          navigateTo('landing');
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <TopHeader
          currentUser={currentUser}
          currentView={currentView}
          onNavigate={(view) => navigateTo(view)}
          onOpenDatasheet={() => setIsDatasheetOpen(true)}
          onStartTour={() => setIsTourOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onSwitchRole={(role) => {
            const updated: UserProfile = {
              ...currentUser,
              role,
              roleTitle:
                role === 'auditor'
                  ? 'Auditor Wasrik Madya'
                  : role === 'supervisor'
                  ? 'Kepala Kantor Cabang'
                  : role === 'auditee'
                  ? 'HR Director (Auditee)'
                  : 'System Administrator',
            };
            setCurrentUser(updated);
            saveSession(updated, localStorage.getItem('wasrik_token') || 'token', currentView);
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
          onOpenDocs={() => navigateTo('docs')}
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

      {/* Interactive Tour Guide Modal / Floater */}
      <InteractiveTourGuide
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
      />
    </div>
  );
};
export default App;
