import React from "react";

interface AuraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  light?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  light = false
}) => {
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { svg: "w-8 h-8", title: "text-base", subtitle: "text-[7px]" };
      case "md":
        return { svg: "w-12 h-12", title: "text-lg", subtitle: "text-[8px]" };
      case "lg":
        return { svg: "w-20 h-20", title: "text-2xl", subtitle: "text-[10px]" };
      case "xl":
        return { svg: "w-32 h-32", title: "text-4xl", subtitle: "text-xs" };
    }
  };

  const dim = getDimensions();

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* High-fidelity SVG recreation of Gemini-generated AURA logo */}
      <div className={`relative ${dim.svg} transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cyan/Blue orbital glow trail background */}
          <path
            d="M 60,110 C 40,80 70,50 110,40 C 130,35 150,50 155,70"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1 3"
            opacity="0.4"
          />

          {/* Orange orbital glow trail background */}
          <path
            d="M 140,90 C 160,120 130,150 90,160 C 70,165 50,150 45,130"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1 3"
            opacity="0.4"
          />

          {/* Left leg of A (Cyan/Blue curve) */}
          <path
            d="M 85,140 L 105,75 L 115,75"
            stroke="#06b6d4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right leg of A (Orange curve) */}
          <path
            d="M 115,75 L 135,140"
            stroke="#f97316"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intersecting center bars (Black/Slate) */}
          <path
            d="M 90,120 L 130,95"
            stroke={light ? "#0f172a" : "#cbd5e1"}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 90,95 L 130,120"
            stroke={light ? "#0f172a" : "#cbd5e1"}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Center node dot */}
          <circle
            cx="110"
            cy="107.5"
            r="8"
            fill={light ? "#0f172a" : "#cbd5e1"}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle
            cx="110"
            cy="107.5"
            r="3"
            fill="#0ea5e9"
          />

          {/* Diagonal Ellipse Ring 1 (Tilted 45deg, Cyan bottom to top) */}
          <path
            d="M 45,115 C 30,85 70,40 120,45 C 165,50 180,95 145,130 C 115,160 65,145 45,115 Z"
            stroke={light ? "#1e293b" : "#f8fafc"}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Outer Ring 2 (Orange bottom to top) with intersecting node */}
          <path
            d="M 60,140 C 35,100 80,55 130,65 C 170,73 175,110 145,135 C 120,155 80,165 60,140 Z"
            stroke={light ? "#0f172a" : "#e2e8f0"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset="12"
          />

          {/* Orbital Intersection Nodes (White/Orange glowing dots) */}
          <circle
            cx="144"
            cy="112"
            r="6"
            fill="#f97316"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle
            cx="66"
            cy="92"
            r="4.5"
            fill="#06b6d4"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>

        {/* Outer orbital rings animation effect */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
      </div>

      {showText && (
        <div className="mt-4 flex flex-col items-center">
          <span className={`font-sans font-black tracking-widest leading-none ${
            size === "sm" ? "text-sm" :
            size === "md" ? "text-lg" :
            size === "lg" ? "text-2xl" : "text-4xl"
          } ${light ? "text-slate-900" : "text-white"}`}>
            AURA
          </span>
          <span className={`font-mono font-bold tracking-wider mt-1.5 opacity-80 uppercase ${dim.subtitle} ${
            light ? "text-indigo-950" : "text-indigo-200"
          }`}>
            Automated Unified Resources &amp; Allocation OS
          </span>
        </div>
      )}
    </div>
  );
};
