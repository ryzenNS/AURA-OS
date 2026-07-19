import React, { useState, useEffect } from "react";
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Accessibility, 
  Flame, 
  Coffee, 
  Heart, 
  Compass, 
  LogOut,
  ChevronRight,
  Sparkles,
  Smile
} from "lucide-react";

interface SmartNavigationProps {
  onAskAura: (prompt: string) => void;
}

interface RouteOption {
  id: string;
  label: string;
  desc: string;
  time: string;
  distance: string;
  color: string;
  icon: string;
  steps: string[];
}

export const SmartNavigation: React.FC<SmartNavigationProps> = ({
  onAskAura,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState("fastest");
  const [isNavigating, setIsNavigating] = useState(false);

  const routes: RouteOption[] = [
    {
      id: "fastest",
      label: "Fastest Route",
      desc: "Direct flightpath to Section 112 via Central Concourse.",
      time: "4 mins",
      distance: "280 meters",
      color: "border-indigo-500 bg-indigo-50/40 text-indigo-800",
      icon: "⚡",
      steps: [
        "Enter through Gate D North-West turnstiles.",
        "Turn right and head 120 meters past the FIFA Fan Shop.",
        "Take the main escalator up to level 2 concourse.",
        "Section 112 is located immediately on your left."
      ]
    },
    {
      id: "least_crowded",
      label: "Least Crowded",
      desc: "Bypasses the crowded Gate B bottleneck.",
      time: "6 mins",
      distance: "410 meters",
      color: "border-emerald-500 bg-emerald-50/40 text-emerald-800",
      icon: "🟢",
      steps: [
        "Enter through Gate D North-West turnstiles (Wait-time: 1 min).",
        "Follow the green floor arrows along the spacious outer ring road.",
        "Use the West concourse corridor (currently at low capacity).",
        "Reach Section 112 from the quiet backside entrance."
      ]
    },
    {
      id: "wheelchair",
      label: "Wheelchair Accessible",
      desc: "Step-free path using elevators, ramps, and extra-wide lanes.",
      time: "8 mins",
      distance: "490 meters",
      color: "border-blue-500 bg-blue-50/40 text-blue-800",
      icon: "♿",
      steps: [
        "Enter through Gate D accessible automatic doors.",
        "Take Elevator Block 3 (West) up to Level 2 Concourse.",
        "Follow the wide, tactile floor guidelines past food stall 4.",
        "Arrive at the Level 2 ADA wheelchair platform in Sec 112."
      ]
    },
    {
      id: "family",
      label: "Family-Friendly",
      desc: "Features minimal steps, baby-changing stations, and stroller-valet.",
      time: "7 mins",
      distance: "380 meters",
      color: "border-pink-500 bg-pink-50/40 text-pink-800",
      icon: "🎈",
      steps: [
        "Enter Gate D and locate stroller valet parking on the left.",
        "Follow the purple balloons through the wide central concourse.",
        "Pass the family activity lounge and parent room near Section 108.",
        "Reach Section 112 with easy ramp access."
      ]
    },
    {
      id: "restrooms",
      label: "Restrooms Path",
      desc: "Shortest corridor routing directly to the premium restrooms.",
      time: "2 mins",
      distance: "110 meters",
      color: "border-amber-500 bg-amber-50/40 text-amber-800",
      icon: "🚻",
      steps: [
        "Walk down Section 112 main staircase to Concourse Level 2.",
        "Turn left and find premium self-cleaning restrooms behind 'AURA Express Grill'.",
        "Tactile signs indicate wheelchair-accessible and all-gender booths."
      ]
    },
    {
      id: "food",
      label: "Nearest Food Stalls",
      desc: "Direct path to seat-delivery kitchens and classic stadium dogs.",
      time: "3 mins",
      distance: "180 meters",
      color: "border-orange-500 bg-orange-50/40 text-orange-800",
      icon: "🍟",
      steps: [
        "Leave Section 112, turning right on Concourse Level 2.",
        "Arrive at Restaurant Hub B containing 'Express Burgers' and 'Zen Bowls'.",
        "Scan the QR code to skip lines and order directly for seat delivery."
      ]
    },
    {
      id: "exit",
      label: "Emergency Exit Routes",
      desc: "Clear, wide fire evacuation channels leading to safe assembly areas.",
      time: "1.5 mins",
      distance: "90 meters",
      color: "border-rose-500 bg-rose-50/40 text-rose-800",
      icon: "🚨",
      steps: [
        "Identify green exit signs directly above the section tunnel.",
        "Proceed down Section 112 central ramp to Ground Level.",
        "Exit through the wide security doors of Gate D to North Parking Lot."
      ]
    },
    {
      id: "parking",
      label: "Parking Route",
      desc: "Optimized connection directly to Parking Lot B and shuttle bus bays.",
      time: "9 mins",
      distance: "620 meters",
      color: "border-amber-600 bg-amber-50/30 text-amber-900",
      icon: "🚗",
      steps: [
        "Leave Section 112 and head to Ground Level via elevator or West exit ramp.",
        "Pass through the main security outer ring arches.",
        "Follow the blue pedestrian zebra crossing directly into Lot B North Deck.",
        "Shuttle bus transfer bays are adjacent to Block 3 parking."
      ]
    },
    {
      id: "seat",
      label: "Seat Entry Route",
      desc: "Guides you step-by-step from Gate D directly to Section 112 Row K Seat 14.",
      time: "3 mins",
      distance: "190 meters",
      color: "border-violet-500 bg-violet-50/40 text-violet-800",
      icon: "💺",
      steps: [
        "Enter through Gate D smart NFC ticket gates.",
        "Walk straight 80 meters on main corridor towards Sector 112 sign board.",
        "Ascend Section 112 entry portal tunnel staircase on Row K.",
        "Seat 14 is the 4th seat from the left-hand rail aisle."
      ]
    }
  ];

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleStartNavigation = () => {
    setIsNavigating(true);
    onAskAura(`Initialize real-time wayfinding audio cues for ${currentRoute.label}.`);
  };

  return (
    <div id="smart-navigation-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Route Selector & Steps List (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Wayfinder Routing Engine
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Select a specialized routing protocol below to guide you safely through the venue.
          </p>
        </div>

        {/* Route Selectors buttons */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => {
                setSelectedRouteId(route.id);
                setIsNavigating(false);
              }}
              className={`w-full border rounded-2xl p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                selectedRouteId === route.id
                  ? `${route.color} border-2 ring-1 ring-slate-200/50 scale-[1.01] shadow-xs`
                  : "bg-white border-gray-150 text-slate-700 hover:bg-slate-50/50"
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">{route.icon}</span>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black tracking-tight">{route.label}</span>
                  <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded-full">
                    {route.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {route.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Visual Interactive Map & Instructions (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Interactive Map Display */}
        <div className="bg-slate-900 border border-slate-950 rounded-2xl p-5 overflow-hidden relative min-h-[220px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              AURA Spatial Map Telemetry
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">
              GPS Active
            </span>
          </div>

          {/* Map graphics visualization mock */}
          <div className="relative h-28 flex items-center justify-center">
            {/* Visual routing paths */}
            <svg className="w-full h-full max-w-sm" viewBox="0 0 300 100">
              {/* Outer boundary */}
              <rect x="10" y="10" width="280" height="80" rx="10" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Turn markers */}
              <circle cx="40" cy="50" r="6" fill="#10b981" />
              <text x="52" y="54" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">Gate D</text>
              
              {/* Route lines */}
              <path 
                d={selectedRouteId === "fastest" ? "M 40 50 Q 150 20 260 50" : "M 40 50 Q 150 80 260 50"} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeDasharray={isNavigating ? "5 5" : "none"} 
                className={isNavigating ? "animate-[dash_10s_linear_infinite]" : ""}
              />
              
              <circle cx="260" cy="50" r="6" fill="#6366f1" />
              <text x="210" y="66" fill="#6366f1" fontSize="9" fontWeight="bold" fontFamily="monospace">Sec 112 Seat</text>
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-center text-xs">
            <div className="text-slate-400">
              <span className="block font-bold text-[10px] uppercase font-mono tracking-wider">Est. Walking Distance</span>
              <span className="text-white font-black font-mono text-sm">{currentRoute.distance}</span>
            </div>
            
            <button
              onClick={handleStartNavigation}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              <span>{isNavigating ? "Guidance Running..." : "Start AR Guide"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic turn-by-turn list */}
        <div className="space-y-4">
          <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            <span>Turn-by-Turn Wayfinding Steps</span>
            <span className="h-1 w-1 bg-indigo-600 rounded-full"></span>
          </h4>

          <div className="space-y-2.5">
            {currentRoute.steps.map((step, sIdx) => (
              <div key={sIdx} className="flex gap-3 text-xs text-slate-600 font-semibold animate-[fadeIn_0.25s_ease-out]">
                <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[10px] shrink-0 font-mono">
                  {sIdx + 1}
                </span>
                <p className="leading-relaxed mt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
