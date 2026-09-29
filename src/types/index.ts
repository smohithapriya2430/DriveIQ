// ============================================================
// DriveIQ – Core Type Definitions
// ============================================================

export type AppPage =
  | 'login'
  | 'driver-profile'
  | 'vision-assessment'
  | 'vision-profile-summary'
  | 'dashboard'
  | 'live-simulation'
  | 'object-detection'
  | 'vision-twin'
  | 'path-planning'
  | 'decision-center'
  | 'safety-center'
  | 'accessibility-center'
  | 'voice-copilot'
  | 'scenario-simulation'
  | 'analytics'
  | 'settings'
  | 'demo-mode'
  | 'accessibility-evaluation'
  | 'emergency';

// ─── Vision Accessibility Conditions ────────────────────────
export type VisionCondition =
  | 'none'
  | 'color_general'
  | 'red_green'
  | 'blue_yellow'
  | 'small_text'
  | 'low_vision'
  | 'low_contrast'
  | 'glare'
  | 'night'
  | 'slow_recognition'
  | 'voice_prefer'
  | 'simplified'
  | 'other';

// ─── Vision Adaptation Mode ──────────────────────────────────
export type VisionMode =
  | 'standard'
  | 'color_accessible'
  | 'red_green'
  | 'blue_yellow'
  | 'low_vision'
  | 'high_contrast'
  | 'glare_reduction'
  | 'night_visibility'
  | 'voice_first'
  | 'simplified';

// ─── Driver Profile ──────────────────────────────────────────
export interface DriverProfile {
  name: string;
  age: string;
  experience: string;
  language: string;
  preferredVoice: string;
  alertVolume: number;
  units: 'kmh' | 'mph';
  navigationPreference: string;
}

// ─── Accessibility Profile ───────────────────────────────────
export interface AccessibilityProfile {
  conditions: VisionCondition[];
  colorDifficulty: string[];
  textSizeDifficulty: string;
  glareSensitivity: string;
  voicePreference: string;
  simplifiedDashboard: boolean;
  warningRecognitionDifficulty: string;

  // Computed / applied settings
  visionMode: VisionMode;
  textSize: 'normal' | 'large' | 'x-large';
  contrastMode: 'normal' | 'high' | 'max';
  colorIndependentWarnings: boolean;
  voiceEnabled: boolean;
  voiceSpeed: number;
  alertPriority: 'normal' | 'high' | 'critical-only';
  simplifiedMode: boolean;
  glareMode: boolean;
  nightMode: boolean;
  enhancedLabels: boolean;
}

// ─── App State ───────────────────────────────────────────────
export interface AppState {
  page: AppPage;
  isLoggedIn: boolean;
  driver: DriverProfile | null;
  accessibility: AccessibilityProfile | null;
  profileComplete: boolean;
}

// ─── Sensor / Simulation Data ────────────────────────────────
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WeatherCondition = 'Clear' | 'Light Rain' | 'Heavy Rain' | 'Fog' | 'Night' | 'Snow';
export type RoadType = 'Highway' | 'Urban Road' | 'Residential' | 'Construction Zone' | 'School Zone';

export interface DetectedObject {
  id: string;
  type: 'vehicle' | 'pedestrian' | 'cyclist' | 'motorcycle' | 'bus' | 'truck' | 'sign' | 'obstacle';
  label: string;
  distance: number; // meters
  relativeSpeed: number; // km/h (negative = approaching)
  risk: RiskLevel;
  confidence: number; // 0-100
  x: number; // % position in detection viewport
  y: number;
  width: number;
  height: number;
}

export interface EnvironmentState {
  roadType: RoadType;
  weather: WeatherCondition;
  visibility: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  trafficDensity: 'None' | 'Light' | 'Moderate' | 'Heavy' | 'Standstill';
  laneCondition: 'Clear' | 'Markings Faded' | 'Wet' | 'Construction';
  timeOfDay: 'Day' | 'Dusk' | 'Night';
  speedLimit: number;
}

export interface VehicleState {
  speed: number; // km/h
  gear: 'P' | 'R' | 'N' | 'D' | 'S';
  batteryLevel: number; // %
  mode: 'Autonomous' | 'Semi-Autonomous' | 'Manual';
  status: 'NOMINAL' | 'ATTENTION' | 'WARNING';
}

export interface DrivingDecision {
  action: string;
  reason: string;
  nextAction: string;
  riskLevel: RiskLevel;
}

export interface Warning {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  detail: string;
  distance?: number;
  risk: RiskLevel;
  voiceText: string;
  timestamp: number;
  icon: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  environment: Partial<EnvironmentState>;
  objects: DetectedObject[];
  decision: DrivingDecision;
  warnings: Warning[];
}
