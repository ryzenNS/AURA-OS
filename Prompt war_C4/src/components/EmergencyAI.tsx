import React, { useState, useRef, useEffect } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Upload, 
  MapPin, 
  Clock, 
  Camera, 
  Search, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";

interface EmergencyAIProps {
  onAskAura: (prompt: string) => void;
}

interface FoundItem {
  id: string;
  name: string;
  locationFound: string;
  timeFound: string;
  status: "Claimed" | "Awaiting Claim" | "Processing AI Match";
  imageLabel: string;
}

export const EmergencyAI: React.FC<EmergencyAIProps> = ({
  onAskAura,
}) => {
  // Panic state
  const [panicHoldProgress, setPanicHoldProgress] = useState(0);
  const [isPanicked, setIsPanicked] = useState(false);
  const panicTimerRef = useRef<any>(null);

  // Lost & Found uploads
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [analyzedItemName, setAnalyzedItemName] = useState<string | null>(null);

  // Recovery listings
  const [foundItems, setFoundItems] = useState<FoundItem[]>([
    { id: "lost-01", name: "Brown Leather Wallet", locationFound: "Section 112, Row F", timeFound: "30 mins ago", status: "Awaiting Claim", imageLabel: "💳 Wallet" },
    { id: "lost-02", name: "Black Apple iPhone 15 Pro", locationFound: "Gate D Concourse Corridor", timeFound: "1 hour ago", status: "Processing AI Match", imageLabel: "📱 Phone" },
    { id: "lost-03", name: "Silver Mercedes Key Fob", locationFound: "Parking Block B, Bay 42", timeFound: "2 hours ago", status: "Claimed", imageLabel: "🔑 Car Key" }
  ]);

  // Handle Panic Hold
  const handlePanicStart = () => {
    setIsPanicked(false);
    setPanicHoldProgress(0);
    
    panicTimerRef.current = setInterval(() => {
      setPanicHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(panicTimerRef.current);
          setIsPanicked(true);
          // Alert Aura with immediate details
          onAskAura("🚨 PANIC BUTTON INITIATED! Dispatch immediate Medical Response Team and Security Officers to Section 112, Row L, Seat 14. Emergency status: Active.");
          return 100;
        }
        return prev + 5; // Takes 2 seconds to hold
      });
    }, 100);
  };

  const handlePanicEnd = () => {
    clearInterval(panicTimerRef.current);
    if (panicHoldProgress < 100) {
      setPanicHoldProgress(0);
    }
  };

  // Simulated AI photo analyze
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingPhoto(true);
    setUploadedPhotoUrl(URL.createObjectURL(file));

    // Simulate AI parsing after 2 seconds
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setAnalyzedItemName("Brown Leather Wallet");
      
      // Proactively search and match in listings
      onAskAura(`Analyze lost item photo: user has lost a Brown Leather Wallet. Cross-reference with stadium's central Lost & Found inventory and suggest claiming instructions.`);
    }, 2000);
  };

  return (
    <div id="emergency-ai-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Massive Hold Panic button (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 text-center">
        <div className="text-left">
          <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Stadium Panic Core
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Hold button for 2 seconds to dispatch medical, fire, or safety support teams straight to your exact seat.
          </p>
        </div>

        {/* Big holding action wrapper */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onMouseDown={handlePanicStart}
            onMouseUp={handlePanicEnd}
            onMouseLeave={handlePanicEnd}
            onTouchStart={handlePanicStart}
            onTouchEnd={handlePanicEnd}
            className={`w-40 h-40 rounded-full border-8 flex flex-col items-center justify-center transition-all relative select-none cursor-pointer active:scale-95 ${
              isPanicked 
                ? "bg-rose-600 border-rose-400 text-white animate-pulse" 
                : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
            }`}
            style={{
              backgroundImage: `conic-gradient(#dc2626 ${panicHoldProgress}%, transparent ${panicHoldProgress}%)`
            }}
          >
            {/* Center inner circle to hide the gradient background */}
            <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center p-3 shadow-inner">
              <AlertTriangle className={`w-10 h-10 ${isPanicked ? "text-rose-600 animate-bounce" : "text-rose-500"}`} />
              <span className="text-[11px] font-mono font-black uppercase mt-1 text-slate-700 leading-tight">
                {isPanicked ? "ALERT SENT!" : "HOLD TO ALERT"}
              </span>
              {!isPanicked && (
                <span className="text-[8.5px] font-mono text-slate-400 block mt-0.5 font-bold uppercase">
                  {panicHoldProgress > 0 ? `${Math.round(panicHoldProgress)}%` : "2 Secs"}
                </span>
              )}
            </div>
          </button>

          <div className="space-y-1 max-w-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Direct Seat coordinates
            </span>
            <span className="text-xs font-black text-slate-800 bg-slate-100 border border-gray-150 px-3 py-1 rounded-xl inline-block font-mono">
              📍 Section 112, Row L, Seat 14
            </span>
          </div>
        </div>

        {isPanicked && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-left space-y-2 animate-[slideUp_0.2s_ease-out]">
            <div className="flex items-center gap-1 text-rose-800 font-bold text-xs">
              <span>🚨 EMERGENCY RESPONSE ACTIVE</span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed font-semibold">
              Your coordinate beacon is emitting live. AURA dispatcher has prioritized your signal and dispatched immediate response runners to Section 112. Stay calm and stay seated.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: AI-Powered Lost & Found Hub (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Photo Uploader */}
        <div className="space-y-3">
          <div className="mb-1">
            <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              🔍 AI Lost & Found Claim Desk
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Upload a snapshot of your lost item (keys, phones, wallets). AURA's spatial camera neural nets will look for matches.
            </p>
          </div>

          <label className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-gray-50/30">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />
            {uploadedPhotoUrl ? (
              <div className="space-y-3 relative">
                <img 
                  src={uploadedPhotoUrl} 
                  alt="Lost item preview" 
                  className="max-h-24 rounded-xl object-contain mx-auto shadow-xs border border-gray-150" 
                />
                {isAnalyzingPhoto ? (
                  <span className="text-[10px] text-indigo-600 font-mono font-bold animate-pulse block">
                    ⚡ Neural Scanning In Progress...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-mono font-bold block flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Scanned! Analyzed category: <strong>{analyzedItemName}</strong>
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-150 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-800">Drop or select lost item photograph</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Supports PNG, JPG up to 10MB</span>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Recent Recoveries Registry */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h4 className="font-sans font-black text-slate-800 text-xs uppercase tracking-wide">
            Recently Recovered Stadium Items
          </h4>

          <div className="divide-y divide-gray-100">
            {foundItems.map((item) => {
              const isMatched = item.status === "Claimed";
              const isProcessing = item.status.toLowerCase().includes("processing");
              
              return (
                <div key={item.id} className="py-3 flex justify-between items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.imageLabel} {item.name}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isMatched ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                        isProcessing ? "bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse" :
                        "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold font-mono">
                      <span>📍 Found: {item.locationFound}</span>
                      <span>•</span>
                      <span>{item.timeFound}</span>
                    </div>
                  </div>

                  {!isMatched && (
                    <button
                      onClick={() => {
                        onAskAura(`I want to submit a formal claiming request for recovered item ID ${item.id} (${item.name}) located in ${item.locationFound}. Provide required security clearance steps.`);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-gray-200 text-slate-700 font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      File Claim
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
