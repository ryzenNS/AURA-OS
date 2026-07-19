import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { Sparkles, Play, ShieldAlert, CheckCircle2 } from "lucide-react";

interface KickOffTransitionProps {
  user: UserProfile;
  onComplete: () => void;
}

const SoccerBallSvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full text-slate-900 drop-shadow-2xl"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#111111" strokeWidth="4" />
    {/* Center pentagon */}
    <polygon points="50,36 62,45 57,58 43,58 38,45" fill="#111111" />
    {/* Panel lines */}
    <path
      d="M50,12 L50,24 M12,50 L24,50 M88,50 L76,50 M50,88 L50,76"
      stroke="#111111"
      strokeWidth="3.5"
    />
    <path
      d="M50,36 L50,24 M62,45 L74,41 M57,58 L66,67 M43,58 L34,67 M38,45 L26,41"
      stroke="#111111"
      strokeWidth="3.5"
    />
    {/* Surrounding pentagons */}
    <polygon points="50,12 36,8 24,16 28,29 40,19" fill="#111111" opacity="0.9" />
    <polygon points="88,32 78,30 71,43 79,53 89,44" fill="#111111" opacity="0.9" />
    <polygon points="76,76 66,67 79,63 87,72 79,82" fill="#111111" opacity="0.9" />
    <polygon points="24,76 34,67 21,63 13,72 21,82" fill="#111111" opacity="0.9" />
    <polygon points="12,32 22,30 29,43 21,53 11,44" fill="#111111" opacity="0.9" />
    {/* Highlighting details */}
    <circle cx="35" cy="30" r="4" fill="#ffffff" opacity="0.4" />
  </svg>
);

export const KickOffTransition: React.FC<KickOffTransitionProps> = ({ user, onComplete }) => {
  const [kickState, setKickState] = useState<"idle" | "aiming" | "kicked" | "zooming" | "done">("idle");
  const [countdown, setCountdown] = useState<number>(3);
  const [showCountdown, setShowCountdown] = useState(true);

  // Auto kick timer
  useEffect(() => {
    if (kickState !== "idle") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowCountdown(false);
          triggerKick();
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [kickState]);

  const triggerKick = () => {
    if (kickState !== "idle") return;
    setKickState("aiming");

    // Swing back, then kick!
    setTimeout(() => {
      setKickState("kicked");
      
      // Keep rolling on the ground, then zoom in "towards them" (the user screen)
      setTimeout(() => {
        setKickState("zooming");

        // Complete transition
        setTimeout(() => {
          setKickState("done");
          onComplete();
        }, 1200);
      }, 1500);
    }, 400);
  };

  const getRoleBadgeColor = (r: string) => {
    switch (r) {
      case "admin":
        return "bg-indigo-600 text-white border-indigo-400";
      case "staff":
        return "bg-emerald-600 text-white border-emerald-400";
      case "volunteer":
        return "bg-teal-600 text-white border-teal-400";
      default:
        return "bg-amber-500 text-slate-900 border-amber-300";
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-[#070c14] flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* 1. TOP STATS BAR / TELEMETRY OVERLAY */}
      <div className="w-full bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              AURA SECURE CHANNELS
            </span>
            <span className="text-xs text-white font-extrabold tracking-tight">
              KICK-OFF INITIATION FOR {user.name.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="hidden md:inline bg-slate-900 px-3 py-1 rounded-md border border-slate-800 font-semibold">
            SECURE ROUTE: HOST_GRID_STADIUM_INTERCEPT
          </span>
          <span className={`px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>
      </div>

      {/* 2. THE PITCH & THE ANIMATION FRAME */}
      <div className="relative flex-1 w-full bg-radial from-[#12281a] via-[#091510] to-[#04080d] flex items-center justify-center overflow-hidden">
        
        {/* Stadium Tactical Lines Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white border-dashed border-r border-white/50" />
          {/* Penalty box (Left) */}
          <div className="absolute top-1/4 bottom-1/4 left-0 w-[15%] border-y border-r border-white" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white rounded-full" />
          {/* Center spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full" />
        </div>

        {/* Stadium light beam cones */}
        <div className="absolute top-0 left-1/4 w-32 h-[300px] bg-indigo-500/10 blur-3xl rounded-full transform -rotate-12 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-[300px] bg-emerald-500/10 blur-3xl rounded-full transform rotate-12 pointer-events-none" />

        {/* Live Grid Coordinates watermark */}
        <div className="absolute bottom-6 left-6 text-[9px] font-mono text-slate-600 tracking-wider hidden md:block">
          SECURE ENCRYPTED NODE ID: {user.credentialId || "GUEST-FAN-2026"} • ACCELERATION METER: ACTIVE
        </div>

        {/* ANIMATION STAGE CONTAINER */}
        <div className="relative w-full max-w-4xl h-72 flex items-center justify-between px-10 md:px-20">
          
          {/* A. AVATAR PLAYER (Left Side) */}
          <div className="relative flex flex-col items-center z-10">
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-16 bg-white text-slate-900 text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Let's kick-off AURA OS!</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-slate-200" />
            </motion.div>

            {/* Stylized Player Body & Leg */}
            <div className="relative w-24 h-40 flex flex-col items-center">
              
              {/* Head / Avatar Circle */}
              <div className="relative w-16 h-16 rounded-full border-3 border-indigo-500 shadow-xl overflow-hidden bg-slate-900">
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Jersey/Torso */}
              <div className="relative w-10 h-14 bg-indigo-600 rounded-t-lg mt-1 border-x border-t border-indigo-400 flex flex-col items-center justify-center shadow-md">
                <span className="text-[10px] font-black text-white leading-none">AURA</span>
                <span className="text-[11px] font-mono font-extrabold text-amber-400 leading-none mt-0.5">26</span>
                {/* Arm left */}
                <div className="absolute -left-2 top-0 w-2.5 h-8 bg-indigo-500 rounded-l-md origin-top transform rotate-12" />
                {/* Arm right */}
                <div className="absolute -right-2 top-0 w-2.5 h-8 bg-indigo-500 rounded-r-md origin-top transform -rotate-12" />
              </div>

              {/* Legs and Kicking Leg (Pivoted around hip) */}
              <div className="absolute bottom-1 w-12 h-12 flex justify-around">
                {/* Standing Leg (Left) */}
                <div className="w-3.5 h-10 bg-slate-300 border border-slate-400 rounded-b-md" />

                {/* Kicking Leg (Right) with pivot animation */}
                <motion.div
                  className="w-3.5 h-10 bg-indigo-500 border border-indigo-400 rounded-b-md origin-top"
                  animate={
                    kickState === "aiming"
                      ? { rotate: -35 } // Pull back leg to wind up
                      : kickState === "kicked" || kickState === "zooming" || kickState === "done"
                      ? { rotate: 55 } // Swing forward kick
                      : { rotate: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: kickState === "aiming" ? 100 : 400,
                    damping: 15,
                  }}
                />
              </div>
            </div>

            {/* User name label on pitch */}
            <span className="text-xs text-white font-extrabold tracking-wide mt-2 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              {user.name}
            </span>
          </div>

          {/* B. THE TARGET GATE PORTAL (Right Side) */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-24 h-40 border-3 border-emerald-500/30 border-b-0 rounded-t-full bg-emerald-500/5 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              {/* Pulsing Target Ring */}
              <div className="absolute inset-2 border border-emerald-500/20 rounded-t-full animate-pulse" />
              
              <div className="text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto animate-bounce" />
                <span className="block text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  STADIUM GATE
                </span>
                <span className="block text-[9px] font-black text-white">
                  AURA INPUT
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase mt-2">
              PORTAL ENGAGED
            </span>
          </div>

          {/* C. THE FOOTBALL (SOCCER BALL) - Animated trajectory */}
          <motion.div
            className="absolute left-[85px] bottom-[30px] w-12 h-12 z-20"
            animate={
              kickState === "idle" || kickState === "aiming"
                ? {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                  }
                : kickState === "kicked"
                ? {
                    // Parabolic arc bounce trajectory to the right
                    x: [0, 180, 360, 500, 580],
                    y: [0, -70, 0, -25, 0],
                    scale: [1, 1.1, 1, 1.05, 1],
                    rotate: [0, 180, 360, 540, 720],
                  }
                : kickState === "zooming" || kickState === "done"
                ? {
                    // Ball rolls right up towards the camera/spectator ("them") on the ground!
                    x: [580, 420, 260],
                    y: [0, 50, 120],
                    scale: [1, 5, 25], // Zooms massive to cover screen!
                    rotate: [720, 960, 1200],
                    opacity: [1, 1, 0.1],
                  }
                : {}
            }
            transition={{
              duration: kickState === "kicked" ? 1.5 : kickState === "zooming" ? 1.2 : 0,
              ease: kickState === "kicked" ? "easeOut" : "easeInOut",
            }}
          >
            <SoccerBallSvg />

            {/* Impact Kick Shockwave */}
            {kickState === "kicked" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-amber-400/30 rounded-full border border-amber-400/60 pointer-events-none"
              />
            )}
          </motion.div>

          {/* Dynamic grass dust particles during roll */}
          {kickState === "kicked" && (
            <div className="absolute left-[150px] right-[100px] bottom-[30px] h-2 overflow-hidden pointer-events-none">
              <div className="w-full h-full flex justify-around">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 2, scale: 0.5, opacity: 0 }}
                    animate={{ y: -8, scale: [0.5, 1.2, 0], opacity: [0, 0.8, 0] }}
                    transition={{
                      delay: 0.2 * i,
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                    className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 3. CENTER OVERLAY COUNTDOWN / TAP PROMPT */}
        {kickState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-xs z-30">
            {showCountdown && (
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <span className="block font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-black mb-1">
                  GET READY FOR TICK-OFF
                </span>
                <span className="block font-sans font-black text-6xl text-white tracking-tighter">
                  {countdown}
                </span>
              </motion.div>
            )}

            <button
              onClick={triggerKick}
              className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-400 text-slate-900 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4.5 h-4.5 fill-slate-900" />
              <span>Tap to Kick Ball Now ⚽</span>
            </button>
          </div>
        )}

        {/* Fullscreen white flash overlay when zooming to complete */}
        {kickState === "zooming" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 1.2, times: [0, 0.6, 1] }}
            className="absolute inset-0 bg-[#070c14] z-40 flex items-center justify-center"
          >
            <div className="text-center space-y-3">
              <span className="block font-sans font-black text-3xl text-emerald-400 tracking-tight uppercase animate-pulse">
                ACCESS GRANTED
              </span>
              <span className="block font-mono text-xs text-slate-400">
                PROVISIONING STADI-INTELLIGENCE TELEMETRY KEYRING...
              </span>
            </div>
          </motion.div>
        )}

      </div>

      {/* 4. BOTTOM CREDENTIAL CHECKER BOARD */}
      <div className="w-full bg-slate-950 border-t border-slate-800/80 px-6 py-5 z-10 text-center">
        <p className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider max-w-xl mx-auto leading-relaxed">
          The AURA system uses secure matchday telemetry coordinates to authenticate spectators, volunteers, and staff members. Game on!
        </p>
      </div>

    </div>
  );
};
