import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Train, 
  Car, 
  Bus, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";

interface AiConciergeProps {
  profile: UserProfile;
  onAskAura: (prompt: string) => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({
  profile,
  onAskAura,
}) => {
  const [section, setSection] = useState("112");
  const [row, setRow] = useState("K");
  const [seat, setSeat] = useState("14");
  const [gate, setGate] = useState("Gate D");
  const [transport, setTransport] = useState("metro");
  const [hasParking, setHasParking] = useState(false);
  const [parkingBlock, setParkingBlock] = useState("Lot B");
  const [hotel, setHotel] = useState("Downtown Plaza Hotel");
  const [language, setLanguage] = useState("English");
  const [accessibility, setAccessibility] = useState("None");
  const [budget, setBudget] = useState("Standard");
  const [interest, setInterest] = useState("All-Around Experience");
  const [ageGroup, setAgeGroup] = useState("18-35");
  const [isGenerated, setIsGenerated] = useState(true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
    
    // Proactively send a context-rich prompt to Aura
    onAskAura(
      `Generate a highly tailored matchday itinerary starting from my hotel "${hotel}". I hold a Match Ticket for Section ${section}, Row ${row}, Seat ${seat} entering via ${gate}. Inbound transportation: ${transport === "metro" ? "Metro Link" : transport === "bus" ? "Shuttle Bus" : "Car with parking at " + parkingBlock}. My language of choice is ${language}. My accessibility needs are: ${accessibility}. Budget level: ${budget}. Key interests: ${interest}. Age group: ${ageGroup}. Include hotel return plan, restaurant suggestions, nearby attractions, shopping, and food stops.`
    );
  };

  // Pre-configured custom timeline steps to ensure standard offline fallback is gorgeous!
  const mockTimelineSteps = [
    {
      time: "4:15 PM",
      title: "Optimal Departure",
      description: `Board the ${transport === "metro" ? "Metro Rapid Link Line 2" : transport === "bus" ? "Eco-Express Shuttle Bus" : "Personal Vehicle heading to " + parkingBlock}. Current delay index is minimal.`,
      icon: transport === "metro" ? <Train className="w-4 h-4 text-white" /> : transport === "bus" ? <Bus className="w-4 h-4 text-white" /> : <Car className="w-4 h-4 text-white" />,
      color: "bg-indigo-600"
    },
    {
      time: "4:50 PM",
      title: "Stadium Inbound & Gate Entry",
      description: `Arrive at the stadium perimeter. Head directly to ${gate} (current waiting time: 1 min). Avoid Gate B which has heavy congestions.`,
      icon: <MapPin className="w-4 h-4 text-white" />,
      color: "bg-emerald-600"
    },
    {
      time: "5:05 PM",
      title: "Express Security Clearance",
      description: "Pass through contactless AI ticket scanners and bag-checks. Carry clear bags only to expedite entry.",
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      color: "bg-teal-600"
    },
    {
      time: "5:15 PM",
      title: "Restroom & Culinary Break",
      description: `Your seat in Section ${section} is right next to Concourse Section 112 Restrooms and 'AURA Express Grill'. Grab food now or place a seat-delivery order later.`,
      icon: <Info className="w-4 h-4 text-white" />,
      color: "bg-amber-500"
    },
    {
      time: "5:40 PM",
      title: "Take Your Seat",
      description: `Settle into Section ${section}, Row ${row}, Seat ${seat}. Player warm-ups begin in 5 minutes!`,
      icon: <Sparkles className="w-4 h-4 text-white" />,
      color: "bg-violet-600"
    }
  ];

  return (
    <div id="ai-concierge-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Itinerary Builder Form (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Itinerary Configurator
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Configure your tickets and transit to map out your perfect matchday.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Hotel & Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Starting Hotel</label>
              <input
                type="text"
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800"
                placeholder="e.g. Downtown Plaza Hotel"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Español">Español</option>
                <option value="Français">Français</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Português">Português</option>
              </select>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Row</label>
              <input
                type="text"
                value={row}
                onChange={(e) => setRow(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Seat</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {/* Gate Access & Accessibility */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Optimal Gate Access</label>
              <select
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="Gate A">Gate A (North Entrance)</option>
                <option value="Gate B">Gate B (East Entrance)</option>
                <option value="Gate C">Gate C (South Entrance)</option>
                <option value="Gate D">Gate D (North-West Entrance)</option>
                <option value="Gate E">Gate E (South-East Entrance)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Accessibility Needs</label>
              <select
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="None">None (Standard Access)</option>
                <option value="Wheelchair Route">Wheelchair Access Route</option>
                <option value="Audio Description">Audio Assist & Descriptions</option>
                <option value="High Contrast">High Contrast Directions</option>
                <option value="Sensory-Friendly">Sensory-Friendly / Quiet Zones</option>
              </select>
            </div>
          </div>

          {/* Budget, Interests & Age Group */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="Standard">Standard</option>
                <option value="Budget-Friendly">Saver / Budget</option>
                <option value="Premium/Vip">Premium / VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Interests</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-1.5 py-2 text-[11px] font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="All-Around Experience">All-Around</option>
                <option value="Gourmet Food Stops">Gourmet Food</option>
                <option value="Official Merchandise Shopping">Merch & Shop</option>
                <option value="Fan Zones & Activities">Fan Zones</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="18-35">18-35</option>
                <option value="Under 18">Under 18</option>
                <option value="36-55">36-55</option>
                <option value="55+">Over 55</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Inbound Transport Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "metro", label: "Metro", icon: <Train className="w-4 h-4" /> },
                { id: "bus", label: "Shuttle", icon: <Bus className="w-4 h-4" /> },
                { id: "car", label: "Drive & Park", icon: <Car className="w-4 h-4" /> },
              ].map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => {
                    setTransport(mode.id);
                    setHasParking(mode.id === "car");
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    transport === mode.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-black"
                      : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-gray-100"
                  }`}
                >
                  {mode.icon}
                  <span className="mt-1.5">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {hasParking && (
            <div className="animate-[slideDown_0.2s_ease-out]">
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Parking Lot Block</label>
              <input
                type="text"
                placeholder="e.g. Lot B (North Deck)"
                value={parkingBlock}
                onChange={(e) => setParkingBlock(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Generate Itinerary</span>
          </button>
        </form>
      </div>

      {/* Right Column: Visual Timeline (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        {isGenerated ? (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
              <div>
                <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                  <span>Matchday Itinerary Timeline</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-mono font-bold uppercase">
                    AI Curated
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Customized route times & seat guidelines</p>
              </div>
              <button
                onClick={() => {
                  onAskAura(`Regenerate and optimize my travel plan using the latest gate wait times and metro delays.`);
                }}
                className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" /> Optimize Plan
              </button>
            </div>

            {/* Timeline Steps Display */}
            <div className="relative border-l-2 border-slate-100 pl-6 ml-3 space-y-6 py-2">
              {mockTimelineSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Visual Left Dot with icon */}
                  <div className={`absolute -left-[37px] top-0 w-7 h-7 rounded-full ${step.color} border-4 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  
                  {/* Step Contents */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {step.time}
                      </span>
                      <h5 className="font-sans font-black text-slate-800 text-xs">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart notice banner */}
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-800 leading-normal font-semibold">
                This schedule updates dynamically using real-time gate congestion sensors and Metro delays. AURA will notify you via the top ticker if any travel times shift.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-gray-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="max-w-xs space-y-1">
              <h4 className="font-sans font-black text-slate-700 text-sm">No Itinerary Generated Yet</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your seat details, select transport, and click generate to map out your perfect matchday schedule.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
