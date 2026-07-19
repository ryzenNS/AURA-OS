import React, { useState } from "react";
import { StadiumState, UserProfile, DemonstrationScenario } from "../types";
import { StadiumVisualizer } from "./StadiumVisualizer";
import { ScenarioSelector } from "./ScenarioSelector";
import { 
  Eye, 
  Clock, 
  Sliders, 
  Utensils, 
  ShieldAlert, 
  Tv, 
  Database,
  RefreshCw,
  Cpu,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Wrench
} from "lucide-react";

interface ExplorerTwinProps {
  stadiumState: StadiumState;
  onUpdateStadiumState: (state: StadiumState) => void;
  profile: UserProfile;
  stadiumOrders: any[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onForceRefreshOrders: () => void;
  onSelectScenario: (scenario: DemonstrationScenario) => void;
  onAskAura: (prompt: string) => void;
}

export const ExplorerTwin: React.FC<ExplorerTwinProps> = ({
  stadiumState,
  onUpdateStadiumState,
  profile,
  stadiumOrders,
  onUpdateOrderStatus,
  onForceRefreshOrders,
  onSelectScenario,
  onAskAura
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"visualizer" | "cctv" | "scenarios" | "override" | "kitchen">("visualizer");
  const [selectedCctvCamera, setSelectedCctvCamera] = useState("cctv-gate-b");

  const currentTime = new Date();

  return (
    <div id="explorer-twin-root" className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Immersive Sub-Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
        <div>
          <h2 className="font-sans font-black text-lg text-slate-800 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            AI Digital Twin Core
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            FIFA 2026 Interactive Operational Dashboard & Ground Control
          </p>
        </div>

        {/* Modular Navigation Bar for sub-tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: "visualizer", label: "🏟️ Live Map" },
            { id: "cctv", label: "📹 CCTV Feeds" },
            { id: "kitchen", label: "🍔 Kitchen Board" },
            { id: "scenarios", label: "🧠 Drill Scenarios" },
            { id: "override", label: "⚙️ State Overrides" }
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === subTab.id 
                  ? "bg-white text-indigo-700 shadow-xs font-black" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area based on Selected SubTab */}
      {activeSubTab === "visualizer" && (
        <div className="grid grid-cols-1 gap-6">
          <StadiumVisualizer 
            state={stadiumState} 
            onGateClick={(gateName, status) => {
              onAskAura(`Analyze current operational capacity at ${gateName} (Status: ${status}) and recommend active volunteer dispatch scripts.`);
            }}
          />
        </div>
      )}

      {activeSubTab === "cctv" && (
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600 animate-pulse" />
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-800">Live CCTV Crowd-Flow Feeds</h4>
                <p className="text-[10px] text-slate-400 font-mono">Real-time pixel parsing & density metrics</p>
              </div>
            </div>
            <select
              value={selectedCctvCamera}
              onChange={(e) => setSelectedCctvCamera(e.target.value)}
              className="bg-white border border-gray-200 text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="cctv-gate-b">Camera 01: North Gate B Ingress</option>
              <option value="cctv-concourse">Camera 02: East Family Concourse (Sec 112)</option>
              <option value="cctv-seating">Camera 03: Field General Seating East</option>
            </select>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 overflow-hidden relative">
            {/* Recording Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-rose-500 font-mono text-[10px] font-bold uppercase animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              • LIVE
            </div>
            <div className="absolute top-4 right-4 text-slate-500 font-mono text-[9px] font-bold">
              {currentTime.toISOString().replace("T", " ").slice(0, 19)} UTC
            </div>

            <div className="h-52 flex flex-col items-center justify-center text-center space-y-3 relative">
              <div className="text-[11px] font-mono text-emerald-400 max-w-lg whitespace-pre-wrap leading-tight select-none font-bold">
                {selectedCctvCamera === "cctv-gate-b" ? (
                  `[CAMERA 01_GATE_B_NORTH]
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
█░░░░ VELOCITY: 0.3 m/s (HEAVY STAGGER) █
█░░░░ CHOKE RATIO: 82% (BOTTLENECK) ░░░█
█░░░░ INGRESS LEVEL: CRITICAL ░░░░░░░░░█
████████████████████████████████████████`
                ) : selectedCctvCamera === "cctv-concourse" ? (
                  `[CAMERA 02_CONCOURSE_112]
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
█░░░░ VELOCITY: 1.1 m/s (FLOWING WELL) █
█░░░░ CHOKE RATIO: 14% (OPTIMAL) ░░░░░░█
█░░░░ ACCESSIBILITY PATHS: CLEAR ░░░░░░█
████████████████████████████████████████`
                ) : (
                  `[CAMERA 03_FIELD_SEATING]
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
█░░░░ VELOCITY: 0.1 m/s (SPECTATORS) ░░█
█░░░░ CHOKE RATIO: 5% (SEATED) ░░░░░░░░█
█░░░░ STANDS FLOW: SECURE & STABLE ░░░░█
████████████████████████████████████████`
                )}
              </div>
              
              <div>
                <span className="block text-sm font-bold text-slate-200 font-sans">
                  {selectedCctvCamera === "cctv-gate-b"
                    ? "Gate B Congestion Chokepoint Feed"
                    : selectedCctvCamera === "cctv-concourse"
                    ? "East Concourse Section 112 Play Lounge"
                    : "East Seating Grandstands"}
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-1">
                  Res: 4K UHD | Frame rate: 60fps | Lens: Wide-Angle AI Dome | Analytics Status: Processing
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-900 pt-3 mt-2 text-xs">
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedCctvCamera === "cctv-gate-b" ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                {selectedCctvCamera === "cctv-gate-b" ? "⚠️ Bottleneck choke alert" : "🟢 Flow Status Normal"}
              </span>
              <button
                onClick={() => onAskAura(`Analyze current camera flow telemetry for ${selectedCctvCamera === "cctv-gate-b" ? "Gate B Ingress" : "East Concourse Section 112"} and generate optimization protocols.`)}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline font-bold cursor-pointer"
              >
                Let AURA Optimize This Feed &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "kitchen" && (
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-800">
                  🍔 Kitchen Orders Preparation Queue
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Simulates real-time seat delivery orders & dispatch status</p>
              </div>
            </div>
            <button
              onClick={onForceRefreshOrders}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border border-gray-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" /> Force Refresh Queue
            </button>
          </div>

          {!(profile.role === "staff" || profile.role === "admin") ? (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <span>🔒 ACCESS LEVEL: EVENT STAFF ONLY</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed font-semibold">
                This panel simulates the stadium's real-time culinary preparation dashboard. Only **Event Staff Members** and **Restaurant Employees** are authorized to manage hot food assembly and seat-runner dispatching.
              </p>
              <div className="text-[10px] bg-white border border-amber-100 rounded-xl p-3 text-slate-600 font-medium">
                👉 **How to unlock this**: Go to the **Profile** tab, and toggle your active role to **Stadium Event Staff** or **System Administrator**. It will instantly reveal the culinary queue with dispatcher actions!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stadiumOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                  No food orders currently in the kitchen queue. Place orders in the "🍔 Dining" tab!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
                  {stadiumOrders.map((order) => {
                    const badgeColor = 
                      order.status === "pending" ? "bg-amber-50 border-amber-200 text-amber-700" :
                      order.status === "preparing" ? "bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse" :
                      order.status === "completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                      "bg-slate-50 border-slate-200 text-slate-500";

                    return (
                      <div key={order.id} className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3 shadow-xs">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                          <span className="font-mono font-black text-xs text-slate-800">{order.id}</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Fan:</span>
                            <span className="font-bold text-slate-800">{order.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Seat Delivery:</span>
                            <span className="font-bold text-indigo-700 font-mono">{order.deliverySeat}</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-2 space-y-1">
                          <span className="block text-[9px] font-mono uppercase text-slate-400 font-black">Ordered Items:</span>
                          <div className="divide-y divide-gray-100 max-h-24 overflow-y-auto">
                            {order.items.map((it: any, itIdx: number) => (
                              <div key={itIdx} className="flex justify-between text-[11px] py-1 font-semibold text-slate-700">
                                <span>{it.name} <span className="text-[10px] text-slate-400">x{it.quantity}</span></span>
                                <span className="font-mono text-[10px] text-slate-500">${(it.price * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 flex flex-wrap gap-2 justify-between items-center">
                          <span className="font-mono text-xs font-black text-slate-900">${order.total.toFixed(2)}</span>
                          
                          {order.status === "pending" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "preparing")}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              🍳 Start cooking
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "completed")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 animate-pulse"
                            >
                              📦 Ready for delivery
                            </button>
                          )}
                          {order.status === "completed" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "delivered")}
                              className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              ✓ Complete & Deliver
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              ✓ Safely Dispatched
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "scenarios" && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
            <div className="mb-4">
              <h4 className="font-sans font-black text-sm text-slate-800">
                🚨 AI Operational Crisis Sim Drills
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Trigger pre-configured stadium incidents to test AURA response and coordination capabilities.
              </p>
            </div>

            <ScenarioSelector 
              onSelectScenario={onSelectScenario} 
              activeCategory={
                profile.role === "admin" ? "command" : profile.role === "staff" ? "volunteer" : "fan"
              }
            />
          </div>
        </div>
      )}

      {activeSubTab === "override" && (
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-800">
                AURA Operations Control Panel & State Override
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Tweak simulated parameters to live-test AURA safety dispatch intelligence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Gate B Status</label>
              <select
                value={stadiumState.gateBStatus}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, gateBStatus: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="Moderate">Moderate Wait</option>
                <option value="Heavy Congestion">Heavy Congestion</option>
                <option value="Security Lockdown">Security Lockdown</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Gate C Status</label>
              <select
                value={stadiumState.gateCStatus}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, gateCStatus: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="Security Alert">Security Alert</option>
                <option value="Under Review">Under Review</option>
                <option value="Quarantined">Quarantined</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Weather Condition</label>
              <select
                value={stadiumState.weather}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, weather: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
              >
                <option value="Sunny">Sunny / Clear</option>
                <option value="Overcast">Overcast</option>
                <option value="Light Rain">Light Rain</option>
                <option value="Severe Storm / Thunder">Severe Storm</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Volunteers Count</label>
              <input
                type="number"
                value={stadiumState.volunteersAvailable}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, volunteersAvailable: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Metro Link Delay (Mins)</label>
              <input
                type="number"
                value={stadiumState.metroDelay}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, metroDelay: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Attendance Override</label>
              <input
                type="number"
                value={stadiumState.attendance}
                onChange={(e) => onUpdateStadiumState({ ...stadiumState, attendance: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
