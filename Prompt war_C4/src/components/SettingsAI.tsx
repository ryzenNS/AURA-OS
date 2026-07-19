import React, { useState } from "react";
import { 
  Settings, 
  Volume2, 
  Smartphone, 
  Bell, 
  Globe, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  Info,
  CheckCircle,
  HelpCircle,
  RefreshCw
} from "lucide-react";

interface SettingsAIProps {
  onAskAura: (prompt: string) => void;
  onClearCache: () => void;
}

export const SettingsAI: React.FC<SettingsAIProps> = ({
  onAskAura,
  onClearCache,
}) => {
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticAlerts, setHapticAlerts] = useState(true);
  const [pushAlarms, setPushAlarms] = useState(true);
  const [language, setLanguage] = useState("English");
  const [auraActive, setAuraActive] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onAskAura(`Successfully saved system preferences. Sound Effects: ${soundEffects}, Haptics: ${hapticAlerts}, Language: ${language}, AURA Active: ${auraActive}.`);
  };

  return (
    <div id="settings-ai-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Config Panel (7 Cols) */}
      <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Companion Core Settings
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Configure system soundboards, notification alarms, languages, and overall AURA capabilities.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Volume2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">System Auditory Sound Effects</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Enables crowd roar cheer chime when match events trigger.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                soundEffects ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                soundEffects ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Haptic / Vibration alerts */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Smartphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">Haptic & Vibration Pulses</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Enables tactile device haptic buzzes for key alarm notices.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHapticAlerts(!hapticAlerts)}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                hapticAlerts ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                hapticAlerts ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Smart proactive Push alarms */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Bell className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">Smart Proactive Push Alarms</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Alerts you when there is an active seat order, or queue delay.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPushAlarms(!pushAlarms)}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                pushAlarms ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                pushAlarms ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* AURA Smart Assistant Active */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-gray-150 rounded-2xl">
            <div className="space-y-0.5 flex gap-2.5 items-start">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-800 block">AURA Intelligence Core Active</span>
                <span className="text-[10px] text-slate-400 leading-normal block">Allows the system to proactively send suggestions and summarize telemetry.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuraActive(!auraActive)}
              className={`w-10 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                auraActive ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${
                auraActive ? "right-1" : "left-1"
              }`}></span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="space-y-1 pt-1">
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> In-App Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="English">English (US/UK)</option>
              <option value="Español">Español (América Latina / España)</option>
              <option value="Français">Français (France / Canada)</option>
              <option value="Deutsch">Deutsch</option>
              <option value="Português">Português (Brasil)</option>
            </select>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle className="w-4 h-4" /> Changes Applied Globally!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Right Column: Reset Local cache data and Security certifications (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Reset cache panel */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <div>
              <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight">
                Clear Local Application Cache
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Reset state & clear cookie tokens</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-normal font-semibold">
            This action completely wipes your ticket registries, active dining orders, in-app chat history, and resets your profile to default settings. 
          </p>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete and reset all application cache data? This action is irreversible.")) {
                onClearCache();
              }
            }}
            className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Local App Data</span>
          </button>
        </div>

        {/* Security / FIFA certifications banner */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-3xl text-white space-y-3.5 border border-indigo-800/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          
          <div className="relative z-10 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-sans font-black text-sm tracking-tight">FIFA Security Certification</h4>
          </div>

          <p className="relative z-10 text-[11px] text-slate-300 leading-relaxed font-semibold">
            All user data, ticket barcode sections, in-seat food orders, and emergency panic coordinates are encrypted end-to-end on Google Cloud secure server-side databases under FIFA World Cup 2026 digital compliance policies.
          </p>

          <div className="relative z-10 flex gap-2">
            <span className="text-[8.5px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase font-bold border border-emerald-500/20">
              HIPAA Compliant
            </span>
            <span className="text-[8.5px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase font-bold border border-indigo-500/20">
              ISO-27001 Certified
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
