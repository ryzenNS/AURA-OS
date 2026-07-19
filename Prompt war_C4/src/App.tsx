import { useState, useEffect } from "react";
import { UserMode, StadiumState, UserProfile, ChatMessage, DemonstrationScenario, FoodOrder } from "./types";
import { StadiumVisualizer } from "./components/StadiumVisualizer";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { OperationsSidebar } from "./components/OperationsSidebar";
import { AuraChat } from "./components/AuraChat";
import { LiveScoresBar } from "./components/LiveScoresBar";
import { LoginPortal } from "./components/LoginPortal";
import { AuraLogo } from "./components/AuraLogo";

// Import custom premium Material Design 3 Companion components
import { HomeDashboard } from "./components/HomeDashboard";
import { ExplorerTwin } from "./components/ExplorerTwin";
import { AiConcierge } from "./components/AiConcierge";
import { SmartNavigation } from "./components/SmartNavigation";
import { MatchCompanion } from "./components/MatchCompanion";
import { FoodAI } from "./components/FoodAI";
import { ShoppingAI } from "./components/ShoppingAI";
import { AccessibilityAI } from "./components/AccessibilityAI";
import { EmergencyAI } from "./components/EmergencyAI";
import { SustainabilityTracker } from "./components/SustainabilityTracker";
import { SettingsAI } from "./components/SettingsAI";
import { LostAndFoundAI } from "./components/LostAndFoundAI";

import {
  Brain,
  Sliders,
  Sparkles,
  Clock,
  Heart,
  Baby,
  Shield,
  MapPin,
  Compass,
  Award,
  AlertTriangle,
  Globe,
  HelpCircle,
  Eye,
  Info,
  ChevronRight,
  ChevronLeft,
  Activity,
  ShieldAlert,
  Utensils,
  Leaf,
  ShoppingBag,
  Settings,
  Accessibility,
  Search,
} from "lucide-react";

export type AudiencePerspective = "KIDS_PARENTS" | "GENERAL_FANS" | "STAFF_ORGANIZERS";

const DEFAULT_STADIUM_STATE: StadiumState = {
  capacity: 80000,
  attendance: 68500,
  gateAStatus: "Normal",
  gateBStatus: "Heavy Congestion",
  gateCStatus: "Security Alert",
  gateDStatus: "Open",
  gateEStatus: "Moderate",
  weather: "Light Rain",
  metroDelay: 15,
  busDelay: 8,
  parkingOccupancy: 82,
  medicalTeamsActive: 5,
  volunteersAvailable: 240,
  securityStaff: 170,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Stadium Guest",
  email: "guest@fifa.com",
  phone: "+1 (555) 2026-FIFA",
  role: "fan",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  about: "World Cup 2026 Enthusiast",
  isLoggedIn: false,
};

export default function App() {
  const [stadiumState, setStadiumState] = useState<StadiumState>(DEFAULT_STADIUM_STATE);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeMode, setActiveMode] = useState<UserMode>(UserMode.FAN);
  const [perspective, setPerspective] = useState<AudiencePerspective>("GENERAL_FANS");
  
  // Custom Dynamic Portal States
  const [activeTab, setActiveTab] = useState<string>("HOME");
  const [selectedLocationCategory, setSelectedLocationCategory] = useState<string>("ALL");
  const [selectedCctvCamera, setSelectedCctvCamera] = useState<string>("cctv-gate-b");
  const [stadiumOrders, setStadiumOrders] = useState<FoodOrder[]>([]);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Chat messaging state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGateInfo, setSelectedGateInfo] = useState<{ name: string; status: string } | null>(null);

  // Accessibility global states
  const [accessibilityPrefs, setAccessibilityPrefs] = useState({
    highContrast: false,
    colorBlind: false,
    largeText: false,
    voiceGuide: false,
  });

  // Set sidebar closed on mobile screens initially for enhanced usability
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Live clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update live clock every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getAvailableTabs = () => {
    return [
      { id: "HOME", label: "🏠 Home", icon: Sparkles, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "EXPLORE", label: "🛰️ Explore", icon: Eye, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "AI_CONCIERGE", label: "🤖 AI Concierge", icon: Brain, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "NAVIGATION", label: "🗺️ Navigation", icon: Compass, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "MATCH", label: "⚽ Match Day", icon: Award, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "FOOD", label: "🍔 Food AI", icon: Utensils, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "SHOPPING", label: "🛍️ Shopping AI", icon: ShoppingBag, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "ACCESSIBILITY", label: "♿ Accessibility", icon: Accessibility, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "EMERGENCY", label: "🚨 Emergency AI", icon: ShieldAlert, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "SUSTAINABILITY", label: "🌱 Sustainability", icon: Leaf, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "LOST_FOUND", label: "🔍 Lost & Found AI", icon: Search, colorClass: "bg-indigo-600 text-white shadow-sm" },
      { id: "SETTINGS", label: "⚙️ Settings AI", icon: Settings, colorClass: "bg-indigo-600 text-white shadow-sm" }
    ];
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "EXPLORE") {
      setPerspective("STAFF_ORGANIZERS");
      setActiveMode(UserMode.COMMAND_CENTER);
    } else {
      setPerspective("GENERAL_FANS");
      setActiveMode(UserMode.FAN);
    }
  };

  // Sync state with server on mount
  useEffect(() => {
    fetchStadiumState();
    fetchStadiumOrders();

    // Periodically sync orders to keep kitchen employee dashboards updated
    const interval = setInterval(() => {
      fetchStadiumOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStadiumOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setStadiumOrders(data);
      }
    } catch (err) {
      console.error("Failed to load stadium orders from server, using local fallback:", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchStadiumOrders();
      }
    } catch (err) {
      console.error("Failed to update order status on server:", err);
    }
  };

  const fetchStadiumState = async () => {
    try {
      const response = await fetch("/api/stadium-state");
      if (response.ok) {
        const data = await response.json();
        setStadiumState(data);
      }
    } catch (err) {
      console.error("Failed to load stadium state from server, using local fallback:", err);
    }
  };

  const handleUpdateStadiumState = async (newState: StadiumState) => {
    setStadiumState(newState);
    try {
      const response = await fetch("/api/stadium-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newState),
      });
      if (response.ok) {
        const data = await response.json();
        setStadiumState(data);
      }
    } catch (err) {
      console.error("Failed to broadcast updated state to server:", err);
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    
    // Auto-adjust active mode and perspective based on role sign-in for seamless UX
    if (newProfile.isLoggedIn) {
      setActiveTab("HOME");
      if (newProfile.role === "admin" || newProfile.role === "staff") {
        setPerspective("STAFF_ORGANIZERS");
        setActiveMode(UserMode.COMMAND_CENTER);
      } else if (newProfile.role === "volunteer") {
        setPerspective("GENERAL_FANS");
        setActiveMode(UserMode.VOLUNTEER);
      } else {
        setPerspective("GENERAL_FANS");
        setActiveMode(UserMode.FAN);
      }
    }
  };

  // Handles querying the server
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          mode: activeMode,
          userState: stadiumState,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const auraMsg: ChatMessage = {
          id: `msg-${Date.now()}-aura`,
          sender: "aura",
          text: data.plainText || "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          mode: activeMode,
          thinking: data.thinking || "",
          structuredResponse: data.structuredResponse || undefined,
          simulationResponse: data.simulationResponse || undefined,
          plainText: data.plainText || "",
        };
        setMessages((prev) => [...prev, auraMsg]);
      } else {
        throw new Error("Server responded with error status");
      }
    } catch (err: any) {
      console.error("Failed to fetch AURA response:", err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-aura-err`,
        sender: "aura",
        text: `I'm having trouble syncing with the primary neural grid. Retrying connection...`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode: activeMode,
        plainText: `⚠️ **AURA Server Connection Offline** \n\nWe could not connect to the server-side Gemini intelligence. Please ensure the dev server is active and the Google API Key is properly configured in the **Secrets** panel.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenario: DemonstrationScenario) => {
    // Automatically switch mode to match the scenario category for proper prompt customization
    if (scenario.category === "fan") {
      setActiveMode(UserMode.FAN);
    } else if (scenario.category === "volunteer") {
      setActiveMode(UserMode.VOLUNTEER);
    } else if (scenario.category === "command") {
      setActiveMode(UserMode.COMMAND_CENTER);
    }
    handleSendMessage(scenario.query);
  };

  const handleGateClick = (gateName: string, status: string) => {
    setSelectedGateInfo({ name: gateName, status });
    // Trigger auto-prompt about that gate
    handleSendMessage(`Generate stadium operations advice and crowd directives for ${gateName} which is currently marked as: "${status}".`);
  };

  if (!profile.isLoggedIn) {
    return <LoginPortal onLogin={handleUpdateProfile} />;
  }

  const highContrastClass = accessibilityPrefs.highContrast ? "contrast-200 bg-black text-white selection:bg-yellow-400 selection:text-black border-4 border-yellow-400" : "bg-slate-50 text-slate-800";
  const colorBlindClass = accessibilityPrefs.colorBlind ? "grayscale-50 contrast-125" : "";
  const largeTextClass = accessibilityPrefs.largeText ? "text-lg tracking-wide" : "";

  return (
    <div id="aura-app-root" className={`min-h-screen font-sans flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden ${highContrastClass} ${colorBlindClass} ${largeTextClass}`}>
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 relative z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0">
            <AuraLogo size="sm" showText={false} light={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                FIFA 2026 SECURE NETWORK
              </span>
              <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full"></span>
              <span className="text-xs text-slate-400 font-semibold">Stadion-Intelligence</span>
            </div>
            <h1 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight leading-none mt-1 flex items-center gap-1.5">
              <span>AURA</span> 
              <span className="font-light text-slate-500 hidden sm:inline">Automated Unified Resources &amp; Allocation OS</span>
            </h1>
          </div>
        </div>

        {/* Global Tagline (Hidden on tiny mobile) */}
        <p className="hidden xl:block text-xs font-semibold text-slate-500 italic">
          "One Stadium. Millions of Experiences. One Intelligence."
        </p>

        {/* Live Metrics Header Bar */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>UTC {currentTime.toISOString().slice(11, 19)}</span>
          </div>

          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-white hover:bg-gray-50 text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200 shadow-sm animate-[fadeIn_0.2s_ease-out]"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Control Panel</span>
            {isSidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Corner Profile Icon Toggler */}
          <div className="relative">
            <button
              id="header-profile-toggle-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative w-10 h-10 rounded-full border-2 border-indigo-600 hover:border-indigo-500 transition-all active:scale-95 overflow-hidden shadow-sm flex items-center justify-center cursor-pointer bg-slate-50"
              title="Click to view profile"
            >
              <img
                src={profile.photoUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>

            {isProfileOpen && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsProfileOpen(false)} 
                />
                
                {/* Dropdown Card */}
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-250 rounded-2xl p-4 shadow-xl z-50 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Active User Session
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      profile.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      profile.role === 'staff' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      profile.role === 'volunteer' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {profile.role}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-inner bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-sans font-black text-sm text-slate-800 truncate">{profile.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono block truncate">{profile.email}</span>
                      <span className="text-[10px] text-slate-500 font-mono block truncate">{profile.phone}</span>
                      {profile.credentialId && (
                        <span className="inline-block text-[9px] text-rose-600 font-mono font-bold mt-1 bg-rose-50 border border-rose-100/40 px-1.5 py-0.5 rounded text-center">
                          ID: {profile.credentialId}
                        </span>
                      )}
                    </div>
                  </div>

                  {profile.about && (
                    <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[11px] text-slate-600 italic font-sans leading-relaxed">
                        "{profile.about}"
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsSidebarOpen(true);
                      }}
                      className="flex-1 text-center py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-50 transition-colors font-bold text-slate-700 cursor-pointer"
                    >
                      Control Panel
                    </button>
                    <button
                      id="corner-profile-logout-btn"
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleUpdateProfile({
                          name: "",
                          email: "",
                          phone: "",
                          role: "fan",
                          photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                          about: "",
                          isLoggedIn: false
                        });
                      }}
                      className="flex-1 text-center py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs hover:bg-rose-100 transition-colors font-bold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Core Screen */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-300">
          
          {/* Live Tournament Ticker Bar */}
          <LiveScoresBar />

          {/* Audience Safety & Usability Filter Portal Bar */}
          <div id="audience-safety-usability-portal-bar" className="bg-white border border-gray-200 p-5 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-sm text-slate-800">
                  Audience Safety & Usability Filter Portal
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-normal">
                  Customize your World Cup experience or trigger advanced operations overrides. Select any tab below to display tailored tools and safety metrics.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-150">
              {getAvailableTabs().map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id.toLowerCase().replace("_", "-")}`}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? tab.colorClass
                        : "text-slate-600 hover:text-slate-950 hover:bg-white/50"
                    }`}
                  >
                    <TabIcon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC VIEW CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main view panel depending on selection */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "HOME" && (
                <HomeDashboard
                  stadiumState={stadiumState}
                  profile={profile}
                  onNavigateToTab={setActiveTab}
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "EXPLORE" && (
                <ExplorerTwin
                  stadiumState={stadiumState}
                  profile={profile}
                  onUpdateStadiumState={handleUpdateStadiumState}
                  stadiumOrders={stadiumOrders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onForceRefreshOrders={fetchStadiumOrders}
                  onSelectScenario={handleSelectScenario}
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "AI_CONCIERGE" && (
                <AiConcierge
                  profile={profile}
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "NAVIGATION" && (
                <SmartNavigation
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "MATCH" && (
                <MatchCompanion
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "FOOD" && (
                <FoodAI
                  profile={profile}
                  onOrderPlaced={(order) => {
                    const sysMessage: ChatMessage = {
                      id: "sys-" + Date.now(),
                      sender: "aura",
                      text: `🍽️ **AURA Seat-Delivery**: Successfully placed order **${order.id}** for **$${order.total.toFixed(2)}** delivery to **${order.deliverySeat}**! Stay tuned, we are preparing your hot stadium food.`,
                      timestamp: new Date().toLocaleTimeString(),
                      mode: activeMode,
                      plainText: `Placed order ${order.id}.`
                    };
                    setMessages(prev => [...prev, sysMessage]);
                    fetchStadiumOrders();
                  }}
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "SHOPPING" && (
                <ShoppingAI
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "ACCESSIBILITY" && (
                <AccessibilityAI
                  prefs={accessibilityPrefs}
                  onUpdatePrefs={setAccessibilityPrefs}
                  onAskAura={handleSendMessage}
                  onNavigateToTab={setActiveTab}
                  profile={profile}
                  stadiumState={stadiumState}
                  onUpdateStadiumState={handleUpdateStadiumState}
                />
              )}

              {activeTab === "EMERGENCY" && (
                <EmergencyAI
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "SUSTAINABILITY" && (
                <SustainabilityTracker
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "LOST_FOUND" && (
                <LostAndFoundAI
                  onAskAura={handleSendMessage}
                />
              )}

              {activeTab === "SETTINGS" && (
                <SettingsAI
                  onAskAura={handleSendMessage}
                  onClearCache={() => {
                    setProfile({
                      name: "Stadium Guest",
                      email: "guest@fifa.com",
                      phone: "+1 (555) 2026-FIFA",
                      role: "fan",
                      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                      about: "World Cup 2026 Enthusiast",
                      isLoggedIn: true,
                    });
                    setStadiumOrders([]);
                    setMessages([]);
                    setActiveTab("HOME");
                  }}
                />
              )}
            </div>

            {/* Global Context-Aware AURA AI Chat Panel */}
            <div className="lg:col-span-4">
              <div className="sticky top-6">
                <AuraChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  activeMode={activeMode}
                />
              </div>
            </div>
          </div>

        </main>

        {/* Backdrop overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Collapsible Slideout Operations Sidebar */}
        <aside
          id="operations-sidebar-drawer"
          className={`fixed inset-y-0 right-0 lg:static z-50 lg:z-auto h-full border-l border-gray-200 overflow-y-auto shrink-0 transition-all duration-300 bg-white ${
            isSidebarOpen 
              ? "w-[320px] sm:w-[360px] p-4 opacity-100 translate-x-0" 
              : "w-0 p-0 opacity-0 pointer-events-none translate-x-full lg:translate-x-0"
          }`}
        >
          {isSidebarOpen && (
            <OperationsSidebar
              stadiumState={stadiumState}
              onUpdateStadiumState={handleUpdateStadiumState}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </aside>

      </div>
    </div>
  );
}
