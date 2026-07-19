import React, { useState } from "react";
import { 
  Leaf, 
  Trash2, 
  Train, 
  Bus, 
  Award, 
  CheckCircle, 
  Sparkles, 
  Info, 
  Plus, 
  Flame, 
  Coins 
} from "lucide-react";

interface SustainabilityTrackerProps {
  onAskAura: (prompt: string) => void;
}

export const SustainabilityTracker: React.FC<SustainabilityTrackerProps> = ({
  onAskAura,
}) => {
  // Public Transit Calculator States
  const [distanceKm, setDistanceKm] = useState(15);
  const [transitType, setTransitType] = useState("metro");
  
  // Interactive logger
  const [recycledCups, setRecycledCups] = useState(0);
  const [recycledCans, setRecycledCans] = useState(0);
  const [ecoPoints, setEcoPoints] = useState(120);

  // Math offsets: Metro saves ~180g of CO2 per km compared to car. Bus saves ~120g of CO2 per km.
  const offsetGrams = transitType === "metro" ? 180 : 120;
  const carbonSavedKg = ((distanceKm * offsetGrams) / 1000).toFixed(2);

  const handleRecycleCup = () => {
    setRecycledCups(prev => prev + 1);
    setEcoPoints(prev => prev + 15); // 15 points per cup
  };

  const handleRecycleCan = () => {
    setRecycledCans(prev => prev + 1);
    setEcoPoints(prev => prev + 25); // 25 points per can
  };

  const handleClaimReward = () => {
    onAskAura(`Claim my eco-rewards! I have accumulated ${ecoPoints} Eco-Points by recycling ${recycledCups} cups and ${recycledCans} cans.`);
  };

  const ecoBadges = [
    { name: "Eco Transit Captain", desc: "Offset 2+ kg of CO2 using green stadium transit.", unlocked: parseFloat(carbonSavedKg) >= 2.0, icon: "🚈" },
    { name: "Recycling Champion", desc: "Recycle 5+ cups or aluminum cans at smart bins.", unlocked: (recycledCups + recycledCans) >= 5, icon: "♻️" },
    { name: "Zero Waste Hero", desc: "Log recycling and claim carbon offsets.", unlocked: ecoPoints >= 180, icon: "🌱" }
  ];

  return (
    <div id="sustainability-tracker-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Public Transit Carbon Calculator (6 Cols) */}
      <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600 animate-pulse" />
            Green Transit CO2 Calculator
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Calculate your carbon offsets when prioritizing public transit or park-and-ride shuttle solutions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Inbound Transit Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTransitType("metro")}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  transitType === "metro"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-black"
                    : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Train className="w-5 h-5" />
                <div className="text-left">
                  <span className="block leading-tight">Metro Rapid Link</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold block mt-0.5">Zero Emissions</span>
                </div>
              </button>

              <button
                onClick={() => setTransitType("bus")}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  transitType === "bus"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-black"
                    : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Bus className="w-5 h-5" />
                <div className="text-left">
                  <span className="block leading-tight">Eco Shuttle Bus</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold block mt-0.5">Electric/Biofuel</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-slate-500 font-bold">Estimated Travel Distance</span>
              <span className="font-mono font-black text-emerald-700">{distanceKm} Kilometers</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value) || 2)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Large carbon saved stat badge */}
          <div className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl text-center space-y-1 shadow-inner">
            <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest block">
              Estimated Carbon CO2 Saved
            </span>
            <span className="text-4xl font-mono font-black text-emerald-700 tracking-tight block">
              {carbonSavedKg} kg
            </span>
            <p className="text-[11.5px] text-emerald-800 leading-normal font-semibold max-w-sm mx-auto">
              By choosing the {transitType === "metro" ? "Metro" : "Shuttle"} over a private gasoline vehicle, you saved enough carbon emissions to power standard phone charges for 1,200 hours!
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Smart Bin Recycling Logger & Badges (6 Cols) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Recycle items logger */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
            <div>
              <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                <Trash2 className="w-4.5 h-4.5 text-emerald-600" />
                Smart Bin Cup & Can Recycler
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Log recycled souvenir cups & beverage cans to earn prize tokens.</p>
            </div>

            {/* Total tokens count */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1 text-center">
              <span className="text-[8.5px] font-mono uppercase text-amber-700 block font-bold leading-none">Eco Points</span>
              <span className="text-sm font-mono font-black text-amber-800 flex items-center justify-center gap-1 mt-0.5">
                <Coins className="w-3.5 h-3.5" /> {ecoPoints}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cup recycle logger */}
            <div className="border border-gray-150 p-4 rounded-2xl text-center bg-gray-50/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-3xl block">🥤</span>
                <span className="block text-xs font-black text-slate-800 mt-2">Plastic Souvenir Cup</span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Logged: {recycledCups} items</span>
              </div>
              <button
                onClick={handleRecycleCup}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] py-1.5 rounded-xl transition-all mt-3 cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Log Recycled
              </button>
            </div>

            {/* Can recycle logger */}
            <div className="border border-gray-150 p-4 rounded-2xl text-center bg-gray-50/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-3xl block">🥫</span>
                <span className="block text-xs font-black text-slate-800 mt-2">Aluminum Can</span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Logged: {recycledCans} items</span>
              </div>
              <button
                onClick={handleRecycleCan}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] py-1.5 rounded-xl transition-all mt-3 cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Log Recycled
              </button>
            </div>
          </div>

          {ecoPoints >= 150 && (
            <button
              onClick={handleClaimReward}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer animate-pulse"
            >
              🎉 Claim Commemorative Fan Reward!
            </button>
          )}
        </div>

        {/* Eco Achievement Badges unlocked */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
          <h4 className="font-sans font-black text-slate-800 text-xs uppercase tracking-wide">
            Your Unlocked Eco Achievements
          </h4>

          <div className="space-y-2.5">
            {ecoBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-150 rounded-xl bg-gray-50/50">
                <div className="flex gap-3 items-center">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">{badge.name}</span>
                    <span className="text-[10px] text-slate-500 leading-normal block">{badge.desc}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  badge.unlocked 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  {badge.unlocked ? "✓ Unlocked" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
