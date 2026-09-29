import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import DriverProfile from './pages/DriverProfile';
import VisionAssessment from './pages/VisionAssessment';
import VisionProfileSummary from './pages/VisionProfileSummary';
import DashboardHome from './pages/DashboardHome';
import LiveSimulation from './pages/LiveSimulation';
import ObjectDetection from './pages/ObjectDetection';
import VisionTwin from './pages/VisionTwin';
import PathPlanning from './pages/PathPlanning';
import DecisionCenter from './pages/DecisionCenter';
import SafetyCenter from './pages/SafetyCenter';
import AccessibilityCenter from './pages/AccessibilityCenter';
import VoiceCoPilot from './pages/VoiceCoPilot';
import ScenarioSimulation from './pages/ScenarioSimulation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DemoMode from './pages/DemoMode';
import AccessibilityEvaluation from './pages/AccessibilityEvaluation';
import Emergency from './pages/Emergency';

const DASHBOARD_PAGES = new Set([
  'dashboard', 'live-simulation', 'object-detection', 'vision-twin',
  'path-planning', 'decision-center', 'safety-center', 'accessibility-center',
  'voice-copilot', 'scenario-simulation', 'analytics', 'settings',
  'demo-mode', 'accessibility-evaluation', 'emergency',
]);

function AppContent() {
  const { page, accessibility } = useApp();

  // Apply body classes from accessibility profile
  React.useEffect(() => {
    const body = document.body;
    // Remove old classes
    body.classList.remove('high-contrast', 'large-text', 'simplified', 'glare-mode', 'night-mode');
    if (accessibility.contrastMode !== 'normal') body.classList.add('high-contrast');
    if (accessibility.textSize !== 'normal') body.classList.add('large-text');
    if (accessibility.simplifiedMode) body.classList.add('simplified');
    if (accessibility.glareMode) body.classList.add('glare-mode');
    if (accessibility.nightMode) body.classList.add('night-mode');

    // Apply CSS custom property for font scale
    const scale = accessibility.textSize === 'x-large' ? 1.2 : accessibility.textSize === 'large' ? 1.1 : 1;
    document.documentElement.style.setProperty('--font-scale', String(scale));
  }, [accessibility]);

  // Pre-auth pages
  if (page === 'login') return <Login />;
  if (page === 'driver-profile') return <DriverProfile />;
  if (page === 'vision-assessment') return <VisionAssessment />;
  if (page === 'vision-profile-summary') return <VisionProfileSummary />;

  // Dashboard pages
  if (DASHBOARD_PAGES.has(page)) {
    return (
      <DashboardLayout>
        <PageContent page={page} />
      </DashboardLayout>
    );
  }

  return <Login />;
}

function PageContent({ page }: { page: string }) {
  switch (page) {
    case 'dashboard': return <DashboardHome />;
    case 'live-simulation': return <LiveSimulation />;
    case 'object-detection': return <ObjectDetection />;
    case 'vision-twin': return <VisionTwin />;
    case 'path-planning': return <PathPlanning />;
    case 'decision-center': return <DecisionCenter />;
    case 'safety-center': return <SafetyCenter />;
    case 'accessibility-center': return <AccessibilityCenter />;
    case 'voice-copilot': return <VoiceCoPilot />;
    case 'scenario-simulation': return <ScenarioSimulation />;
    case 'analytics': return <Analytics />;
    case 'settings': return <Settings />;
    case 'demo-mode': return <DemoMode />;
    case 'accessibility-evaluation': return <AccessibilityEvaluation />;
    case 'emergency': return <Emergency />;
    default: return <DashboardHome />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
