import React, { useState, useEffect } from "react";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  Info, 
  MapPin, 
  Smile, 
  ChevronRight,
  ShieldCheck,
  Flame,
  Sparkles,
  Sliders,
  RefreshCw,
  CheckCircle,
  Clock
} from "lucide-react";
import { UserProfile, StadiumState } from "../types";

interface AccessibilityPrefs {
  highContrast: boolean;
  colorBlind: boolean;
  largeText: boolean;
  voiceGuide: boolean;
}

interface AccessibilityAIProps {
  prefs: AccessibilityPrefs;
  onUpdatePrefs: (prefs: AccessibilityPrefs) => void;
  onAskAura: (prompt: string) => void;
  onNavigateToTab: (tabId: string) => void;
  profile?: UserProfile;
  stadiumState?: StadiumState;
  onUpdateStadiumState?: (newState: StadiumState) => void;
}

export const AccessibilityAI: React.FC<AccessibilityAIProps> = ({
  prefs,
  onUpdatePrefs,
  onAskAura,
  onNavigateToTab,
  profile,
  stadiumState,
  onUpdateStadiumState,
}) => {
  const [capacity, setCapacity] = useState(stadiumState?.capacity || 80000);
  const [attendance, setAttendance] = useState(stadiumState?.attendance || 74200);
  const [gateAStatus, setGateAStatus] = useState(stadiumState?.gateAStatus || "Normal");
  const [gateBStatus, setGateBStatus] = useState(stadiumState?.gateBStatus || "Normal");
  const [gateCStatus, setGateCStatus] = useState(stadiumState?.gateCStatus || "Normal");
  const [gateDStatus, setGateDStatus] = useState(stadiumState?.gateDStatus || "Normal");
  const [gateEStatus, setGateEStatus] = useState(stadiumState?.gateEStatus || "Normal");
  const [weather, setWeather] = useState(stadiumState?.weather || "Rainy");
  const [metroDelay, setMetroDelay] = useState(stadiumState?.metroDelay || 0);
  const [busDelay, setBusDelay] = useState(stadiumState?.busDelay || 0);
  const [parkingOccupancy, setParkingOccupancy] = useState(stadiumState?.parkingOccupancy || 0);
  const [medicalTeamsActive, setMedicalTeamsActive] = useState(stadiumState?.medicalTeamsActive || 0);
  const [volunteersAvailable, setVolunteersAvailable] = useState(stadiumState?.volunteersAvailable || 0);
  const [securityStaff, setSecurityStaff] = useState(stadiumState?.securityStaff || 0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (stadiumState) {
      setCapacity(stadiumState.capacity);
      setAttendance(stadiumState.attendance);
      setGateAStatus(stadiumState.gateAStatus);
      setGateBStatus(stadiumState.gateBStatus);
      setGateCStatus(stadiumState.gateCStatus);
      setGateDStatus(stadiumState.gateDStatus);
      setGateEStatus(stadiumState.gateEStatus);
      setWeather(stadiumState.weather);
      setMetroDelay(stadiumState.metroDelay);
      setBusDelay(stadiumState.busDelay);
      setParkingOccupancy(stadiumState.parkingOccupancy);
      setMedicalTeamsActive(stadiumState.medicalTeamsActive);
      setVolunteersAvailable(stadiumState.volunteersAvailable);
      setSecurityStaff(stadiumState.securityStaff);
    }
  }, [stadiumState]);

  const handleSaveStadiumState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateStadiumState) return;

    onUpdateStadiumState({
      capacity,
      attendance,
      gateAStatus,
      gateBStatus,
      gateCStatus,
      gateDStatus,
      gateEStatus,
      weather,
      metroDelay,
      busDelay,
      parkingOccupancy,
      medicalTeamsActive,
      volunteersAvailable,
      securityStaff,
      lastUpdated: new Date().toISOString(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggle = (key: keyof AccessibilityPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    onUpdatePrefs(updated);
    
    // Announce via voice guide if enabled
    if (key === "voiceGuide" && updated.voiceGuide && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Voice guide enabled. AURA will now read key information aloud.");
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sensoryZones = [
    {
      name: "Sensory Quiet Room 01",
      location: "East Concourse Section 108",
      desc: "Soundproof glass, weighted blankets, noise-canceling headsets, and trained behavioral staff.",
      status: "Open • Low Density"
    },
    {
      name: "Sensory Quiet Room 02",
      location: "Level 2 Executive Suite 214",
      desc: "Dimmable lights, visual bubble tubes, tactile playboards, and parent relaxation chairs.",
      status: "Open • Quiet"
    }
  ];

  const elevators = [
    {
      name: "West Elevator Lobby Bank 3",
      location: "Near Gate D Entrance",
      desc: "Step-free connection directly to Level 2 Wheelchair Seating Platforms.",
      status: "Operational"
    },
    {
      name: "South-East Express Elevator 5",
      location: "Adjacent to Gate E Ingress",
      desc: "Fast-track access to VIP Dining and lower suite levels.",
      status: "Operational"
    }
  ];

  return (
    <div id="accessibility-ai-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Interactive Preference Switches (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-indigo-600" />
            Universal Design Panel
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Modify the application's layout, colors, and voice triggers to fit your exact sensory preferences.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* High Contrast switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Eye className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">High-Contrast Mode</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Increases border weight and text density colors.</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle("highContrast")}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                prefs.highContrast ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                prefs.highContrast ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Color blind filter */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <span className="text-lg shrink-0">🎨</span>
              <div>
                <span className="text-xs font-black text-slate-800 block">Color-Blind Enhancement</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Adds distinct labels to visual color markers.</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle("colorBlind")}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                prefs.colorBlind ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                prefs.colorBlind ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Large Text scaler */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Type className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">Enlarged UI Typography</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Scales readable text blocks for better legibility.</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle("largeText")}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                prefs.largeText ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                prefs.largeText ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Voice Guide reader */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Volume2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">AURA Voice Assistance</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Enables high-fidelity announcement readings.</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle("voiceGuide")}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                prefs.voiceGuide ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                prefs.voiceGuide ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

        </div>
      </div>

      {/* Right Column: Quiet zones locator & elevator status lists (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Sensory Quiet Zones Directory */}
        <div className="space-y-4">
          <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-indigo-600" />
            Stadium Sensory Quiet Zones
          </h4>

          <div className="space-y-3">
            {sensoryZones.map((sz, idx) => (
              <div key={idx} className="border border-gray-150 p-4 rounded-2xl bg-gray-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{sz.name}</span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      {sz.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {sz.desc}
                  </p>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold block flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 inline" /> {sz.location}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onNavigateToTab("navigation");
                    onAskAura(`Find me the least crowded accessible route to ${sz.name} at ${sz.location}.`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  Reroute Me
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step-Free Elevators directory */}
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            <Accessibility className="w-4 h-4 text-indigo-600" />
            Step-Free Elevator Access Lobby
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {elevators.map((el, idx) => (
              <div key={idx} className="border border-gray-150 p-4 rounded-2xl bg-gray-50/40 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800">{el.name}</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600">✓ Active</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-normal">
                    {el.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onNavigateToTab("navigation");
                    onAskAura(`Show elevator wayfinding path for ${el.name} located at ${el.location}.`);
                  }}
                  className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-0.5 mt-2 cursor-pointer"
                >
                  <span>Locate Elevator Lobby</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Telemetry Overrides (Only visible to Staff, Admin, Volunteers) */}
      {profile && profile.isLoggedIn && (profile.role === "staff" || profile.role === "admin" || profile.role === "volunteer") && (
        <div className="col-span-12 bg-slate-900 border border-slate-850 rounded-3xl p-6 text-white space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-black text-white text-base tracking-tight uppercase">
                  🛠️ Live Telemetry & Operations Overrides
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Secure state controller. Override active crowd levels, transport times, and resources.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/60 px-3.5 py-1.5 rounded-xl font-mono text-[10.5px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-slate-300">Access Role: </span>
              <span className="text-indigo-400 font-extrabold uppercase">{profile.role}</span>
            </div>
          </div>

          <form onSubmit={handleSaveStadiumState} className="space-y-5">
            {/* Main variables inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Attendance</label>
                <input
                  type="number"
                  value={attendance}
                  onChange={(e) => setAttendance(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Weather Condition</label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Parking Occupancy %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={parkingOccupancy}
                  onChange={(e) => setParkingOccupancy(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Metro Delay (minutes)</label>
                <input
                  type="number"
                  value={metroDelay}
                  onChange={(e) => setMetroDelay(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Bus Delay (minutes)</label>
                <input
                  type="number"
                  value={busDelay}
                  onChange={(e) => setBusDelay(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

            </div>

            {/* Gate states overrides */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5">
              <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Gate Status Overrides</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { label: "Gate A (North)", val: gateAStatus, set: setGateAStatus },
                  { label: "Gate B (East)", val: gateBStatus, set: setGateBStatus },
                  { label: "Gate C (South)", val: gateCStatus, set: setGateCStatus },
                  { label: "Gate D (North-West)", val: gateDStatus, set: setGateDStatus },
                  { label: "Gate E (South-East)", val: gateEStatus, set: setGateEStatus },
                ].map((g, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl space-y-1">
                    <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold">{g.label}</span>
                    <select
                      value={g.val}
                      onChange={(e) => g.set(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Heavy Congestion">Heavy Congestion</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Open">Open</option>
                      <option value="Security Alert">Security Alert</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource allocation overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Volunteers Available</label>
                <input
                  type="number"
                  value={volunteersAvailable}
                  onChange={(e) => setVolunteersAvailable(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Security Staff On-Duty</label>
                <input
                  type="number"
                  value={securityStaff}
                  onChange={(e) => setSecurityStaff(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">Medical Teams Active</label>
                <input
                  type="number"
                  value={medicalTeamsActive}
                  onChange={(e) => setMedicalTeamsActive(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-between">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-white animate-[spin_8s_linear_infinite]" />
                <span>Publish Usability & Telemetry State</span>
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold animate-pulse">
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>State Broadcaster Successful! All AI models synced.</span>
                </div>
              )}
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
