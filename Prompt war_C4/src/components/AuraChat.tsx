import React, { useState } from "react";
import { ChatMessage, UserMode, DemonstrationScenario } from "../types";
import Markdown from "react-markdown";
import { AuraLogo } from "./AuraLogo";
import {
  Brain,
  AlertTriangle,
  CheckSquare,
  Square,
  ShieldCheck,
  Eye,
  EyeOff,
  Leaf,
  Sparkles,
  Award,
  Clock,
  Navigation,
  Heart,
  Volume2,
  Copy,
  Check,
  Send,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AuraChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  activeMode: UserMode;
}

export const AuraChat: React.FC<AuraChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeMode,
}) => {
  const [inputText, setInputText] = useState("");
  const [showThinkingMap, setShowThinkingMap] = useState<{ [msgId: string]: boolean }>({});
  const [copiedTextMap, setCopiedTextMap] = useState<{ [key: string]: boolean }>({});
  const [checkedActions, setCheckedActions] = useState<{ [key: string]: boolean }>({});

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const toggleThinking = (id: string) => {
    setShowThinkingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedTextMap((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const toggleActionItem = (id: string) => {
    setCheckedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Speaks announcement using browser SpeechSynthesis
  const handleSpeakText = (text: string, langCode: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel active voices first
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95; // slightly slower for premium clear announcements
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const getModeLabelColor = (mode: UserMode) => {
    switch (mode) {
      case UserMode.FAN:
        return "bg-indigo-50 text-indigo-700 border border-indigo-100/60";
      case UserMode.VOLUNTEER:
        return "bg-rose-50 text-rose-700 border border-rose-100/60";
      case UserMode.COMMAND_CENTER:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  return (
    <div id="aura-chat-container" className="flex flex-col h-[520px] bg-white border border-gray-200 rounded-3xl overflow-hidden relative shadow-sm">
      
      {/* Active Mode Banner */}
      <div className="bg-slate-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h4 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
              AURA Operations Intel Co-Pilot
            </h4>
            <span className="text-[10px] text-slate-500 block font-mono font-medium">
              Ask queries or use Simulation commands
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full ${getModeLabelColor(activeMode)}`}>
            {activeMode === UserMode.FAN ? "FAN Mode" : activeMode === UserMode.VOLUNTEER ? "VOLUNTEER Mode" : "COMMAND Mode"}
          </span>
        </div>
      </div>

      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin bg-slate-50/25">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <div className="max-w-md">
              <h3 className="font-sans font-bold text-slate-800 text-base">AURA Core Intel Loaded</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                FIFA World Cup 2026 stadium operations are active. Select an operations scenario below or input custom questions to generate proactive operational intelligence.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-2`}
            >
              {/* User Message Bubble */}
              {msg.sender === "user" ? (
                <div className="flex items-start gap-2.5 max-w-[85%] animate-[slideUp_0.2s_ease-out]">
                  <div className="bg-indigo-600 border border-indigo-500 text-white rounded-2xl px-4 py-2.5 text-xs font-sans shadow-sm leading-relaxed font-medium">
                    {msg.text}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] uppercase shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                /* AURA Assistant Response Panel */
                <div className="w-full space-y-4 max-w-[95%] animate-[slideUp_0.25s_ease-out]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                      <AuraLogo size="sm" showText={false} light={true} />
                    </div>
                    <span className="font-sans font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      AURA intelligence
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">{msg.timestamp}</span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getModeLabelColor(msg.mode)}`}>
                      {msg.mode}
                    </span>
                  </div>
 
                  {/* Standard Collapsible Thinking Framework */}
                  {msg.thinking && (
                    <div className="border border-gray-250/60 bg-gray-50/50 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors bg-slate-100/50 cursor-pointer font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-indigo-600" />
                          AURA AI Thinking Log (9-Step Framework)
                        </span>
                        {showThinkingMap[msg.id] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      
                      {showThinkingMap[msg.id] && (
                        <div className="px-4 py-3 bg-white font-mono text-[10.5px] text-slate-500 whitespace-pre-line leading-relaxed border-t border-gray-200">
                          {msg.thinking}
                        </div>
                      )}
                    </div>
                  )}
 
                  {/* Render Core Simulation response if isSimulation */}
                  {msg.simulationResponse ? (
                    <div className="bg-white border border-gray-200 p-5 rounded-3xl space-y-5 shadow-sm">
                      
                      {/* Simulation Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <span className="text-[9px] font-mono text-rose-600 uppercase tracking-wider font-extrabold block">
                            Active Operations Simulation
                          </span>
                          <h4 className="font-sans font-extrabold text-sm text-slate-800 mt-0.5">
                            Predictive Evacuation & Emergency Vector Chart
                          </h4>
                        </div>
                        <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          CONFIDENCE: {msg.simulationResponse.confidenceScore}%
                        </div>
                      </div>
 
                      {/* Simulation Current Situation Banner */}
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-600 leading-normal font-medium">
                        <strong className="text-slate-850 block mb-0.5 font-bold">Scenario Context</strong>
                        {msg.simulationResponse.currentSituation}
                      </div>
 
                      {/* Interactive Visual Timeline */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-3">
                          🔮 Predicted Incident Timeline Progression
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          {[
                            { title: "T+5 Min", desc: msg.simulationResponse.predictedTimeline.fiveMin },
                            { title: "T+10 Min", desc: msg.simulationResponse.predictedTimeline.tenMin },
                            { title: "T+20 Min", desc: msg.simulationResponse.predictedTimeline.twentyMin },
                            { title: "T+30 Min", desc: msg.simulationResponse.predictedTimeline.thirtyMin },
                            { title: "T+60 Min", desc: msg.simulationResponse.predictedTimeline.sixtyMin },
                          ].map((node, index) => (
                            <div key={index} className="bg-white border border-gray-150 p-3 rounded-2xl relative flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-colors">
                              <div>
                                <span className="flex items-center gap-1 text-[10px] font-mono font-extrabold text-rose-600 mb-1">
                                  <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                                  {node.title}
                                </span>
                                <p className="text-[11px] text-slate-600 leading-normal font-medium">
                                  {node.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
 
                      {/* Side-by-Side Crowd & Volunteer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                          <h5 className="font-sans font-bold text-xs text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase">
                            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                            Crowd Redistribution vectors
                          </h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {msg.simulationResponse.crowdRedistribution}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                          <h5 className="font-sans font-bold text-xs text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase">
                            <Heart className="w-3.5 h-3.5 text-rose-600" />
                            Volunteer deployment guidance
                          </h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {msg.simulationResponse.volunteerDeployment}
                          </p>
                        </div>
                      </div>
 
                      {/* Impacts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs shadow-xs">
                          <span className="block font-mono text-[9px] uppercase text-slate-400 font-bold mb-1">Medical Impact</span>
                          <p className="text-slate-600 leading-normal font-medium">{msg.simulationResponse.medicalImpact}</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs shadow-xs">
                          <span className="block font-mono text-[9px] uppercase text-slate-400 font-bold mb-1">Transport Impact</span>
                          <p className="text-slate-600 leading-normal font-medium">{msg.simulationResponse.transportImpact}</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs shadow-xs">
                          <span className="block font-mono text-[9px] uppercase text-slate-400 font-bold mb-1">Accessibility Impact</span>
                          <p className="text-slate-600 leading-normal font-medium">{msg.simulationResponse.accessibilityImpact}</p>
                        </div>
                      </div>
 
                      {/* Recommended Announcements (TTS Enabled) */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          📢 Multilingual PA & Screen Broadcasts (TTS Enabled)
                        </span>
 
                        <div className="space-y-2">
                          {msg.simulationResponse.recommendedPublicAnnouncements.map((ann, i) => {
                            // Simple auto-detection of language
                            const isEs = ann.includes("[ES]");
                            const isFr = ann.includes("[FR]");
                            const isPt = ann.includes("[PT]");
                            const cleanText = ann.replace(/\[[A-Z]{2}\]\s*/g, "");
                            const langCode = isEs ? "es-ES" : isFr ? "fr-FR" : isPt ? "pt-PT" : "en-US";
                            const langLabel = isEs ? "Español" : isFr ? "Français" : isPt ? "Português" : "English";
 
                            return (
                              <div key={i} className="bg-gray-50 border border-gray-250/60 p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                                <div className="text-xs">
                                  <span className="font-mono text-[9px] text-indigo-600 font-bold block mb-0.5">
                                    {langLabel} alert Broadcast
                                  </span>
                                  <p className="text-slate-700 leading-normal italic font-sans font-medium">
                                    "{cleanText}"
                                  </p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleSpeakText(cleanText, langCode)}
                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer"
                                    title="Speak announcement aloud via AURA TTS Synthesizer"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCopyText(`ann-${msg.id}-${i}`, cleanText)}
                                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-slate-500 hover:text-slate-800 hover:border-gray-300 transition-all cursor-pointer"
                                    title="Copy announcement"
                                  >
                                    {copiedTextMap[`ann-${msg.id}-${i}`] ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-650" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
 
                      {/* Emergency Actions Checklists */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-150 pt-4">
                        <div>
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                            🚨 Critical Emergency Checklist
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                            {msg.simulationResponse.emergencyActions.map((act, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-600 font-mono mt-0.5 shrink-0">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                            🔄 Strategic Recovery Protocol
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {msg.simulationResponse.recoveryPlan}
                          </p>
                        </div>
                      </div>
 
                      {/* Lessons Learned */}
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 flex gap-2.5 text-xs text-slate-600">
                        <Award className="w-4 h-4 shrink-0 text-amber-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">Simulated Incident Lessons Learned</span>
                          {msg.simulationResponse.lessonsLearned}
                        </div>
                      </div>
 
                    </div>
                  ) : msg.structuredResponse ? (
                    /* Render Core Standard response if NOT isSimulation */
                    <div className="bg-white border border-gray-200 p-5 rounded-3xl space-y-5 shadow-sm">
                      
                      {/* Summary Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <span className="text-[9px] font-mono text-indigo-600 uppercase tracking-wider font-extrabold block">
                            AURA Decision Brief
                          </span>
                          <h4 className="font-sans font-bold text-sm text-slate-800 mt-0.5">
                            Active Logistics & Recommendation Board
                          </h4>
                        </div>
                        <div className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-xl text-xs font-mono font-bold">
                          CONFIDENCE: {msg.structuredResponse.confidenceScore}%
                        </div>
                      </div>
 
                      {/* Summary Banner */}
                      <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-600 leading-normal font-medium">
                        <strong className="text-slate-850 block mb-0.5 font-bold">Executive Summary</strong>
                        {msg.structuredResponse.situationSummary}
                      </div>
 
                      {/* Immediate Risks */}
                      {msg.structuredResponse.immediateRisks.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                            ⚠️ Active Risk Parameters Detected
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {msg.structuredResponse.immediateRisks.map((risk, i) => (
                              <div key={i} className="flex items-center gap-2 bg-rose-50 border border-rose-150 px-3 py-2 rounded-xl text-xs text-rose-700 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                                <span className="truncate">{risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
 
                      {/* Recommended Actions (Checklist UX) */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                          📋 Recommended Operations Checklist
                        </span>
                        <div className="space-y-1.5">
                          {msg.structuredResponse.recommendedActions.map((action, i) => {
                            const actionKey = `${msg.id}-action-${i}`;
                            const isChecked = checkedActions[actionKey] || false;
                            return (
                              <button
                                key={i}
                                onClick={() => toggleActionItem(actionKey)}
                                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/45 border-indigo-150 text-slate-450 line-through font-medium"
                                    : "bg-gray-50/50 border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 shrink-0 text-indigo-600 animate-pulse" />
                                ) : (
                                  <Square className="w-4 h-4 shrink-0 text-slate-400" />
                                )}
                                <span className="text-xs font-sans leading-snug font-medium">{action}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
 
                      {/* Reasoning Box */}
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="block font-mono text-[9px] uppercase text-slate-400 mb-1 font-extrabold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-indigo-600" />
                          Evidentiary Reasoning
                        </span>
                        <p className="text-xs text-slate-600 leading-normal font-sans font-medium">
                          {msg.structuredResponse.reasoning}
                        </p>
                      </div>
 
                      {/* Accessibility & Sustainability Double-Banner */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-xs text-indigo-800">
                          <span className="block font-mono text-[9px] uppercase text-indigo-600 mb-1.5 flex items-center gap-1 font-extrabold">
                            ♿ Accessibility Engine
                          </span>
                          <p className="leading-relaxed font-sans text-indigo-700 font-medium">
                            {msg.structuredResponse.accessibilityConsiderations}
                          </p>
                        </div>
                        <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800">
                          <span className="block font-mono text-[9px] uppercase text-emerald-600 mb-1.5 flex items-center gap-1 font-extrabold">
                            <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                            Eco-Sustainability Index
                          </span>
                          <p className="leading-relaxed font-sans text-emerald-700 font-medium">
                            {msg.structuredResponse.sustainabilityImpact}
                          </p>
                        </div>
                      </div>
 
                      {/* Alternatives & Next Best Action */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-150 pt-3">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 mr-1.5 font-bold">
                            Alternate Options:
                          </span>
                          {msg.structuredResponse.alternativeOptions.map((opt, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 text-[10px] px-2 py-0.5 rounded-full text-slate-600 font-mono font-semibold shadow-xs">
                              {opt}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                          <span className="block font-mono text-[9px] text-indigo-600 font-bold mb-0.5">Next Best Action</span>
                          <span className="font-sans text-slate-800 font-bold">{msg.structuredResponse.nextBestAction}</span>
                        </div>
                      </div>
 
                    </div>
                  ) : (
                    /* Fallback to simple markdown response */
                    <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm">
                      <div className="markdown-body text-xs text-slate-700 font-sans leading-relaxed space-y-2 font-medium">
                        <Markdown>{msg.plainText}</Markdown>
                      </div>
                    </div>
                  )}
 
                  {/* General Summary PlainText block (collapsible or displayed in a nice quote) */}
                  {msg.plainText && (msg.structuredResponse || msg.simulationResponse) && (
                    <div className="border-t border-gray-150 pt-3">
                      <details className="group cursor-pointer">
                        <summary className="text-[10px] font-mono text-slate-500 hover:text-slate-800 select-none flex items-center gap-1.5 list-none font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Show Human-Readable Summary Card &rarr;
                        </summary>
                        <div className="mt-3 bg-gray-50 border border-gray-200 p-4 rounded-2xl markdown-body text-xs text-slate-600 font-sans leading-relaxed space-y-2 pointer-events-auto font-medium">
                          <Markdown>{msg.plainText}</Markdown>
                        </div>
                      </details>
                    </div>
                  )}
 
                </div>
              )}
            </div>
          ))
        )}
 
        {/* Loading Spinner with status indicators */}
        {isLoading && (
          <div className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-2xl w-[260px] shadow-sm animate-pulse">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <div>
              <span className="text-xs text-slate-800 block font-bold font-sans">
                AURA is calculating...
              </span>
              <span className="text-[10px] text-slate-500 block font-mono font-semibold">
                Running 9-step decision loops
              </span>
            </div>
          </div>
        )}
      </div>
 
      {/* Input Form at the bottom */}
      <form onSubmit={handleSend} className="bg-slate-50 border-t border-gray-200 p-3 flex gap-2 z-10">
        <input
          id="chat-user-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Enter World Cup operations inquiry or type "What happens if..." for Simulation`}
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner font-medium"
        />
        <button
          id="chat-send-btn"
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shrink-0 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md active:scale-95"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
 
    </div>
  );
};
