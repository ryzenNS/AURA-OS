import React, { useState, useEffect } from "react";
import { StadiumState, UserProfile } from "../types";
import {
  User,
  Mail,
  Phone,
  Info,
  Sliders,
  CheckCircle,
  AlertOctagon,
  LogOut,
  LogIn,
  RefreshCw,
  Camera,
  Trophy,
  Flame,
} from "lucide-react";

interface OperationsSidebarProps {
  stadiumState: StadiumState;
  onUpdateStadiumState: (newState: StadiumState) => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const PREBUILT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
];

export const OperationsSidebar: React.FC<OperationsSidebarProps> = ({
  stadiumState,
  onUpdateStadiumState,
  profile,
  onUpdateProfile,
}) => {
  // Login states
  const [loginEmail, setLoginEmail] = useState(profile.email || "");
  const [loginPhone, setLoginPhone] = useState(profile.phone || "");
  const [loginName, setLoginName] = useState(profile.name || "Stadium Guest");
  const [loginAbout, setLoginAbout] = useState(profile.about || "FIFA World Cup enthusiast.");
  const [loginRole, setLoginRole] = useState<"admin" | "fan" | "volunteer" | "staff">(
    profile.role || "fan"
  );
  const [loginPhoto, setLoginPhoto] = useState(
    profile.photoUrl || PREBUILT_AVATARS[0]
  );
  const [isEditingPhotoUrl, setIsEditingPhotoUrl] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);

  // Stadium state edit form local variables
  const [capacity, setCapacity] = useState(stadiumState.capacity);
  const [attendance, setAttendance] = useState(stadiumState.attendance);
  const [gateAStatus, setGateAStatus] = useState(stadiumState.gateAStatus);
  const [gateBStatus, setGateBStatus] = useState(stadiumState.gateBStatus);
  const [gateCStatus, setGateCStatus] = useState(stadiumState.gateCStatus);
  const [gateDStatus, setGateDStatus] = useState(stadiumState.gateDStatus);
  const [gateEStatus, setGateEStatus] = useState(stadiumState.gateEStatus);
  const [weather, setWeather] = useState(stadiumState.weather);
  const [metroDelay, setMetroDelay] = useState(stadiumState.metroDelay);
  const [busDelay, setBusDelay] = useState(stadiumState.busDelay);
  const [parkingOccupancy, setParkingOccupancy] = useState(stadiumState.parkingOccupancy);
  const [medicalTeamsActive, setMedicalTeamsActive] = useState(stadiumState.medicalTeamsActive);
  const [volunteersAvailable, setVolunteersAvailable] = useState(stadiumState.volunteersAvailable);
  const [securityStaff, setSecurityStaff] = useState(stadiumState.securityStaff);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usaCheers, setUsaCheers] = useState(240);
  const [gerCheers, setGerCheers] = useState(210);

  const [liveScore, setLiveScore] = useState({
    home: "USA",
    away: "GER",
    homeFlag: "🇺🇸",
    awayFlag: "🇩🇪",
    homeScore: 2,
    awayScore: 1,
    minute: 78
  });

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setLiveScore(prev => {
        const nextMin = prev.minute >= 90 ? 1 : prev.minute + 1;
        let hScore = prev.homeScore;
        let aScore = prev.awayScore;
        if (nextMin === 83 && prev.homeScore === 2) {
          aScore = 2;
        }
        return {
          ...prev,
          minute: nextMin,
          homeScore: hScore,
          awayScore: aScore
        };
      });
    }, 12000);
    return () => clearInterval(scoreInterval);
  }, []);

  // Trigger login action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: loginName || "Guest User",
      email: loginEmail || "guest@fifa.com",
      phone: loginPhone || "+1 (555) 2026-FIFA",
      role: loginRole,
      photoUrl: loginPhoto,
      about: loginAbout,
      isLoggedIn: true,
    });
  };

  const handleLogout = () => {
    onUpdateProfile({
      name: "",
      email: "",
      phone: "",
      role: "fan",
      photoUrl: PREBUILT_AVATARS[0],
      about: "",
      isLoggedIn: false,
    });
    setLoginName("Stadium Guest");
    setLoginEmail("");
    setLoginPhone("");
    setLoginAbout("FIFA World Cup enthusiast.");
    setLoginRole("fan");
  };

  // Trigger Stadium parameters update
  const handleSaveStadiumState = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.role !== "admin" && profile.role !== "staff") return;

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

  const isAuthorizedToEdit = profile.isLoggedIn && (profile.role === "admin" || profile.role === "staff" || profile.role === "volunteer");

  return (
    <div id="operations-sidebar-root" className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm h-full flex flex-col text-slate-800">
      
      {/* Telemetry Control Panel */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* Compact Live Match Center Card */}
        <div className="mb-4 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1 text-[8.5px] font-mono font-black uppercase tracking-wider text-rose-500">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>
              Live Match Tracker
            </span>
            <span className="text-[8.5px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md">
              Min {liveScore.minute}'
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{liveScore.homeFlag}</span>
              <span className="font-sans font-black text-xs text-white uppercase tracking-wide">{liveScore.home}</span>
            </div>
            <div className="font-mono font-black text-xs text-indigo-400 bg-slate-950 px-2.5 py-0.5 border border-slate-850 rounded-md">
              {liveScore.homeScore} - {liveScore.awayScore}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-xs text-white uppercase tracking-wide">{liveScore.away}</span>
              <span className="text-base">{liveScore.awayFlag}</span>
            </div>
          </div>
        </div>

        {isAuthorizedToEdit ? (
          /* Authorized: Can edit stadium data */
          <>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Telemetry Controls
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">FIFA 2026</span>
            </div>

            <form onSubmit={handleSaveStadiumState} className="space-y-3 text-slate-700">
              <div className="flex gap-2 bg-indigo-50/50 border border-indigo-150 p-2.5 rounded-xl text-[10px] text-indigo-800">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-600" />
                <span>
                  As <strong>{profile.role.toUpperCase()}</strong>, you are authorized to edit and broadcast live telemetry parameters to AURA GenAI models.
                </span>
              </div>

              {/* Capacity & Attendance */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Attendance</label>
                  <input
                    type="number"
                    value={attendance}
                    onChange={(e) => setAttendance(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Weather & Parking */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Weather Condition</label>
                  <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Parking Occupancy %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={parkingOccupancy}
                    onChange={(e) => setParkingOccupancy(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Delays */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Metro Delay (m)</label>
                  <input
                    type="number"
                    value={metroDelay}
                    onChange={(e) => setMetroDelay(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1">Bus Delay (m)</label>
                  <input
                    type="number"
                    value={busDelay}
                    onChange={(e) => setBusDelay(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Gates */}
              <div className="border-t border-gray-200 pt-2 space-y-2">
                <span className="block text-[9px] font-mono uppercase text-slate-500 font-bold">Gate States</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Gate A</label>
                    <select
                      value={gateAStatus}
                      onChange={(e) => setGateAStatus(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-800"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Heavy Congestion">Heavy Congestion</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Open">Open</option>
                      <option value="Security Alert">Security Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Gate B</label>
                    <select
                      value={gateBStatus}
                      onChange={(e) => setGateBStatus(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-800"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Heavy Congestion">Heavy Congestion</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Open">Open</option>
                      <option value="Security Alert">Security Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Gate C</label>
                    <select
                      value={gateCStatus}
                      onChange={(e) => setGateCStatus(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-800"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Heavy Congestion">Heavy Congestion</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Open">Open</option>
                      <option value="Security Alert">Security Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Gate D</label>
                    <select
                      value={gateDStatus}
                      onChange={(e) => setGateDStatus(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-800"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Heavy Congestion">Heavy Congestion</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Open">Open</option>
                      <option value="Security Alert">Security Alert</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Staff resources */}
              <div className="grid grid-cols-3 gap-1.5 border-t border-gray-200 pt-2">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">Volunteers</label>
                  <input
                    type="number"
                    value={volunteersAvailable}
                    onChange={(e) => setVolunteersAvailable(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">Security</label>
                  <input
                    type="number"
                    value={securityStaff}
                    onChange={(e) => setSecurityStaff(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">Medical</label>
                  <input
                    type="number"
                    value={medicalTeamsActive}
                    onChange={(e) => setMedicalTeamsActive(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-slate-850"
                  />
                </div>
              </div>

              <button
                id="save-stadium-state-btn"
                type="submit"
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white animate-[spin_8s_linear_infinite]" />
                Publish Dynamic Live Telemetry
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 justify-center font-mono mt-1 font-bold animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  Live Broadcast Successful!
                </div>
              )}
            </form>
          </>
        ) : (
          /* Fan: Show beautiful Fan Matchday Companion dashboard instead of locked telemetry */
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <h4 className="font-sans font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
                Fan Matchday Companion
              </h4>
              <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-150">
                Fan Hub
              </span>
            </div>

            {/* Interactive Cheering Noise Meter */}
            <div className="bg-slate-50 border border-slate-200/65 p-3.5 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-black">📣 Live Cheering Meter</span>
                <span className="text-[10px] font-mono text-indigo-600 font-extrabold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                  Stadium Noise: {Math.min(98, 75 + Math.floor((usaCheers + gerCheers) / 20))}%
                </span>
              </div>

              {/* Progress visualizer */}
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(usaCheers / (usaCheers + gerCheers || 1)) * 100}%` }}
                />
                <div 
                  className="bg-rose-500 transition-all duration-300"
                  style={{ width: `${(gerCheers / (usaCheers + gerCheers || 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-400 font-semibold">
                <span>🇺🇸 USA ({Math.round((usaCheers / (usaCheers + gerCheers || 1)) * 100)}%)</span>
                <span>🇩🇪 GER ({Math.round((gerCheers / (usaCheers + gerCheers || 1)) * 100)}%)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setUsaCheers(prev => prev + 10)}
                  className="bg-white hover:bg-indigo-50 border border-slate-200 text-slate-800 font-bold text-[10.5px] py-1.5 px-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>🇺🇸 Cheer USA</span>
                </button>
                <button
                  onClick={() => setGerCheers(prev => prev + 10)}
                  className="bg-white hover:bg-rose-50 border border-slate-200 text-slate-800 font-bold text-[10.5px] py-1.5 px-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>🇩🇪 Cheer GER</span>
                </button>
              </div>
            </div>

            {/* Live Match Statistics */}
            <div className="bg-white border border-slate-200/65 p-3.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-black">📊 Live Match Statistics</span>
                <span className="text-[9px] text-emerald-600 font-mono font-black animate-pulse flex items-center gap-1">
                  ● Realtime Sync
                </span>
              </div>

              {/* Possession */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-600 font-semibold">
                  <span>USA Possession (47%)</span>
                  <span>GER Possession (53%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600" style={{ width: "47%" }} />
                  <div className="bg-slate-300" style={{ width: "53%" }} />
                </div>
              </div>

              {/* Shots */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-600 font-semibold">
                  <span>Shots (11)</span>
                  <span>Shots (14)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600" style={{ width: "44%" }} />
                  <div className="bg-slate-300" style={{ width: "56%" }} />
                </div>
              </div>

              {/* Corners */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-600 font-semibold">
                  <span>Corners (4)</span>
                  <span>Corners (6)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600" style={{ width: "40%" }} />
                  <div className="bg-slate-300" style={{ width: "60%" }} />
                </div>
              </div>
            </div>

            {/* Stadium Fan Chant Guide */}
            <div className="bg-slate-50 border border-slate-200/65 p-3.5 rounded-2xl space-y-2">
              <span className="block text-[10px] font-mono uppercase text-slate-500 font-black">🎵 Stadium Fan Chants</span>
              <div className="space-y-1.5">
                <div className="bg-white p-2 rounded-lg border border-slate-100 text-[10.5px]">
                  <span className="font-bold text-indigo-600">🇺🇸 USA chant:</span>
                  <p className="text-slate-600 italic font-medium mt-0.5">"I believe that we will win! I believe that we will win!"</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100 text-[10.5px]">
                  <span className="font-bold text-rose-600">🇩🇪 Germany chant:</span>
                  <p className="text-slate-600 italic font-medium mt-0.5">"Oh, wie ist das schön! Oh, wie ist das schön!"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
