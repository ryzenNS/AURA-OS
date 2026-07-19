export enum UserMode {
  FAN = "FAN",
  VOLUNTEER = "VOLUNTEER",
  COMMAND_CENTER = "COMMAND_CENTER"
}

export interface StadiumState {
  capacity: number;
  attendance: number;
  gateAStatus: string;
  gateBStatus: string;
  gateCStatus: string;
  gateDStatus: string;
  gateEStatus: string;
  weather: string;
  metroDelay: number;
  busDelay: number;
  parkingOccupancy: number;
  medicalTeamsActive: number;
  volunteersAvailable: number;
  securityStaff: number;
  lastUpdated: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "fan" | "volunteer" | "staff";
  photoUrl: string;
  about: string;
  isLoggedIn: boolean;
  credentialId?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "aura";
  text: string;
  timestamp: string;
  mode: UserMode;
  thinking?: string; // Optional reasoning trace or thinking steps
  structuredResponse?: AuraStructuredResponse;
  simulationResponse?: AuraSimulationResponse;
  plainText?: string;
}

export interface AuraStructuredResponse {
  situationSummary: string;
  immediateRisks: string[];
  recommendedActions: string[];
  reasoning: string;
  accessibilityConsiderations: string;
  sustainabilityImpact: string;
  alternativeOptions: string[];
  confidenceScore: number;
  estimatedImpact: string;
  nextBestAction: string;
}

export interface AuraSimulationResponse {
  currentSituation: string;
  predictedTimeline: {
    fiveMin: string;
    tenMin: string;
    twentyMin: string;
    thirtyMin: string;
    sixtyMin: string;
  };
  crowdRedistribution: string;
  volunteerDeployment: string;
  medicalImpact: string;
  transportImpact: string;
  accessibilityImpact: string;
  recommendedPublicAnnouncements: string[];
  emergencyActions: string[];
  recoveryPlan: string;
  confidenceScore: number;
  lessonsLearned: string;
}

export interface DemonstrationScenario {
  id: string;
  title: string;
  description: string;
  category: "fan" | "volunteer" | "command";
  query: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "Meals" | "Snacks" | "Drinks" | "Sweets";
  isAvailable: boolean;
  tags?: string[]; // e.g. ["Vegetarian", "Halal", "Gluten-Free"]
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface FoodOrder {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: string;
  status: "pending" | "preparing" | "completed" | "delivered";
  customerName: string;
  customerPhone: string;
  deliverySeat: string;
  notes?: string;
}

