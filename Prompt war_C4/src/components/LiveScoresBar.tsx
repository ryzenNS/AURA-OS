import React, { useState, useEffect } from "react";
import { Clock, Trophy, Play, Activity, Calendar, Shield, Users, RefreshCw, ChevronRight, ChevronLeft, Volume2, Camera, Target } from "lucide-react";

export interface MatchScore {
  homeTeam: string;
  homeCode: string;
  homeScore: number;
  homeFlag: string;
  awayTeam: string;
  awayCode: string;
  awayScore: number;
  awayFlag: string;
  minute: number;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  events: { time: number; team: "home" | "away"; player: string; type: "goal" | "yellow" | "red" }[];
  stats: {
    possession: [number, number]; // home, away
    shots: [number, number];
    fouls: [number, number];
    corners: [number, number];
  };
}

export interface UpcomingMatch {
  id: string;
  homeTeam: string;
  homeCode: string;
  homeFlag: string;
  awayTeam: string;
  awayCode: string;
  awayFlag: string;
  date: string;
  time: string;
  stadium: string;
  group: string;
}

interface Coord {
  x: number;
  y: number;
}

const getCoordinates = (state: string): {
  ball: Coord;
  usa1: Coord;
  usa2: Coord;
  usa3: Coord;
  ger1: Coord;
  ger2: Coord;
  ger3: Coord;
} => {
  switch (state) {
    case "USA_ATTACK":
      return {
        ball: { x: 74, y: 35 },
        usa1: { x: 70, y: 38 },
        usa2: { x: 58, y: 50 },
        usa3: { x: 30, y: 48 },
        ger1: { x: 82, y: 38 },
        ger2: { x: 64, y: 55 },
        ger3: { x: 45, y: 50 }
      };
    case "GER_ATTACK":
      return {
        ball: { x: 26, y: 65 },
        usa1: { x: 28, y: 60 },
        usa2: { x: 42, y: 48 },
        usa3: { x: 55, y: 50 },
        ger1: { x: 18, y: 62 },
        ger2: { x: 36, y: 45 },
        ger3: { x: 70, y: 52 }
      };
    case "USA_SHOT":
      return {
        ball: { x: 91, y: 49 },
        usa1: { x: 86, y: 48 },
        usa2: { x: 62, y: 45 },
        usa3: { x: 35, y: 50 },
        ger1: { x: 95, y: 50 },
        ger2: { x: 74, y: 55 },
        ger3: { x: 52, y: 48 }
      };
    case "GER_SHOT":
      return {
        ball: { x: 9, y: 51 },
        usa1: { x: 5, y: 50 },
        usa2: { x: 28, y: 45 },
        usa3: { x: 48, y: 50 },
        ger1: { x: 14, y: 52 },
        ger2: { x: 38, y: 55 },
        ger3: { x: 65, y: 48 }
      };
    case "CORNER":
      return {
        ball: { x: 96, y: 6 },
        usa1: { x: 85, y: 25 },
        usa2: { x: 78, y: 50 },
        usa3: { x: 40, y: 48 },
        ger1: { x: 86, y: 20 },
        ger2: { x: 82, y: 45 },
        ger3: { x: 55, y: 52 }
      };
    case "MIDFIELD":
    default:
      return {
        ball: { x: 50, y: 50 },
        usa1: { x: 42, y: 40 },
        usa2: { x: 35, y: 60 },
        usa3: { x: 20, y: 50 },
        ger1: { x: 58, y: 60 },
        ger2: { x: 65, y: 40 },
        ger3: { x: 80, y: 50 }
      };
  }
};

const INITIAL_MOCK_MATCHES: MatchScore[] = [
  {
    homeTeam: "United States",
    homeCode: "USA",
    homeScore: 2,
    homeFlag: "🇺🇸",
    awayTeam: "Germany",
    awayCode: "GER",
    awayScore: 1,
    awayFlag: "🇩🇪",
    minute: 78,
    status: "LIVE",
    events: [
      { time: 24, team: "away", player: "F. Wirtz", type: "goal" },
      { time: 42, team: "home", player: "C. Pulisic", type: "goal" },
      { time: 58, team: "home", player: "W. McKennie", type: "yellow" },
      { time: 69, team: "home", player: "F. Balogun", type: "goal" },
      { time: 72, team: "away", player: "A. Rüdiger", type: "yellow" },
    ],
    stats: {
      possession: [47, 53],
      shots: [11, 14],
      fouls: [9, 12],
      corners: [4, 6],
    }
  }
];

const UPCOMING_MATCHES: UpcomingMatch[] = [
  {
    id: "m2",
    homeTeam: "Argentina",
    homeCode: "ARG",
    homeFlag: "🇦🇷",
    awayTeam: "France",
    awayCode: "FRA",
    awayFlag: "🇫🇷",
    date: "July 16, 2026",
    time: "18:00 UTC",
    stadium: "MetLife Stadium, East Rutherford",
    group: "Quarter-Final 1"
  },
  {
    id: "m3",
    homeTeam: "Brazil",
    homeCode: "BRA",
    homeFlag: "🇧🇷",
    awayTeam: "Spain",
    awayCode: "ESP",
    awayFlag: "🇪🇸",
    date: "July 17, 2026",
    time: "21:00 UTC",
    stadium: "Mercedes-Benz Stadium, Atlanta",
    group: "Quarter-Final 2"
  },
  {
    id: "m4",
    homeTeam: "Japan",
    homeCode: "JPN",
    homeFlag: "🇯🇵",
    awayTeam: "England",
    awayCode: "ENG",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date: "July 18, 2026",
    time: "15:00 UTC",
    stadium: "SoFi Stadium, Los Angeles",
    group: "Quarter-Final 3"
  }
];

export const LiveScoresBar: React.FC = () => {
  const [liveMatch, setLiveMatch] = useState<MatchScore>(INITIAL_MOCK_MATCHES[0]);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"LIVE" | "UPCOMING" | "STANDINGS" | "SPECTATE">("LIVE");

  // Live tactical field spectator states
  const [playState, setPlayState] = useState<"MIDFIELD" | "USA_ATTACK" | "GER_ATTACK" | "USA_SHOT" | "GER_SHOT" | "CORNER">("MIDFIELD");
  const [activeCamera, setActiveCamera] = useState<"radar" | "smart" | "fancam">("radar");
  const [crowdBuzz, setCrowdBuzz] = useState(78);
  const [usaCheers, setUsaCheers] = useState(0);
  const [gerCheers, setGerCheers] = useState(0);
  const [commentaryLogs, setCommentaryLogs] = useState<{ time: string; text: string; highlight?: boolean }[]>([
    { time: "78:00", text: "Match is intensely contested. USA holds a narrow 2-1 lead over Germany.", highlight: true },
    { time: "77:40", text: "Corner cleared by Antonio Rüdiger with a powerful header." },
    { time: "76:55", text: "Foul by Weston McKennie in the center circle. Free kick awarded to Germany." }
  ]);

  // Dynamic play-by-play ticker simulation
  useEffect(() => {
    const states = ["MIDFIELD", "USA_ATTACK", "GER_ATTACK", "USA_SHOT", "GER_SHOT", "CORNER"] as const;
    
    const playInterval = setInterval(() => {
      // Choose next play state randomly
      const nextState = states[Math.floor(Math.random() * states.length)];
      setPlayState(nextState);

      // Fluctuate crowd buzz slightly
      setCrowdBuzz(prev => {
        const diff = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(68, Math.min(92, prev + diff));
      });

      // Generate matching play commentary line
      const matchMin = liveMatch.minute;
      const secStr = Math.floor(Math.random() * 60).toString().padStart(2, "0");
      const timestamp = `${matchMin}:${secStr}`;

      let text = "";
      let highlight = false;

      switch (nextState) {
        case "USA_ATTACK":
          text = Math.random() > 0.5 
            ? "Pulisic drives forward on the left flank, cutting inside past Kimmich!" 
            : "Balogun receives a crisp pass on the edge of the box and turns quickly!";
          break;
        case "GER_ATTACK":
          text = Math.random() > 0.5 
            ? "Florian Wirtz slices through midfield, searching for Kai Havertz." 
            : "Musiala dribbles beautifully near the box, drawing two USA defenders.";
          break;
        case "USA_SHOT":
          highlight = true;
          text = Math.random() > 0.5 
            ? "PULISIC SHOOTS! A cracking curling strike! ter Stegen makes a diving save!" 
            : "BALOGUN WITH THE SHOT! Smashed low toward the bottom corner! Corner kick conceded.";
          break;
        case "GER_SHOT":
          highlight = true;
          text = Math.random() > 0.5 
            ? "WIRTZ VOLLEYS! A powerful rocket from 20 yards out! Matt Turner tips it over the bar!" 
            : "HAVERTZ HEADER! Rises highest from the cross! It hits the side netting!";
          break;
        case "CORNER":
          text = "Corner kick whipped into the penalty area. Heavy physical jostling in the box.";
          break;
        case "MIDFIELD":
        default:
          text = Math.random() > 0.5 
            ? "Incredible battle for possession in midfield. Weston McKennie sliding tackle intercepts." 
            : "Germany rebuilding play from the back line with Rüdiger passing short.";
          break;
      }

      setCommentaryLogs(prev => [
        { time: timestamp, text, highlight },
        ...prev.slice(0, 15)
      ]);

    }, 4000); // Ticks every 4 seconds for immediate user feedback on visual positions

    return () => clearInterval(playInterval);
  }, [liveMatch.minute]);

  // Dynamic live game simulation ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatch((prev) => {
        if (prev.minute >= 90) {
          return {
            ...prev,
            minute: 90,
            status: "FINISHED" as const
          };
        }
        
        const nextMinute = prev.minute + 1;
        const updatedEvents = [...prev.events];
        let updatedHomeScore = prev.homeScore;
        let updatedAwayScore = prev.awayScore;
        const updatedStats = { ...prev.stats };

        // Chance of random statistics shifting
        if (Math.random() > 0.6) {
          const isHome = Math.random() > 0.5;
          if (isHome) {
            updatedStats.possession = [Math.min(90, prev.stats.possession[0] + 1), Math.max(10, prev.stats.possession[1] - 1)];
            updatedStats.shots = [prev.stats.shots[0] + (Math.random() > 0.8 ? 1 : 0), prev.stats.shots[1]];
          } else {
            updatedStats.possession = [Math.max(10, prev.stats.possession[0] - 1), Math.min(90, prev.stats.possession[1] + 1)];
            updatedStats.shots = [prev.stats.shots[0], prev.stats.shots[1] + (Math.random() > 0.8 ? 1 : 0)];
          }
        }

        // Random Goal or Yellow Card simulation
        if (nextMinute === 83 && prev.homeScore === 2) {
          // Simulate an away goal equalizer!
          updatedAwayScore += 1;
          updatedEvents.push({
            time: 83,
            team: "away",
            player: "K. Havertz",
            type: "goal"
          });
        } else if (nextMinute === 88 && Math.random() > 0.5) {
          updatedEvents.push({
            time: 88,
            team: "away",
            player: "J. Kimmich",
            type: "yellow"
          });
        }

        return {
          ...prev,
          minute: nextMinute,
          homeScore: updatedHomeScore,
          awayScore: updatedAwayScore,
          events: updatedEvents,
          stats: updatedStats
        };
      });
    }, 12000); // Ticks every 12 seconds for faster demo purposes

    return () => clearInterval(interval);
  }, []);

  const handleNextUpcoming = () => {
    setUpcomingIndex((prev) => (prev + 1) % UPCOMING_MATCHES.length);
  };

  const handlePrevUpcoming = () => {
    setUpcomingIndex((prev) => (prev - 1 + UPCOMING_MATCHES.length) % UPCOMING_MATCHES.length);
  };

  const currentUpcoming = UPCOMING_MATCHES[upcomingIndex];

  return (
    <div id="live-scores-bar-container" className="bg-slate-900 border border-slate-800 rounded-3xl text-white p-4.5 shadow-md mb-6 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left Side: Live Score Ticker */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0 pr-0 lg:pr-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-extrabold flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-rose-500" /> Live Match
            </span>
            <span className="text-[10px] font-mono bg-slate-800 border border-slate-750 text-slate-300 px-2 py-0.5 rounded-full font-bold ml-1">
              Minute {liveMatch.minute}'
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 md:mt-0">
            {/* Home Team */}
            <div className="flex items-center gap-2">
              <span className="text-xl" title={liveMatch.homeTeam}>{liveMatch.homeFlag}</span>
              <span className="font-sans font-black text-sm text-white tracking-wide">{liveMatch.homeCode}</span>
            </div>

            {/* Score */}
            <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-center flex items-center gap-1.5 font-mono shadow-inner">
              <span className="text-sm font-black text-white">{liveMatch.homeScore}</span>
              <span className="text-slate-600 text-[10px] font-black">:</span>
              <span className="text-sm font-black text-white">{liveMatch.awayScore}</span>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2">
              <span className="font-sans font-black text-sm text-white tracking-wide">{liveMatch.awayCode}</span>
              <span className="text-xl" title={liveMatch.awayTeam}>{liveMatch.awayFlag}</span>
            </div>

            {/* View Stats Trigger */}
            <button
              onClick={() => {
                setActiveTab("LIVE");
                setShowStatsModal(true);
              }}
              className="ml-auto md:ml-4 bg-slate-850 hover:bg-slate-750 border border-slate-750 text-slate-200 font-mono text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stats & Commentary</span>
            </button>

            {/* Spectate Trigger */}
            <button
              onClick={() => {
                setActiveTab("SPECTATE");
                setShowStatsModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white font-mono text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>📺 Spectate Live</span>
            </button>
          </div>
        </div>

        {/* Right Side: Upcoming Matches Slider */}
        <div className="flex-1 flex items-center justify-between gap-4 pl-0 lg:pl-6">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Upcoming Tournament Match
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-sm">{currentUpcoming.homeFlag}</span>
              <span className="font-bold text-slate-200">{currentUpcoming.homeCode}</span>
              <span className="text-slate-500 font-light">vs</span>
              <span className="font-bold text-slate-200">{currentUpcoming.awayCode}</span>
              <span className="text-sm">{currentUpcoming.awayFlag}</span>
              <span className="text-[10px] bg-slate-800 border border-slate-750 text-slate-400 px-2 py-0.5 rounded-full font-bold ml-2">
                {currentUpcoming.group}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {currentUpcoming.date} • {currentUpcoming.time} | <span className="text-[9px] text-slate-500 font-mono">{currentUpcoming.stadium.split(",")[0]}</span>
            </p>
          </div>

          {/* Slider buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevUpcoming}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer border border-slate-750"
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
            </button>
            <button
              onClick={handleNextUpcoming}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer border border-slate-750"
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Stats, Goals, & Commentary Modal Dialog Overlay */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-xl p-6 shadow-2xl relative space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-400" />
                <h3 className="font-sans font-black text-base text-white tracking-tight">World Cup Match Center</h3>
              </div>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-slate-400 hover:text-white font-mono font-bold text-lg leading-none p-1.5 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Scoreboard block */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 relative shadow-inner">
              <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                {liveMatch.status === "LIVE" ? `LIVE MATCH • MINUTE ${liveMatch.minute}'` : "MATCH FINISHED"}
              </div>
              
              <div className="flex items-center gap-6 justify-center">
                <div className="text-center">
                  <span className="text-3xl block mb-1">{liveMatch.homeFlag}</span>
                  <span className="font-sans font-black text-sm text-white tracking-wide">{liveMatch.homeTeam}</span>
                </div>

                <div className="text-3xl font-mono font-black text-indigo-400 px-4 py-1 bg-slate-900 border border-slate-800 rounded-xl">
                  {liveMatch.homeScore} : {liveMatch.awayScore}
                </div>

                <div className="text-center">
                  <span className="text-3xl block mb-1">{liveMatch.awayFlag}</span>
                  <span className="font-sans font-black text-sm text-white tracking-wide">{liveMatch.awayTeam}</span>
                </div>
              </div>
            </div>

            {/* Dynamic tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("LIVE")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === "LIVE" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("SPECTATE")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === "SPECTATE" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📺 Spectate Live
              </button>
              <button
                onClick={() => setActiveTab("UPCOMING")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === "UPCOMING" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab("STANDINGS")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  activeTab === "STANDINGS" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Standings
              </button>
            </div>

            {/* Tab content */}
            <div className={`${activeTab === "SPECTATE" ? "h-[365px]" : "h-56"} overflow-y-auto pr-1 transition-all duration-300`}>
              
              {activeTab === "SPECTATE" && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  {/* Interactive Toolbar (Camera Source and Crowd Volume indicator) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                      {[
                        { id: "radar", label: "Tactical Radar", icon: Target },
                        { id: "smart", label: "AURA AI Cam", icon: Camera },
                        { id: "fancam", label: "Acoustic Cam", icon: Volume2 }
                      ].map((cam) => {
                        const Icon = cam.icon;
                        return (
                          <button
                            key={cam.id}
                            onClick={() => setActiveCamera(cam.id as any)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                              activeCamera === cam.id
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cam.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 font-bold">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>CROWD:</span>
                        <span className="text-emerald-400 font-black">{crowdBuzz} dB</span>
                      </div>
                      <div className="w-14 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 hidden xs:block">
                        <div
                          style={{ width: `${Math.min(100, (crowdBuzz / 120) * 100)}%` }}
                          className={`h-full transition-all duration-300 ${
                            crowdBuzz > 90 ? "bg-rose-500" : crowdBuzz > 80 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE CAMERA VIEWPORT CONTAINER */}
                  <div className="relative">
                    
                    {/* 1. Tactical Radar View */}
                    {activeCamera === "radar" && (
                      <div className="relative w-full h-44 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center animate-[fadeIn_0.15s_ease-out]">
                        
                        {/* Decorative Grass Lines */}
                        <div className="absolute inset-0 grid grid-cols-10 opacity-[0.03] pointer-events-none">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`h-full ${i % 2 === 0 ? "bg-white" : "bg-transparent"}`}></div>
                          ))}
                        </div>

                        {/* Pitch Markings */}
                        <div className="absolute inset-3 border border-white/10 rounded-lg pointer-events-none"></div>
                        {/* Half-way line */}
                        <div className="absolute left-1/2 top-3 bottom-3 w-[1px] bg-white/10 pointer-events-none"></div>
                        {/* Center Circle */}
                        <div className="absolute w-12 h-12 rounded-full border border-white/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        
                        {/* Penalty boxes */}
                        <div className="absolute left-3 top-[25%] bottom-[25%] w-10 border border-white/10 border-l-0 pointer-events-none"></div>
                        <div className="absolute right-3 top-[25%] bottom-[25%] w-10 border border-white/10 border-r-0 pointer-events-none"></div>

                        {/* Goals */}
                        <div className="absolute -left-1 top-[40%] bottom-[40%] w-1.5 border border-white/25 rounded-l-md bg-slate-900/50 pointer-events-none"></div>
                        <div className="absolute -right-1 top-[40%] bottom-[40%] w-1.5 border border-white/25 rounded-r-md bg-slate-900/50 pointer-events-none"></div>

                        {/* Dynamic Nodes Mapping based on coordinates */}
                        {(() => {
                          const coords = getCoordinates(playState);
                          return (
                            <>
                              {/* Soccer Ball */}
                              <div
                                style={{ left: `${coords.ball.x}%`, top: `${coords.ball.y}%` }}
                                className="absolute w-3.5 h-3.5 bg-white text-[9px] rounded-full flex items-center justify-center shadow-md border border-slate-900 transition-all duration-700 ease-out z-30 -translate-x-1/2 -translate-y-1/2 animate-bounce"
                              >
                                ⚽
                              </div>

                              {/* USA Team Nodes (Blue) */}
                              {/* USA 1: Christian Pulisic */}
                              <div
                                style={{ left: `${coords.usa1.x}%`, top: `${coords.usa1.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-indigo-500/50 text-indigo-300 text-[7px] font-mono px-1 py-0.2 rounded scale-90 whitespace-nowrap">
                                  Pulisic (10)
                                </span>
                                <div className="w-4 h-4 bg-indigo-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white animate-[pulse_1.5s_infinite]">
                                  USA
                                </div>
                              </div>

                              {/* USA 2: Weston McKennie */}
                              <div
                                style={{ left: `${coords.usa2.x}%`, top: `${coords.usa2.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <div className="w-4 h-4 bg-indigo-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white">
                                  USA
                                </div>
                              </div>

                              {/* USA 3: Tim Ream */}
                              <div
                                style={{ left: `${coords.usa3.x}%`, top: `${coords.usa3.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <div className="w-4 h-4 bg-indigo-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white">
                                  USA
                                </div>
                              </div>

                              {/* GER Team Nodes (Red) */}
                              {/* GER 1: Florian Wirtz */}
                              <div
                                style={{ left: `${coords.ger1.x}%`, top: `${coords.ger1.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-rose-500/50 text-rose-300 text-[7px] font-mono px-1 py-0.2 rounded scale-90 whitespace-nowrap">
                                  Wirtz (17)
                                </span>
                                <div className="w-4 h-4 bg-rose-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white animate-[pulse_1.5s_infinite]">
                                  GER
                                </div>
                              </div>

                              {/* GER 2: Kai Havertz */}
                              <div
                                style={{ left: `${coords.ger2.x}%`, top: `${coords.ger2.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <div className="w-4 h-4 bg-rose-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white">
                                  GER
                                </div>
                              </div>

                              {/* GER 3: Antonio Rüdiger */}
                              <div
                                style={{ left: `${coords.ger3.x}%`, top: `${coords.ger3.y}%` }}
                                className="absolute transition-all duration-700 ease-out z-20 -translate-x-1/2 -translate-y-1/2"
                              >
                                <div className="w-4 h-4 bg-rose-600 border border-white rounded-full flex items-center justify-center shadow-lg font-mono text-[7px] font-black text-white">
                                  GER
                                </div>
                              </div>
                            </>
                          );
                        })()}

                        {/* Top corner play overlay status */}
                        <div className="absolute top-2 left-2 bg-slate-950/85 border border-slate-800 text-[8px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          FIELD: {playState.replace("_", " ")}
                        </div>

                        {/* Bottom corner coordinates indicators */}
                        <div className="absolute bottom-2 right-2 bg-slate-950/85 border border-slate-800 text-[7px] font-mono text-slate-500 px-2 py-0.5 rounded-md">
                          AURA AI RADAR CHIP V2
                        </div>
                      </div>
                    )}

                    {/* 2. AI Smart Telemetry Feed */}
                    {activeCamera === "smart" && (
                      <div className="w-full h-44 bg-slate-950 border border-slate-850 rounded-2xl p-3.5 flex flex-col justify-between font-mono text-[11px] text-indigo-400 shadow-inner animate-[fadeIn_0.15s_ease-out]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                            <span className="text-[9px] font-black text-indigo-300 flex items-center gap-1">
                              <Target className="w-3 h-3 text-indigo-500" /> AURA SMART-CAMERA TARGET LOCK
                            </span>
                            <span className="text-[8px] bg-indigo-950 border border-indigo-900 px-1.5 py-0.2 rounded text-emerald-400 font-bold">
                              TRACKING ENGAGED
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] py-1 text-slate-300">
                            <div><span className="text-slate-500">TARGET:</span> <span className="font-bold text-white">Christian Pulisic (USA)</span></div>
                            <div><span className="text-slate-500">SPEED:</span> <span className="font-bold text-indigo-300">31.4 km/h</span></div>
                            <div><span className="text-slate-500">STAMINA:</span> <span className="font-bold text-emerald-400">84.5%</span></div>
                            <div><span className="text-slate-500">SHOT PROBABILITY:</span> <span className="font-bold text-amber-400">42.8%</span></div>
                            <div><span className="text-slate-500">MAP SECTOR:</span> <span className="font-bold text-indigo-300">Attacking Flank Left (High)</span></div>
                            <div><span className="text-slate-500">ACCURACY:</span> <span className="font-bold text-white">91.2% Pass Rate</span></div>
                          </div>
                        </div>

                        <div className="bg-indigo-950/40 border border-indigo-900/60 p-2 rounded-xl text-[9px] text-indigo-200 leading-normal">
                          <span className="font-bold text-indigo-400 block uppercase mb-0.5 text-[8px]">Tactical Commentary:</span>
                          "Pulisic has consistently exploited space behind Germany's high defensive line. Heatmap shows significant traffic on the left wing."
                        </div>
                      </div>
                    )}

                    {/* 3. Fan Acoustic Excitement Sound Meter */}
                    {activeCamera === "fancam" && (
                      <div className="w-full h-44 bg-slate-950 border border-slate-850 rounded-2xl p-3.5 flex flex-col justify-between font-mono text-[11px] shadow-inner animate-[fadeIn_0.15s_ease-out]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-1 text-slate-300">
                            <span className="text-[9px] font-black text-rose-400 flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-rose-500" /> STADIUM ACOUSTIC ANALYZER
                            </span>
                            <span className="text-[8px] text-slate-500">SECTOR 112 BROADCAST MIC</span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 py-1 text-center">
                            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                              <span className="block text-[7px] text-slate-500 uppercase font-black">Excitement</span>
                              <span className="text-xs font-black text-white">94%</span>
                            </div>
                            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                              <span className="block text-[7px] text-slate-500 uppercase font-black">Decibels</span>
                              <span className="text-xs font-black text-emerald-400">{crowdBuzz} dB</span>
                            </div>
                            <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                              <span className="block text-[7px] text-slate-500 uppercase font-black">Wave Status</span>
                              <span className="text-xs font-black text-indigo-400">ACTIVE</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Cheering Station */}
                        <div className="border-t border-slate-900 pt-2 flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[8px] text-slate-500 font-bold block uppercase">Cheer Station:</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setUsaCheers(p => p + 1);
                                setCrowdBuzz(108);
                                setCommentaryLogs(prev => [
                                  { time: `${liveMatch.minute}:Cheer`, text: "🎉 Fan cheered for USA! Matt Turner raises hands, crowd goes wild!", highlight: true },
                                  ...prev
                                ]);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] px-2 py-1 rounded transition-all active:scale-95 flex items-center gap-0.5 shadow-sm border border-indigo-500/20"
                            >
                              🇺🇸 USA ({usaCheers})
                            </button>
                            <button
                              onClick={() => {
                                setGerCheers(p => p + 1);
                                setCrowdBuzz(104);
                                setCommentaryLogs(prev => [
                                  { time: `${liveMatch.minute}:Cheer`, text: "🎉 Fan cheered for Germany! Fans wave flags, drums beating loudly!", highlight: true },
                                  ...prev
                                ]);
                              }}
                              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[9px] px-2 py-1 rounded transition-all active:scale-95 flex items-center gap-0.5 shadow-sm border border-rose-500/20"
                            >
                              🇩🇪 GER ({gerCheers})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* LIVE REAL-TIME SPECTATOR LOGS */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Live Spectator Feed</span>
                    <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-3 max-h-24 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 divide-y divide-slate-900 shadow-inner">
                      {commentaryLogs.map((log, idx) => (
                        <div key={idx} className={`pt-1 flex items-start gap-1.5 ${idx === 0 ? "text-white" : "text-slate-400"}`}>
                          <span className="text-indigo-400 font-bold shrink-0">[{log.time}]</span>
                          <span className={log.highlight ? "text-emerald-400 font-bold" : ""}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "LIVE" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Match Events & Goals</span>
                  <div className="space-y-2 border-l border-slate-850 ml-3 pl-4 relative">
                    {liveMatch.events.slice().reverse().map((ev, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 relative">
                        {/* Dot */}
                        <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                          ev.type === "goal" ? "bg-emerald-500" : "bg-amber-500"
                        }`}></div>
                        
                        <span className="font-mono text-indigo-400 font-bold text-[10px] shrink-0 w-8">{ev.time}'</span>
                        <div className="flex items-center gap-1.5">
                          <span>{ev.type === "goal" ? "⚽ Goal!" : "🟨 Yellow Card"}</span>
                          <span className="font-bold text-white">{ev.player}</span>
                          <span className="text-[10px] text-slate-500">({ev.team === "home" ? liveMatch.homeCode : liveMatch.awayCode})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "UPCOMING" && (
                <div className="space-y-3.5 font-mono text-xs">
                  <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Live Team Metrics</span>
                  
                  {/* Possession */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{liveMatch.homeCode} ({liveMatch.stats.possession[0]}%)</span>
                      <span>Possession</span>
                      <span>{liveMatch.awayCode} ({liveMatch.stats.possession[1]}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden">
                      <div style={{ width: `${liveMatch.stats.possession[0]}%` }} className="bg-indigo-600 h-full transition-all"></div>
                      <div style={{ width: `${liveMatch.stats.possession[1]}%` }} className="bg-emerald-600 h-full transition-all"></div>
                    </div>
                  </div>

                  {/* Shots */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{liveMatch.stats.shots[0]}</span>
                      <span>Total Shots</span>
                      <span>{liveMatch.stats.shots[1]}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden">
                      <div style={{ width: `${(liveMatch.stats.shots[0] / (liveMatch.stats.shots[0] + liveMatch.stats.shots[1])) * 100}%` }} className="bg-indigo-600 h-full"></div>
                      <div style={{ width: `${(liveMatch.stats.shots[1] / (liveMatch.stats.shots[0] + liveMatch.stats.shots[1])) * 100}%` }} className="bg-emerald-600 h-full"></div>
                    </div>
                  </div>

                  {/* Fouls */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{liveMatch.stats.fouls[0]}</span>
                      <span>Fouls Committed</span>
                      <span>{liveMatch.stats.fouls[1]}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden">
                      <div style={{ width: `${(liveMatch.stats.fouls[0] / (liveMatch.stats.fouls[0] + liveMatch.stats.fouls[1])) * 100}%` }} className="bg-indigo-600 h-full"></div>
                      <div style={{ width: `${(liveMatch.stats.fouls[1] / (liveMatch.stats.fouls[0] + liveMatch.stats.fouls[1])) * 100}%` }} className="bg-emerald-600 h-full"></div>
                    </div>
                  </div>

                  {/* Corners */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{liveMatch.stats.corners[0]}</span>
                      <span>Corner Kicks</span>
                      <span>{liveMatch.stats.corners[1]}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden">
                      <div style={{ width: `${(liveMatch.stats.corners[0] / (liveMatch.stats.corners[0] + liveMatch.stats.corners[1])) * 100}%` }} className="bg-indigo-600 h-full"></div>
                      <div style={{ width: `${(liveMatch.stats.corners[1] / (liveMatch.stats.corners[0] + liveMatch.stats.corners[1])) * 100}%` }} className="bg-emerald-600 h-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "STANDINGS" && (
                <div className="space-y-3 text-xs">
                  <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Group B Standings (Live)</span>
                  <div className="border border-slate-800 rounded-xl overflow-hidden font-mono">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] font-bold">
                          <th className="p-2">Pos</th>
                          <th className="p-2">Team</th>
                          <th className="p-2 text-center">P</th>
                          <th className="p-2 text-center">W</th>
                          <th className="p-2 text-center">GD</th>
                          <th className="p-2 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        <tr className="bg-indigo-900/10 text-white">
                          <td className="p-2 font-black">1</td>
                          <td className="p-2 flex items-center gap-1.5 font-bold">🇺🇸 United States</td>
                          <td className="p-2 text-center font-semibold">3</td>
                          <td className="p-2 text-center">2</td>
                          <td className="p-2 text-center text-emerald-400">+3</td>
                          <td className="p-2 text-center font-black text-indigo-400">7</td>
                        </tr>
                        <tr className="text-slate-200">
                          <td className="p-2">2</td>
                          <td className="p-2 flex items-center gap-1.5 font-semibold">🇩🇪 Germany</td>
                          <td className="p-2 text-center">3</td>
                          <td className="p-2 text-center">1</td>
                          <td className="p-2 text-center text-emerald-400">+1</td>
                          <td className="p-2 text-center">4</td>
                        </tr>
                        <tr className="text-slate-400">
                          <td className="p-2 text-slate-500">3</td>
                          <td className="p-2 flex items-center gap-1.5">🇨🇲 Cameroon</td>
                          <td className="p-2 text-center">2</td>
                          <td className="p-2 text-center">1</td>
                          <td className="p-2 text-center text-rose-400">-1</td>
                          <td className="p-2 text-center">3</td>
                        </tr>
                        <tr className="text-slate-400">
                          <td className="p-2 text-slate-500">4</td>
                          <td className="p-2 flex items-center gap-1.5">🇦🇺 Australia</td>
                          <td className="p-2 text-center">2</td>
                          <td className="p-2 text-center">0</td>
                          <td className="p-2 text-center text-rose-400">-3</td>
                          <td className="p-2 text-center">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-500">
              <span className="font-mono">AURA Broadcaster Service v1.2</span>
              <button
                onClick={() => setShowStatsModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Close Match Center
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
