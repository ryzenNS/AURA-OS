import React, { useEffect, useState } from "react";
import { UserProfile, StadiumState } from "../types";
import { 
  Flame, 
  Clock, 
  CloudRain, 
  TrendingUp, 
  Navigation, 
  MapPin, 
  AlertCircle, 
  Heart, 
  Brain, 
  Car, 
  Ticket,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface HomeDashboardProps {
  profile: UserProfile;
  stadiumState: StadiumState;
  onNavigateToTab: (tabId: string) => void;
  onAskAura: (prompt: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  stadiumState,
  onNavigateToTab,
  onAskAura,
}) => {
  const [countdown, setCountdown] = useState("01:42:05");
  const [greeting, setGreeting] = useState("");

  // Determine dynamic greeting based on current local time
  useEffect(() => {
    const hours = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hours >= 12 && hours < 17) {
      timeGreeting = "Good afternoon";
    } else if (hours >= 17) {
      timeGreeting = "Good evening";
    }
    setGreeting(`${timeGreeting}, ${profile.name || "Navya"}`);
  }, [profile.name]);

  // Simulated countdown decrementor
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const parts = prev.split(":").map(Number);
        let [h, m, s] = parts;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
            else {
              clearInterval(timer);
              return "00:00:00";
            }
          }
        }
        return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home-dashboard-root" className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Dynamic Proactive AI Suggestion Hero (Google Voice / Siri style) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              AURA Proactive Copilot Active
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-2">
            <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-tight leading-tight">
              {greeting}.
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-2xl leading-relaxed">
              Your match begins in <span className="text-emerald-400 font-bold">{countdown.split(":")[0]} hours and {countdown.split(":")[1]} minutes</span>. 
              <span className="block mt-1 text-xs text-indigo-200">
                ⚠️ <strong className="text-rose-300 font-bold">Gate B</strong> is experiencing heavy ingress congestion. We recommend arriving via <strong className="text-emerald-300 font-bold">Gate D</strong>. Your optimal stadium corridor walking time is <span className="text-emerald-300 font-bold">6 minutes</span>.
              </span>
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button 
              onClick={() => onNavigateToTab("navigation")}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Route to Gate D</span>
            </button>
            <button 
              onClick={() => onAskAura("Generate full match-day itinerary based on my ticket section and transportation details.")}
              className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Generate Travel Itinerary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Match Info & Live Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upcoming Match & Quick Stats (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Match & Countdown Bento Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div>
                <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-full">
                  FIFA World Cup 2026 • Group Stage
                </span>
                <h3 className="font-sans font-black text-xl text-slate-800 tracking-tight mt-3">
                  Argentina vs France
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  📍 Seattle Stadium • Pitch 01
                </p>
              </div>

              {/* Score Preview / Team Logos */}
              <div className="flex items-center justify-center md:justify-start gap-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇦🇷</span>
                  <span className="font-sans font-bold text-sm text-slate-700">ARG</span>
                </div>
                <span className="font-mono text-xs text-slate-400 font-extrabold">VS</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇫🇷</span>
                  <span className="font-sans font-bold text-sm text-slate-700">FRA</span>
                </div>
              </div>
            </div>

            {/* Huge countdown clock */}
            <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 text-center min-w-[180px] shadow-inner">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-black block mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-indigo-600" /> Kick-off Countdown
              </span>
              <span className="text-3xl font-mono font-black text-indigo-600 tracking-wider">
                {countdown}
              </span>
              <span className="block text-[9px] text-slate-500 font-bold mt-1 uppercase">
                Warm-ups starting shortly
              </span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-3">
            <h4 className="font-sans font-black text-sm text-slate-800 tracking-tight flex items-center gap-1.5 px-1">
              <span>Quick Fan Actions</span>
              <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full"></span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: "🍔 Order Food AI", desc: "No queues, seat delivery", tab: "food", icon: "🍟", color: "hover:border-amber-400" },
                { title: "🗺️ Seat Wayfinder", desc: "Walking path with times", tab: "navigation", icon: "📍", color: "hover:border-indigo-400" },
                { title: "🛍️ Shop Jersey", desc: "Official FIFA merch", tab: "shopping", icon: "👕", color: "hover:border-emerald-400" },
                { title: "🆘 Emergency AI", desc: "Single button safety aid", tab: "emergency", icon: "🚨", color: "hover:border-rose-400" }
              ].map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToTab(act.tab)}
                  className={`bg-white border border-gray-200 rounded-2xl p-3.5 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between h-28 group relative ${act.color}`}
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{act.icon}</span>
                  <div>
                    <span className="block text-xs font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{act.title}</span>
                    <span className="text-[10px] text-slate-400 leading-normal block mt-0.5 truncate">{act.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Travel Departure Plan */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="font-sans font-black text-sm text-slate-800 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-indigo-600" />
              Recommended Inbound Travel Route
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-xl">🚈</span>
                <div className="space-y-1 text-xs">
                  <span className="font-black text-slate-800 block">Metro Rapid Link Line 2</span>
                  <p className="text-slate-500 font-medium">Take Line 2 direct from Downtown Central to Stadium West Station.</p>
                  <span className="inline-block text-[9px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                    Delay: {stadiumState.metroDelay} mins • Heavily crowded
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-xl">🚌</span>
                <div className="space-y-1 text-xs">
                  <span className="font-black text-slate-800 block">Eco-Express Shuttle Bus</span>
                  <p className="text-slate-500 font-medium">Bypass Metro delays. Board the carbon-free express shuttles at Block A.</p>
                  <span className="inline-block text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    Delay: {stadiumState.busDelay} mins • Flowing nicely
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Telemetry Widgets (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weather & Stadium Health Index */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Stadium Ambient Environment
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-mono font-black text-slate-800">
                    18°C
                  </span>
                  <span className="text-[10.5px] text-slate-400 block font-semibold leading-none mt-0.5">
                    {stadiumState.weather} Conditions
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Rain Shelter</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg mt-1 inline-block">
                  Concourse Active
                </span>
              </div>
            </div>
          </div>

          {/* Live Gating Telemetry Feed */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Real-Time Gate Wait Times
              </span>
              <button 
                onClick={() => onNavigateToTab("explore")}
                className="text-[10px] text-indigo-600 hover:text-indigo-700 underline font-mono font-bold cursor-pointer"
              >
                Digital Twin &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Gate A (North)", status: stadiumState.gateAStatus, wait: "2 mins wait" },
                { name: "Gate B (East)", status: stadiumState.gateBStatus, wait: "18 mins wait" },
                { name: "Gate C (South)", status: stadiumState.gateCStatus, wait: "Alert: Locked" },
                { name: "Gate D (North-West)", status: stadiumState.gateDStatus, wait: "1 min wait" },
                { name: "Gate E (South-East)", status: stadiumState.gateEStatus, wait: "4 mins wait" }
              ].map((gate, index) => {
                const isHeavy = gate.status.toLowerCase().includes("heavy") || gate.status.toLowerCase().includes("congest");
                const isAlert = gate.status.toLowerCase().includes("alert") || gate.status.toLowerCase().includes("lock");
                
                return (
                  <div key={index} className="flex justify-between items-center py-1 text-xs">
                    <span className="font-semibold text-slate-700">{gate.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[10.5px] font-medium">{gate.wait}</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                        isAlert ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse" :
                        isHeavy ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {gate.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traffic, Parking & Crowd level prediction */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="font-sans font-black text-xs text-slate-800 uppercase tracking-wide">
              🚗 Ingress & Crowd Preds
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-500 font-semibold">Parking Block A Occupancy</span>
                  <span className="font-bold font-mono text-slate-800">{stadiumState.parkingOccupancy}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${stadiumState.parkingOccupancy > 80 ? "bg-amber-500" : "bg-indigo-600"}`}
                    style={{ width: `${stadiumState.parkingOccupancy}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-150 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-700">Stadium Ring Road</span>
                </div>
                <span className="font-mono font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase text-[9px]">
                  Moderate Congest
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
