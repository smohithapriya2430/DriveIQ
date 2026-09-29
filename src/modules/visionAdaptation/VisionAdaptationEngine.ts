// ============================================================
// DriveIQ – Vision Adaptation Engine
// The core innovation: dynamically adapts all interface
// elements based on the driver's accessibility profile.
// ============================================================

import type {
  AccessibilityProfile,
  VisionCondition,
  VisionMode,
  Warning,
  RiskLevel,
} from '../../types';

// ─── Adaptation Output ───────────────────────────────────────
export interface AdaptedWarning {
  id: string;
  level: 1 | 2 | 3 | 4;
  icon: string;
  title: string;
  detail: string;
  distance?: number;
  risk: RiskLevel;
  riskLabel: string;
  actionText: string;
  voiceText: string;
  showVoiceIndicator: boolean;
  emphasis: 'normal' | 'high' | 'critical';
  usePattern: boolean; // color-independent pattern indicator
}

export interface InterfaceTheme {
  textScale: number;         // 1.0 = normal, 1.3 = large, 1.6 = x-large
  contrastClass: string;     // CSS class for contrast mode
  bgPrimary: string;
  bgCard: string;
  bgPanel: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  safeColor: string;
  warnColor: string;
  dangerColor: string;
  infoColor: string;
  safeIcon: string;          // Icons replace color-only signals
  warnIcon: string;
  dangerIcon: string;
  fontSizeBase: string;
  fontSizeSm: string;
  fontSizeXs: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSizeXxl: string;
  spacing: 'compact' | 'normal' | 'spacious';
  showLabels: boolean;       // Always show text labels on icons
  simplifiedLayout: boolean;
  glareReduction: boolean;
  nightMode: boolean;
}

// ─── Default (Standard) Theme ────────────────────────────────
const standardTheme: InterfaceTheme = {
  textScale: 1.0,
  contrastClass: '',
  bgPrimary: '#0a0e1a',
  bgCard: '#141c2e',
  bgPanel: '#0f1628',
  border: '#1e2d4a',
  textPrimary: '#e2e8f0',
  textSecondary: '#64748b',
  safeColor: '#00d68f',
  warnColor: '#ffb300',
  dangerColor: '#ff4560',
  infoColor: '#6c63ff',
  safeIcon: '✓',
  warnIcon: '⚠',
  dangerIcon: '✕',
  fontSizeBase: '14px',
  fontSizeSm: '12px',
  fontSizeXs: '11px',
  fontSizeLg: '16px',
  fontSizeXl: '20px',
  fontSizeXxl: '28px',
  spacing: 'normal',
  showLabels: false,
  simplifiedLayout: false,
  glareReduction: false,
  nightMode: false,
};

// ─── Engine Class ────────────────────────────────────────────
export class VisionAdaptationEngine {
  private profile: AccessibilityProfile;

  constructor(profile: AccessibilityProfile) {
    this.profile = profile;
  }

  update(profile: AccessibilityProfile) {
    this.profile = profile;
  }

  // ── Derive interface theme from accessibility profile ──────
  getTheme(): InterfaceTheme {
    const p = this.profile;
    const theme = { ...standardTheme };

    // Text Size
    if (p.textSize === 'large') {
      theme.textScale = 1.3;
      theme.fontSizeBase = '16px';
      theme.fontSizeSm = '14px';
      theme.fontSizeXs = '13px';
      theme.fontSizeLg = '19px';
      theme.fontSizeXl = '24px';
      theme.fontSizeXxl = '34px';
      theme.spacing = 'spacious';
    } else if (p.textSize === 'x-large') {
      theme.textScale = 1.6;
      theme.fontSizeBase = '19px';
      theme.fontSizeSm = '17px';
      theme.fontSizeXs = '15px';
      theme.fontSizeLg = '23px';
      theme.fontSizeXl = '28px';
      theme.fontSizeXxl = '40px';
      theme.spacing = 'spacious';
    }

    // Contrast
    if (p.contrastMode === 'high') {
      theme.bgPrimary = '#030508';
      theme.bgCard = '#050a14';
      theme.bgPanel = '#040810';
      theme.border = '#2a4a7a';
      theme.textPrimary = '#ffffff';
      theme.textSecondary = '#a0b4cc';
      theme.contrastClass = 'high-contrast';
    } else if (p.contrastMode === 'max') {
      theme.bgPrimary = '#000000';
      theme.bgCard = '#000000';
      theme.bgPanel = '#0a0a0a';
      theme.border = '#ffffff';
      theme.textPrimary = '#ffffff';
      theme.textSecondary = '#cccccc';
      theme.contrastClass = 'max-contrast';
    }

    // Glare reduction
    if (p.glareMode) {
      theme.glareReduction = true;
      theme.bgPrimary = '#080c18';
      theme.bgCard = '#0c1220';
      theme.textPrimary = '#d0dae8';
    }

    // Night mode
    if (p.nightMode) {
      theme.nightMode = true;
      theme.bgPrimary = '#04060f';
      theme.bgCard = '#080d1a';
      theme.textSecondary = '#4a6080';
    }

    // Color-independent mode — keep color but add extra indicators
    if (p.colorIndependentWarnings) {
      theme.safeIcon = '✓ [SAFE]';
      theme.warnIcon = '⚠ [CAUTION]';
      theme.dangerIcon = '⛔ [DANGER]';
      theme.showLabels = true;
    }

    // Simplified layout
    if (p.simplifiedMode) {
      theme.simplifiedLayout = true;
      theme.spacing = 'spacious';
    }

    return theme;
  }

  // ── Adapt a warning to the driver's profile ─────────────────
  adaptWarning(warning: Warning): AdaptedWarning {
    const p = this.profile;
    const isLowVision = p.conditions.includes('low_vision');
    const isColorAccessible = p.colorIndependentWarnings;
    const isVoiceFirst = p.voiceEnabled;
    const isSimplified = p.simplifiedMode;

    const riskLabels: Record<RiskLevel, string> = {
      LOW: 'LOW RISK',
      MEDIUM: 'MEDIUM RISK',
      HIGH: 'HIGH RISK',
      CRITICAL: 'CRITICAL',
    };

    const actionMap: Record<string, string> = {
      '4': 'STOP IMMEDIATELY',
      '3': 'SLOW DOWN',
      '2': 'PROCEED WITH CAUTION',
      '1': 'INFORMATION',
    };

    const adapted: AdaptedWarning = {
      id: warning.id,
      level: warning.level,
      icon: this.getWarningIcon(warning),
      title: isLowVision
        ? warning.title.toUpperCase()
        : warning.title,
      detail: isLowVision
        ? this.expandDetail(warning)
        : warning.detail,
      distance: warning.distance,
      risk: warning.risk,
      riskLabel: riskLabels[warning.risk],
      actionText: actionMap[String(warning.level)] ?? 'MONITOR',
      voiceText: warning.voiceText,
      showVoiceIndicator: isVoiceFirst && warning.level >= 2,
      emphasis: warning.level === 4 ? 'critical' : warning.level === 3 ? 'high' : 'normal',
      usePattern: isColorAccessible,
    };

    return adapted;
  }

  private expandDetail(w: Warning): string {
    let detail = w.detail;
    if (w.distance) detail += `\n${w.distance} METERS AWAY`;
    if (w.level === 4) detail += '\nACTION REQUIRED';
    if (w.level === 3) detail += '\nREDUCE SPEED';
    return detail;
  }

  private getWarningIcon(w: Warning): string {
    const map: Record<string, string> = {
      car: '🚗',
      'person-standing': '🚶',
      'alert-triangle': '⚠',
      'triangle-alert': '⚠',
      'arrow-left': '←',
      octagon: '🛑',
      gauge: '⊙',
      'corner-down-right': '↷',
      moon: '🌙',
      ban: '⛔',
      'hard-hat': '⚠',
      navigation: '↗',
      'cloud-fog': '🌫',
      siren: '🚨',
    };
    return map[w.icon] ?? '⚠';
  }

  // ── Should voice be spoken for this warning? ─────────────────
  shouldSpeak(warning: Warning): boolean {
    const p = this.profile;
    if (!p.voiceEnabled) return false;
    if (p.alertPriority === 'critical-only') return warning.level === 4;
    if (p.alertPriority === 'high') return warning.level >= 3;
    return warning.level >= 2;
  }

  // ── CSS classes derived from profile ─────────────────────────
  getBodyClasses(): string {
    const classes: string[] = [];
    const p = this.profile;
    if (p.contrastMode === 'high' || p.contrastMode === 'max') classes.push('high-contrast');
    if (p.textSize !== 'normal') classes.push('large-text');
    if (p.simplifiedMode) classes.push('simplified');
    if (p.glareMode) classes.push('glare-mode');
    if (p.nightMode) classes.push('night-mode');
    return classes.join(' ');
  }

  // ── Summary of active adaptations ────────────────────────────
  getAdaptationSummary(): { label: string; active: boolean; description: string }[] {
    const p = this.profile;
    return [
      { label: 'High Contrast', active: p.contrastMode !== 'normal', description: 'Enhanced contrast for better visibility' },
      { label: 'Large Text', active: p.textSize !== 'normal', description: 'Scaled text for easier reading' },
      { label: 'Color-Independent Warnings', active: p.colorIndependentWarnings, description: 'Icons + text replace color-only signals' },
      { label: 'Voice Safety Alerts', active: p.voiceEnabled, description: 'Spoken warnings for critical events' },
      { label: 'Simplified Dashboard', active: p.simplifiedMode, description: 'Non-critical information minimized' },
      { label: 'Enhanced Object Labels', active: p.enhancedLabels, description: 'Larger labels on detected objects' },
      { label: 'Glare Reduction', active: p.glareMode, description: 'Reduced screen brightness and glare' },
      { label: 'Night Visibility Mode', active: p.nightMode, description: 'Optimized for low-light driving' },
    ];
  }
}

// ─── Factory helper ──────────────────────────────────────────
export function buildProfileFromConditions(
  conditions: VisionCondition[],
  answers: {
    colorDifficulty?: string[];
    textSizeDifficulty?: string;
    glareSensitivity?: string;
    voicePreference?: string;
    simplifiedDashboard?: boolean;
    warningRecognitionDifficulty?: string;
  }
): AccessibilityProfile {
  const hasLowVision = conditions.includes('low_vision');
  const hasColorGeneral = conditions.includes('color_general');
  const hasRedGreen = conditions.includes('red_green');
  const hasBlueYellow = conditions.includes('blue_yellow');
  const hasSmallText = conditions.includes('small_text');
  const hasLowContrast = conditions.includes('low_contrast');
  const hasGlare = conditions.includes('glare');
  const hasNight = conditions.includes('night');
  const hasVoice = conditions.includes('voice_prefer');
  const hasSimplified = conditions.includes('simplified');
  const hasSlowRecognition = conditions.includes('slow_recognition');

  const needsLargeText = hasLowVision || hasSmallText;
  const needsHighContrast = hasLowVision || hasLowContrast || hasNight;
  const needsColorIndependent = hasColorGeneral || hasRedGreen || hasBlueYellow;
  const needsVoice = hasVoice || answers.voicePreference === 'Always' || answers.voicePreference === 'For important warnings';
  const needsSimplified = hasSimplified || answers.simplifiedDashboard === true;

  let visionMode: VisionMode = 'standard';
  if (hasRedGreen) visionMode = 'red_green';
  else if (hasBlueYellow) visionMode = 'blue_yellow';
  else if (hasColorGeneral) visionMode = 'color_accessible';
  else if (hasLowVision) visionMode = 'low_vision';
  else if (needsHighContrast) visionMode = 'high_contrast';
  else if (hasGlare) visionMode = 'glare_reduction';
  else if (hasNight) visionMode = 'night_visibility';
  else if (hasVoice) visionMode = 'voice_first';
  else if (needsSimplified) visionMode = 'simplified';

  const alertPriority = hasSlowRecognition ? 'high' : needsVoice ? 'high' : 'normal';

  return {
    conditions,
    colorDifficulty: answers.colorDifficulty ?? [],
    textSizeDifficulty: answers.textSizeDifficulty ?? 'Never',
    glareSensitivity: answers.glareSensitivity ?? 'No',
    voicePreference: answers.voicePreference ?? 'No',
    simplifiedDashboard: needsSimplified,
    warningRecognitionDifficulty: answers.warningRecognitionDifficulty ?? 'No',
    visionMode,
    textSize: hasLowVision ? 'x-large' : needsLargeText ? 'large' : 'normal',
    contrastMode: hasLowVision || (needsHighContrast && hasLowVision) ? 'max' : needsHighContrast ? 'high' : 'normal',
    colorIndependentWarnings: needsColorIndependent,
    voiceEnabled: needsVoice,
    voiceSpeed: hasSlowRecognition ? 0.8 : 1.0,
    alertPriority,
    simplifiedMode: needsSimplified,
    glareMode: hasGlare,
    nightMode: hasNight,
    enhancedLabels: hasLowVision || needsLargeText,
  };
}

// ─── Default accessibility profile ──────────────────────────
export const defaultAccessibilityProfile: AccessibilityProfile = {
  conditions: ['none'],
  colorDifficulty: [],
  textSizeDifficulty: 'Never',
  glareSensitivity: 'No',
  voicePreference: 'No',
  simplifiedDashboard: false,
  warningRecognitionDifficulty: 'No',
  visionMode: 'standard',
  textSize: 'normal',
  contrastMode: 'normal',
  colorIndependentWarnings: false,
  voiceEnabled: false,
  voiceSpeed: 1.0,
  alertPriority: 'normal',
  simplifiedMode: false,
  glareMode: false,
  nightMode: false,
  enhancedLabels: false,
};
