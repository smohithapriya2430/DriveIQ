import type {
  SimulationScenario,
  DetectedObject,
  EnvironmentState,
  VehicleState,
  DrivingDecision,
  Warning,
} from '../types';

// ─── Default Vehicle State ───────────────────────────────────
export const defaultVehicleState: VehicleState = {
  speed: 48,
  gear: 'D',
  batteryLevel: 82,
  mode: 'Autonomous',
  status: 'NOMINAL',
};

// ─── Default Environment ─────────────────────────────────────
export const defaultEnvironment: EnvironmentState = {
  roadType: 'Urban Road',
  weather: 'Clear',
  visibility: 'Good',
  trafficDensity: 'Light',
  laneCondition: 'Clear',
  timeOfDay: 'Day',
  speedLimit: 50,
};

// ─── Scenarios ───────────────────────────────────────────────
export const scenarios: SimulationScenario[] = [
  {
    id: 'normal',
    name: 'Normal Road',
    description: 'Standard urban road driving with clear conditions',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 50 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 38, relativeSpeed: -2, risk: 'LOW', confidence: 97, x: 38, y: 25, width: 20, height: 15 },
    ],
    decision: { action: 'MAINTAIN LANE', reason: 'Clear road ahead', nextAction: 'Continue straight', riskLevel: 'LOW' },
    warnings: [
      { id: 'w1', level: 1, title: 'Navigation Active', detail: 'Following planned route', risk: 'LOW', voiceText: 'Navigation active. Following planned route.', timestamp: Date.now(), icon: 'navigation' },
    ],
  },
  {
    id: 'vehicle_ahead',
    name: 'Vehicle Ahead',
    description: 'Vehicle detected at close range – reduce speed',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Moderate', speedLimit: 50 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 14, relativeSpeed: -12, risk: 'HIGH', confidence: 98, x: 36, y: 28, width: 26, height: 18 },
      { id: 'v2', type: 'vehicle', label: 'VEHICLE', distance: 42, relativeSpeed: -5, risk: 'LOW', confidence: 91, x: 12, y: 22, width: 18, height: 13 },
    ],
    decision: { action: 'REDUCE SPEED', reason: 'Close following distance', nextAction: 'Maintain safe gap', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'VEHICLE AHEAD', detail: 'Distance: 14 m – Reduce speed immediately', distance: 14, risk: 'HIGH', voiceText: 'Warning. Vehicle detected ahead. Distance fourteen meters. Please reduce speed.', timestamp: Date.now(), icon: 'car' },
    ],
  },
  {
    id: 'pedestrian',
    name: 'Pedestrian Crossing',
    description: 'Pedestrian detected crossing the road',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 30 },
    objects: [
      { id: 'p1', type: 'pedestrian', label: 'PEDESTRIAN', distance: 18, relativeSpeed: 0, risk: 'HIGH', confidence: 95, x: 48, y: 40, width: 8, height: 22 },
      { id: 'p2', type: 'pedestrian', label: 'PEDESTRIAN', distance: 20, relativeSpeed: 0, risk: 'MEDIUM', confidence: 88, x: 57, y: 40, width: 8, height: 22 },
    ],
    decision: { action: 'STOP FOR PEDESTRIAN', reason: 'Pedestrians in crossing', nextAction: 'Wait for crossing to clear', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'PEDESTRIAN CROSSING', detail: 'Distance: 18 m – Stopping', distance: 18, risk: 'HIGH', voiceText: 'Warning. Pedestrian crossing detected. Distance eighteen meters. Vehicle stopping.', timestamp: Date.now(), icon: 'person-standing' },
    ],
  },
  {
    id: 'sudden_brake',
    name: 'Sudden Braking',
    description: 'Vehicle ahead braking sharply',
    environment: { roadType: 'Highway', weather: 'Clear', visibility: 'Excellent', trafficDensity: 'Moderate', speedLimit: 100 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 8, relativeSpeed: -35, risk: 'CRITICAL', confidence: 99, x: 34, y: 30, width: 28, height: 20 },
    ],
    decision: { action: 'EMERGENCY BRAKE', reason: 'Sudden deceleration detected', nextAction: 'Full brake applied', riskLevel: 'CRITICAL' },
    warnings: [
      { id: 'w1', level: 4, title: 'COLLISION RISK', detail: 'Vehicle braking sharply – 8 m – EMERGENCY STOP', distance: 8, risk: 'CRITICAL', voiceText: 'Critical warning. Collision risk. Emergency braking activated. Vehicle ahead stopping sharply.', timestamp: Date.now(), icon: 'alert-triangle' },
    ],
  },
  {
    id: 'obstacle',
    name: 'Obstacle on Road',
    description: 'Static obstacle detected in lane',
    environment: { roadType: 'Highway', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 80 },
    objects: [
      { id: 'o1', type: 'obstacle', label: 'OBSTACLE', distance: 22, relativeSpeed: 80, risk: 'CRITICAL', confidence: 94, x: 40, y: 38, width: 18, height: 12 },
    ],
    decision: { action: 'EMERGENCY LANE CHANGE', reason: 'Static obstacle in lane', nextAction: 'Merge to adjacent lane', riskLevel: 'CRITICAL' },
    warnings: [
      { id: 'w1', level: 4, title: 'OBSTACLE DETECTED', detail: 'Stationary object – 22 m ahead', distance: 22, risk: 'CRITICAL', voiceText: 'Critical warning. Immediate obstacle detected. Emergency lane change initiated.', timestamp: Date.now(), icon: 'triangle-alert' },
    ],
  },
  {
    id: 'lane_change',
    name: 'Lane Change',
    description: 'Performing safe lane change maneuver',
    environment: { roadType: 'Highway', weather: 'Clear', visibility: 'Good', trafficDensity: 'Moderate', speedLimit: 100 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 25, relativeSpeed: -8, risk: 'MEDIUM', confidence: 96, x: 38, y: 30, width: 22, height: 16 },
      { id: 'v2', type: 'vehicle', label: 'VEHICLE', distance: 15, relativeSpeed: 5, risk: 'MEDIUM', confidence: 90, x: 70, y: 38, width: 18, height: 13 },
    ],
    decision: { action: 'CHANGE LANE LEFT', reason: 'Overtaking slower vehicle', nextAction: 'Resume cruise speed', riskLevel: 'MEDIUM' },
    warnings: [
      { id: 'w1', level: 2, title: 'LANE CHANGE INITIATED', detail: 'Moving to left lane – monitoring blind spots', risk: 'MEDIUM', voiceText: 'Caution. Lane change initiated. Monitoring adjacent lane.', timestamp: Date.now(), icon: 'arrow-left' },
    ],
  },
  {
    id: 'traffic_sign',
    name: 'Traffic Sign Detection',
    description: 'Traffic signs detected ahead',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 30 },
    objects: [
      { id: 's1', type: 'sign', label: 'STOP SIGN', distance: 35, relativeSpeed: 48, risk: 'MEDIUM', confidence: 99, x: 42, y: 15, width: 12, height: 18 },
      { id: 's2', type: 'sign', label: 'SPEED LIMIT 30', distance: 55, relativeSpeed: 48, risk: 'LOW', confidence: 97, x: 20, y: 18, width: 10, height: 15 },
    ],
    decision: { action: 'PREPARE TO STOP', reason: 'Stop sign detected', nextAction: 'Stop at sign', riskLevel: 'MEDIUM' },
    warnings: [
      { id: 'w1', level: 2, title: 'STOP SIGN AHEAD', detail: 'Distance: 35 m – Reducing speed', distance: 35, risk: 'MEDIUM', voiceText: 'Caution. Stop sign detected at thirty-five meters. Reducing speed.', timestamp: Date.now(), icon: 'octagon' },
      { id: 'w2', level: 1, title: 'SPEED LIMIT 30', detail: 'Zone speed limit active', risk: 'LOW', voiceText: 'Speed limit is thirty kilometers per hour.', timestamp: Date.now(), icon: 'gauge' },
    ],
  },
  {
    id: 'sharp_curve',
    name: 'Sharp Curve',
    description: 'Sharp curve detected on road ahead',
    environment: { roadType: 'Highway', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 60 },
    objects: [],
    decision: { action: 'REDUCE SPEED', reason: 'Sharp curve ahead', nextAction: 'Navigate curve safely', riskLevel: 'MEDIUM' },
    warnings: [
      { id: 'w1', level: 2, title: 'SHARP CURVE AHEAD', detail: 'Reducing speed for safe curve navigation', risk: 'MEDIUM', voiceText: 'Caution. Sharp curve ahead. Reducing speed.', timestamp: Date.now(), icon: 'corner-down-right' },
    ],
  },
  {
    id: 'heavy_traffic',
    name: 'Heavy Traffic',
    description: 'Dense traffic conditions',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Heavy', speedLimit: 50 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 6, relativeSpeed: -3, risk: 'HIGH', confidence: 99, x: 36, y: 32, width: 26, height: 18 },
      { id: 'v2', type: 'vehicle', label: 'VEHICLE', distance: 18, relativeSpeed: -5, risk: 'MEDIUM', confidence: 95, x: 14, y: 26, width: 20, height: 15 },
      { id: 'v3', type: 'vehicle', label: 'BUS', distance: 28, relativeSpeed: -2, risk: 'LOW', confidence: 92, x: 62, y: 24, width: 28, height: 18 },
    ],
    decision: { action: 'FOLLOW VEHICLE', reason: 'Dense traffic – adaptive cruise', nextAction: 'Maintain safe following distance', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'DENSE TRAFFIC', detail: 'Vehicle 6 m ahead – slow traffic', distance: 6, risk: 'HIGH', voiceText: 'Warning. Dense traffic detected. Vehicle six meters ahead. Reducing speed.', timestamp: Date.now(), icon: 'car' },
    ],
  },
  {
    id: 'poor_visibility',
    name: 'Poor Visibility',
    description: 'Fog reducing road visibility significantly',
    environment: { roadType: 'Highway', weather: 'Fog', visibility: 'Poor', trafficDensity: 'Light', speedLimit: 40 },
    objects: [
      { id: 'v1', type: 'vehicle', label: 'VEHICLE', distance: 20, relativeSpeed: -10, risk: 'HIGH', confidence: 72, x: 38, y: 30, width: 22, height: 16 },
    ],
    decision: { action: 'REDUCE SPEED', reason: 'Reduced visibility – fog conditions', nextAction: 'Increase following distance', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'POOR VISIBILITY', detail: 'Fog detected – enhanced sensors active', risk: 'HIGH', voiceText: 'Warning. Poor visibility due to fog. Speed reduced. Enhanced detection active.', timestamp: Date.now(), icon: 'cloud-fog' },
    ],
  },
  {
    id: 'night',
    name: 'Night Driving',
    description: 'Night driving with reduced ambient light',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Moderate', trafficDensity: 'Light', speedLimit: 50, timeOfDay: 'Night' },
    objects: [
      { id: 'p1', type: 'pedestrian', label: 'PEDESTRIAN', distance: 22, relativeSpeed: 0, risk: 'HIGH', confidence: 81, x: 50, y: 42, width: 8, height: 20 },
    ],
    decision: { action: 'SLOW DOWN', reason: 'Night conditions – pedestrian detected', nextAction: 'Enhanced night detection active', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'NIGHT VISIBILITY REDUCED', detail: 'Enhanced sensors active', risk: 'HIGH', voiceText: 'Night driving mode active. Pedestrian detected at twenty-two meters.', timestamp: Date.now(), icon: 'moon' },
    ],
  },
  {
    id: 'emergency_vehicle',
    name: 'Emergency Vehicle',
    description: 'Emergency vehicle approaching from behind',
    environment: { roadType: 'Urban Road', weather: 'Clear', visibility: 'Good', trafficDensity: 'Moderate', speedLimit: 50 },
    objects: [
      { id: 'e1', type: 'vehicle', label: 'EMERGENCY VEHICLE', distance: 45, relativeSpeed: -60, risk: 'CRITICAL', confidence: 98, x: 38, y: 65, width: 22, height: 16 },
    ],
    decision: { action: 'YIELD – PULL OVER', reason: 'Emergency vehicle approaching', nextAction: 'Pull to side – allow passage', riskLevel: 'CRITICAL' },
    warnings: [
      { id: 'w1', level: 4, title: 'EMERGENCY VEHICLE', detail: 'Pulling over to yield', distance: 45, risk: 'CRITICAL', voiceText: 'Emergency vehicle approaching from behind. Yielding and pulling to side of road.', timestamp: Date.now(), icon: 'siren' },
    ],
  },
  {
    id: 'construction',
    name: 'Construction Zone',
    description: 'Active construction zone with reduced lanes',
    environment: { roadType: 'Construction Zone', weather: 'Clear', visibility: 'Good', trafficDensity: 'Heavy', speedLimit: 30 },
    objects: [
      { id: 'c1', type: 'obstacle', label: 'BARRIER', distance: 25, relativeSpeed: 30, risk: 'HIGH', confidence: 99, x: 68, y: 42, width: 14, height: 20 },
      { id: 'w1o', type: 'obstacle', label: 'CONE', distance: 15, relativeSpeed: 30, risk: 'MEDIUM', confidence: 97, x: 55, y: 50, width: 6, height: 10 },
    ],
    decision: { action: 'SLOW DOWN – NAVIGATE SAFELY', reason: 'Construction zone active', nextAction: 'Follow temporary lane markings', riskLevel: 'HIGH' },
    warnings: [
      { id: 'w1', level: 3, title: 'CONSTRUCTION ZONE', detail: 'Reduced lanes – 30 km/h limit', risk: 'HIGH', voiceText: 'Construction zone ahead. Speed limit thirty kilometers per hour. Stay in lane.', timestamp: Date.now(), icon: 'hard-hat' },
    ],
  },
  {
    id: 'road_blockage',
    name: 'Sudden Road Blockage',
    description: 'Sudden obstruction across road',
    environment: { roadType: 'Highway', weather: 'Clear', visibility: 'Good', trafficDensity: 'Light', speedLimit: 80 },
    objects: [
      { id: 'o1', type: 'obstacle', label: 'ROAD BLOCKAGE', distance: 12, relativeSpeed: 80, risk: 'CRITICAL', confidence: 96, x: 20, y: 35, width: 58, height: 20 },
    ],
    decision: { action: 'EMERGENCY STOP', reason: 'Road fully blocked', nextAction: 'Full emergency stop', riskLevel: 'CRITICAL' },
    warnings: [
      { id: 'w1', level: 4, title: 'ROAD BLOCKED', detail: 'EMERGENCY STOP – Full road blockage', distance: 12, risk: 'CRITICAL', voiceText: 'Critical alert. Road blocked ahead. Emergency stop activated.', timestamp: Date.now(), icon: 'ban' },
    ],
  },
];

// ─── Analytics Mock Data ─────────────────────────────────────
export const analyticsData = {
  warningFrequency: [
    { name: 'Mon', info: 12, caution: 8, warning: 5, critical: 1 },
    { name: 'Tue', info: 15, caution: 10, warning: 6, critical: 2 },
    { name: 'Wed', info: 10, caution: 7, warning: 3, critical: 0 },
    { name: 'Thu', info: 18, caution: 12, warning: 7, critical: 3 },
    { name: 'Fri', info: 22, caution: 15, warning: 9, critical: 2 },
    { name: 'Sat', info: 8, caution: 5, warning: 2, critical: 0 },
    { name: 'Sun', info: 6, caution: 4, warning: 1, critical: 0 },
  ],
  objectDetection: [
    { name: 'Vehicles', value: 142 },
    { name: 'Pedestrians', value: 38 },
    { name: 'Cyclists', value: 17 },
    { name: 'Signs', value: 89 },
    { name: 'Obstacles', value: 12 },
  ],
  accessibilityAdaptations: [
    { name: 'High Contrast', count: 28 },
    { name: 'Large Text', count: 22 },
    { name: 'Voice Alerts', count: 45 },
    { name: 'Color-Independent', count: 31 },
    { name: 'Simplified UI', count: 19 },
  ],
  scenarioPerformance: [
    { scenario: 'Normal', warnings: 3 },
    { scenario: 'Pedestrian', warnings: 8 },
    { scenario: 'Traffic', warnings: 12 },
    { scenario: 'Night', warnings: 9 },
    { scenario: 'Emergency', warnings: 6 },
  ],
};
