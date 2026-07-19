import React, { useState } from "react";
import { StadiumState } from "../types";
import {
  AlertTriangle,
  Users,
  Compass,
  CloudRain,
  Train,
  Bus,
  Activity,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

interface StadiumVisualizerProps {
  state: StadiumState;
  onGateClick?: (gateName: string, status: string) => void;
}

export const StadiumVisualizer: React.FC<StadiumVisualizerProps> = ({
  state,
  onGateClick,
}) => {
  const [timeframe, setTimeframe] = useState<"15m" | "30m" | "1h">("15m");

  // Helpers for status colors
  const getGateColorClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("alert") || s.includes("closed") || s.includes("security")) {
      return "bg-rose-50 text-rose-700 border-rose-200 shadow-sm animate-pulse";
    }
    if (s.includes("heavy") || s.includes("congestion")) {
      return "bg-amber-50 text-amber-700 border-amber-200 shadow-sm";
    }
    if (s.includes("moderate") || s.includes("medium")) {
      return "bg-yellow-50 text-yellow-800 border-yellow-200 shadow-sm";
    }
    return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
  };

  const getGateBorderColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("alert") || s.includes("closed") || s.includes("security")) return "border-rose-400";
    if (s.includes("heavy") || s.includes("congestion")) return "border-amber-400";
    if (s.includes("moderate")) return "border-yellow-300";
    return "border-emerald-400";
  };

  const attendancePercent = Math.round((state.attendance / state.capacity) * 100);

  return (
    <div id="stadium-visualizer-container" className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-slate-800">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-sans font-bold text-lg text-slate-800 tracking-tight">
              AURA Core Stadium Feed
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            FIFA 2026 Live Telemetry Engine
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-[10px] text-slate-400 font-mono uppercase">Attendance</span>
            <span className="text-sm font-sans font-bold text-slate-800">
              {state.attendance.toLocaleString()} / {state.capacity.toLocaleString()}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-center">
            <span className="block text-[10px] text-slate-400 font-mono uppercase">Capacity Util</span>
            <span className="text-sm font-sans font-bold text-indigo-600">
              {attendancePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Stadium Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* SVG/Tactical Stadium Map */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[350px]">
          <span className="text-xs font-mono text-slate-400 mb-4 tracking-wider uppercase">Tactical Gate & Sector Overlay</span>
          
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
            {/* Field Outer Track */}
            <div className="absolute inset-0 border-[3px] border-dashed border-gray-200 rounded-full animate-[spin_120s_linear_infinite]"></div>
            
            {/* Outer Stadium Wall */}
            <div className="absolute w-[85%] h-[85%] rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center">
              {/* Grandstands ring */}
              <div className="absolute w-[80%] h-[80%] rounded-full border-4 border-gray-200/80 flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100">
                
                {/* Field (green arena center) */}
                <div className="w-[45%] h-[60%] rounded-2xl border border-emerald-300 bg-emerald-50/60 relative overflow-hidden flex items-center justify-center">
                  {/* Field markings */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/10"></div>
                  <div className="w-10 h-10 rounded-full border border-emerald-500/10 absolute"></div>
                  <span className="font-mono text-[9px] text-emerald-600/40 font-bold uppercase tracking-widest rotate-[-12deg]">FIFA 2026</span>
                </div>

                {/* Internal Heat Zones */}
                {state.gateBStatus.toLowerCase().includes("heavy") && (
                  <div className="absolute right-4 top-1/4 w-12 h-12 bg-amber-500/15 rounded-full filter blur-md animate-pulse"></div>
                )}
                {state.gateCStatus.toLowerCase().includes("alert") && (
                  <div className="absolute bottom-4 left-1/3 w-16 h-16 bg-rose-500/15 rounded-full filter blur-md animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Interactive Gate Overlays on the perimeter */}
            {/* GATE A - NORTH (Top) */}
            <button
              id="stadium-gate-a"
              onClick={() => onGateClick?.("Gate A", state.gateAStatus)}
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 border px-3 py-1 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${getGateColorClass(
                state.gateAStatus
              )} ${getGateBorderColor(state.gateAStatus)}`}
            >
              Gate A
            </button>

            {/* GATE B - EAST (Right) */}
            <button
              id="stadium-gate-b"
              onClick={() => onGateClick?.("Gate B", state.gateBStatus)}
              className={`absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 border px-3 py-1 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${getGateColorClass(
                state.gateBStatus
              )} ${getGateBorderColor(state.gateBStatus)}`}
            >
              Gate B
            </button>

            {/* GATE C - SOUTH (Bottom) */}
            <button
              id="stadium-gate-c"
              onClick={() => onGateClick?.("Gate C", state.gateCStatus)}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 border px-3 py-1 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${getGateColorClass(
                state.gateCStatus
              )} ${getGateBorderColor(state.gateCStatus)}`}
            >
              Gate C
            </button>

            {/* GATE D - WEST (Left) */}
            <button
              id="stadium-gate-d"
              onClick={() => onGateClick?.("Gate D", state.gateDStatus)}
              className={`absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 border px-3 py-1 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${getGateColorClass(
                state.gateDStatus
              )} ${getGateBorderColor(state.gateDStatus)}`}
            >
              Gate D
            </button>

            {/* GATE E - SOUTH-EAST (Bottom Right Corner) */}
            <button
              id="stadium-gate-e"
              onClick={() => onGateClick?.("Gate E", state.gateEStatus)}
              className={`absolute bottom-6 right-6 border px-3 py-1 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${getGateColorClass(
                state.gateEStatus
              )} ${getGateBorderColor(state.gateEStatus)}`}
            >
              Gate E
            </button>
          </div>

          {/* Quick instructions */}
          <p className="text-[10px] text-slate-400 font-mono mt-4 text-center">
            💡 Tap any Gate badge to analyze real-time ingress congestion.
          </p>
        </div>

        {/* Telemetry and Alert Sidebar */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-mono">Weather</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {state.weather}
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Train className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono">Metro Delay</span>
              </div>
              <span className={`text-sm font-bold ${state.metroDelay > 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                {state.metroDelay} Mins
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Bus className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-mono">Bus Delay</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {state.busDelay} Mins
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-mono">Parking Fill</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-800">
                  {state.parkingOccupancy}%
                </span>
                <div className="w-12 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full"
                    style={{ width: `${state.parkingOccupancy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Crowd Movement Analytics */}
          <div className="bg-slate-50 border border-indigo-100 p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                🔮 AI Crowd Movement Prediction
              </h4>
              <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                {(["15m", "30m", "1h"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold transition-all cursor-pointer ${
                      timeframe === t
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t === "15m" ? "15 Min" : t === "30m" ? "30 Min" : "1 Hour"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {/* Gate A */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Gate A (North)</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                  timeframe === "15m" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                  timeframe === "30m" ? "bg-amber-50 text-amber-700 border border-amber-150" :
                  "bg-rose-50 text-rose-700 border border-rose-150 animate-pulse"
                }`}>
                  {timeframe === "15m" ? "🟢 Green (Fluid)" : timeframe === "30m" ? "🟡 Yellow (Moderate)" : "🔴 Red (Heavily Crowded)"}
                </span>
              </div>

              {/* Gate B */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Gate B (East)</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                  timeframe === "15m" ? "bg-rose-50 text-rose-700 border border-rose-150 animate-pulse" :
                  timeframe === "30m" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                  "bg-amber-50 text-amber-700 border border-amber-150"
                }`}>
                  {timeframe === "15m" ? "🔴 Red (Congested)" : timeframe === "30m" ? "🟢 Green (Fluid)" : "🟡 Yellow (Moderate)"}
                </span>
              </div>

              {/* Gate D */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Gate D (West)</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                  🟢 Green (Fluid)
                </span>
              </div>
            </div>

            {/* AI Recommendation Alert */}
            <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-xl text-[10.5px] text-indigo-900 leading-normal font-semibold">
              <span className="font-bold block uppercase tracking-wide text-indigo-950 mb-0.5">🧠 Predictive Recommendation</span>
              {timeframe === "15m" && "Gate B will remain crowded for 15 minutes. Gate D has no queue. Use Gate D instead."}
              {timeframe === "30m" && "Gate A is predicted to become congested in 18 minutes due to arriving trains. Reroute incoming fans."}
              {timeframe === "1h" && "Post-match exit flows will surge in 1 hour. Open auxiliary exits B and E for outward pedestrian flow."}
            </div>
          </div>

          {/* Operational Resources */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2 shadow-xs">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              On-Duty Resources
            </h4>
            
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="flex items-center gap-1.5 text-slate-500">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Volunteers Available
              </span>
              <span className="font-bold text-slate-800">{state.volunteersAvailable}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <span className="flex items-center gap-1.5 text-slate-500">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                Security Staff
              </span>
              <span className="font-bold text-slate-800">{state.securityStaff}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                Medical Teams Active
              </span>
              <span className="font-bold text-slate-800">{state.medicalTeamsActive}</span>
            </div>
          </div>

          {/* Core Warning / Alert panel based on state */}
          <div className="space-y-2">
            {state.gateCStatus.toLowerCase().includes("alert") && (
              <div className="flex gap-2 bg-rose-50 border border-rose-150 p-3 rounded-xl text-xs text-rose-700 shadow-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 animate-bounce" />
                <div>
                  <span className="font-bold block uppercase tracking-wide text-rose-900">GATE C SECURITY WARNING</span>
                  Gate C is under active safety quarantine. Redirection scripts are loaded into AURA Copilot.
                </div>
              </div>
            )}
            
            {state.gateBStatus.toLowerCase().includes("heavy") && (
              <div className="flex gap-2 bg-amber-50 border border-amber-150 p-3 rounded-xl text-xs text-amber-700 shadow-sm">
                <Users className="w-4 h-4 shrink-0 text-amber-600" />
                <div>
                  <span className="font-bold block uppercase tracking-wide text-amber-900">GATE B CONGESTION DETECTED</span>
                  Extended wait times of ~25 minutes. Recommend redirection to Gate D or E.
                </div>
              </div>
            )}

            {!state.gateCStatus.toLowerCase().includes("alert") && !state.gateBStatus.toLowerCase().includes("heavy") && (
              <div className="flex gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-700 shadow-sm">
                <Compass className="w-4 h-4 shrink-0 text-emerald-600" />
                <div>
                  <span className="font-bold block uppercase tracking-wide text-emerald-900">OPERATIONS STABLE</span>
                  No critical bottlenecks reported. Ingress flows optimally structured.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
