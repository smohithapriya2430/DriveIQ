import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppPage, DriverProfile, AccessibilityProfile, SimulationScenario, EnvironmentState, VehicleState } from '../types';
import { defaultAccessibilityProfile } from '../modules/visionAdaptation/VisionAdaptationEngine';
import { defaultVehicleState, defaultEnvironment, scenarios } from '../data/mockData';

interface AppContextType {
  page: AppPage;
  setPage: (p: AppPage) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  driver: DriverProfile | null;
  setDriver: (d: DriverProfile) => void;
  accessibility: AccessibilityProfile;
  setAccessibility: (a: AccessibilityProfile) => void;
  profileComplete: boolean;
  setProfileComplete: (v: boolean) => void;
  activeScenario: SimulationScenario;
  setActiveScenario: (s: SimulationScenario) => void;
  vehicle: VehicleState;
  setVehicle: (v: VehicleState) => void;
  environment: EnvironmentState;
  setEnvironment: (e: EnvironmentState) => void;
  simulationRunning: boolean;
  setSimulationRunning: (v: boolean) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  voiceMuted: boolean;
  setVoiceMuted: (v: boolean) => void;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  demoStep: number;
  setDemoStep: (s: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPageState] = useState<AppPage>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driver, setDriverState] = useState<DriverProfile | null>(null);
  const [accessibility, setAccessibilityState] = useState<AccessibilityProfile>(defaultAccessibilityProfile);
  const [profileComplete, setProfileComplete] = useState(false);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(scenarios[0]);
  const [vehicle, setVehicle] = useState<VehicleState>(defaultVehicleState);
  const [environment, setEnvironment] = useState<EnvironmentState>(defaultEnvironment);
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedDriver = localStorage.getItem('driveiq_driver');
      const savedAccess = localStorage.getItem('driveiq_accessibility');
      const savedComplete = localStorage.getItem('driveiq_profile_complete');
      if (savedDriver) setDriverState(JSON.parse(savedDriver));
      if (savedAccess) setAccessibilityState(JSON.parse(savedAccess));
      if (savedComplete === 'true') setProfileComplete(true);
    } catch { /* ignore */ }
  }, []);

  const setPage = useCallback((p: AppPage) => {
    setPageState(p);
    window.scrollTo(0, 0);
  }, []);

  const setDriver = useCallback((d: DriverProfile) => {
    setDriverState(d);
    localStorage.setItem('driveiq_driver', JSON.stringify(d));
  }, []);

  const setAccessibility = useCallback((a: AccessibilityProfile) => {
    setAccessibilityState(a);
    localStorage.setItem('driveiq_accessibility', JSON.stringify(a));
  }, []);

  const setProfileCompleteWrapped = useCallback((v: boolean) => {
    setProfileComplete(v);
    localStorage.setItem('driveiq_profile_complete', String(v));
  }, []);

  return (
    <AppContext.Provider value={{
      page, setPage,
      isLoggedIn, setIsLoggedIn,
      driver, setDriver,
      accessibility, setAccessibility,
      profileComplete, setProfileComplete: setProfileCompleteWrapped,
      activeScenario, setActiveScenario,
      vehicle, setVehicle,
      environment, setEnvironment,
      simulationRunning, setSimulationRunning,
      emergencyActive, setEmergencyActive,
      voiceMuted, setVoiceMuted,
      demoMode, setDemoMode,
      demoStep, setDemoStep,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
