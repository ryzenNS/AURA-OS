import React, { useState } from "react";
import { 
  Search, 
  HelpCircle, 
  Tv, 
  Flame, 
  Sparkles, 
  Shuffle, 
  Award,
  CheckCircle,
  XCircle,
  BookOpen
} from "lucide-react";

interface MatchCompanionProps {
  onAskAura: (prompt: string) => void;
}

interface Player {
  number: number;
  name: string;
  pos: string;
  x: string; // Tailwind left percentage
  y: string; // Tailwind top percentage
}

export const MatchCompanion: React.FC<MatchCompanionProps> = ({
  onAskAura,
}) => {
  const [ruleQuery, setRuleQuery] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("Argentina");
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<"unanswered" | "correct" | "incorrect">("unanswered");

  // Mock players in 4-3-3 formation
  const argentinePlayers: Player[] = [
    { number: 23, name: "Martinez", pos: "GK", x: "left-[5%]", y: "top-[48%]" },
    { number: 26, name: "Molina", pos: "RB", x: "left-[22%]", y: "top-[15%]" },
    { number: 13, name: "Romero", pos: "CB", x: "left-[20%]", y: "top-[38%]" },
    { number: 19, name: "Otamendi", pos: "CB", x: "left-[20%]", y: "top-[62%]" },
    { number: 3, name: "Tagliafico", pos: "LB", x: "left-[22%]", y: "top-[82%]" },
    { number: 7, name: "De Paul", pos: "RCM", x: "left-[45%]", y: "top-[25%]" },
    { number: 24, name: "Fernandez", pos: "DM", x: "left-[42%]", y: "top-[50%]" },
    { number: 20, name: "Mac Allister", pos: "LCM", x: "left-[45%]", y: "top-[75%]" },
    { number: 10, name: "Messi", pos: "RW", x: "left-[75%]", y: "top-[20%]" },
    { number: 9, name: "Alvarez", pos: "ST", x: "left-[78%]", y: "top-[50%]" },
    { number: 15, name: "Gonzalez", pos: "LW", x: "left-[75%]", y: "top-[80%]" },
  ];

  const triviaQuestions = [
    {
      question: "Which nation won the inaugural FIFA World Cup in 1930?",
      options: ["Argentina", "Uruguay", "Brazil", "Italy"],
      correctIndex: 1,
      fact: "Uruguay defeated Argentina 4-2 in Montevideo to win the first-ever World Cup."
    },
    {
      question: "Who is the all-time leading goal scorer in FIFA World Cup history?",
      options: ["Marta", "Miroslav Klose", "Pelé", "Cristiano Ronaldo"],
      correctIndex: 1,
      fact: "Miroslav Klose (Germany) has scored 16 goals across four World Cup tournaments."
    },
    {
      question: "How many host cities are selected for the FIFA World Cup 2026?",
      options: ["10", "12", "16", "20"],
      correctIndex: 2,
      fact: "The tournament will be hosted across 16 cities in Canada, Mexico, and the United States."
    }
  ];

  const handleRuleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleQuery.trim()) return;
    onAskAura(`Explain the official FIFA rule or regulations regarding: ${ruleQuery}. Keep it extremely precise and reference standard VAR protocols.`);
  };

  const handleAnswerQuiz = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === triviaQuestions[activeQuizIndex].correctIndex) {
      setQuizStatus("correct");
    } else {
      setQuizStatus("incorrect");
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizStatus("unanswered");
    setActiveQuizIndex((prev) => (prev + 1) % triviaQuestions.length);
  };

  return (
    <div id="match-companion-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Tactical Formations Board (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="font-sans font-black text-slate-800 text-base tracking-tight flex items-center gap-1.5">
              ⚽ Live Tactical Field Sheet
            </h3>
            <p className="text-xs text-slate-400 font-mono">Dynamic formation maps & visual lineups</p>
          </div>
          
          <select
            value={favoriteTeam}
            onChange={(e) => setFavoriteTeam(e.target.value)}
            className="bg-slate-50 border border-gray-200 text-xs rounded-xl px-2.5 py-1.5 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer text-slate-800"
          >
            <option value="Argentina">Argentina (4-3-3)</option>
            <option value="France">France (4-2-3-1)</option>
          </select>
        </div>

        {/* Tactical Pitch Layout Graphic */}
        <div className="bg-emerald-800 rounded-2xl p-4 aspect-[4/3] relative overflow-hidden border-4 border-slate-900 shadow-inner flex flex-col justify-between">
          {/* Pitch Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          
          {/* Halfway line */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/30"></div>
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white/30 -translate-x-1/2 -translate-y-1/2"></div>
          {/* Penalty box left */}
          <div className="absolute inset-y-[20%] left-0 w-[18%] border-r-2 border-y-2 border-white/30"></div>
          {/* Penalty box right */}
          <div className="absolute inset-y-[20%] right-0 w-[18%] border-l-2 border-y-2 border-white/30"></div>

          {/* Render Player Markers */}
          <div className="absolute inset-0 z-10">
            {argentinePlayers.map((p) => (
              <div 
                key={p.number} 
                className={`absolute ${p.x} ${p.y} -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none group cursor-pointer`}
                onClick={() => onAskAura(`Give me high-level tactical player stats, active goals record, and pass maps for ${p.name} in today's fixture.`)}
              >
                {/* Jersey bubble icon */}
                <div className="w-8 h-8 rounded-full bg-white/95 border-2 border-sky-400 text-slate-900 font-mono font-black text-[11px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  {p.number}
                </div>
                <span className="bg-slate-900/80 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded-md mt-1 scale-90 tracking-tight whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Watermark/Attribution */}
          <div className="relative z-0 mt-auto text-center text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest select-none">
            Tactical Analysis • Tap player to view stats
          </div>
        </div>
      </div>

      {/* Right Column: Rule Lookup & Trivia (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Rules Search Index Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight">
                AURA Smart Rulebook Lookup
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Ask complex regulations & tournament bylaws</p>
            </div>
          </div>

          <form onSubmit={handleRuleSearch} className="relative">
            <input
              type="text"
              placeholder="Is offside VAR-reviewed?"
              value={ruleQuery}
              onChange={(e) => setRuleQuery(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-1 flex flex-wrap gap-1.5">
            {["Offside VAR Rules", "Yellow Card Accumulation", "Handball penalty details"].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setRuleQuery(tag);
                  onAskAura(`Give me the official FIFA guidelines on: ${tag}.`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trivia Interactive Quiz Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
            <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-600 animate-bounce" />
              FIFA World Cup Fan Trivia
            </h4>
            <span className="font-mono text-[10px] font-bold text-slate-400">
              Q{activeQuizIndex + 1} of {triviaQuestions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <p className="text-xs font-black text-slate-800 leading-relaxed">
              {triviaQuestions[activeQuizIndex].question}
            </p>

            <div className="space-y-2">
              {triviaQuestions[activeQuizIndex].options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === oIdx;
                const isCorrectOpt = oIdx === triviaQuestions[activeQuizIndex].correctIndex;
                let optStyles = "bg-slate-50 border-gray-200 text-slate-700 hover:bg-slate-100";

                if (selectedAnswer !== null) {
                  if (isSelected) {
                    optStyles = isCorrectOpt 
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                      : "bg-rose-50 border-rose-300 text-rose-800";
                  } else if (isCorrectOpt) {
                    optStyles = "bg-emerald-50 border-emerald-300 text-emerald-800";
                  } else {
                    optStyles = "bg-slate-50 border-gray-150 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswerQuiz(oIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      selectedAnswer === null ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
                    } ${optStyles}`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && isCorrectOpt && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {selectedAnswer !== null && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {/* Fact Overlay if Answered */}
            {selectedAnswer !== null && (
              <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
                <span className="text-[10px] font-mono font-black text-indigo-700 uppercase block">💡 Tournament Fact</span>
                <p className="text-[11px] text-indigo-800 leading-normal font-semibold">
                  {triviaQuestions[activeQuizIndex].fact}
                </p>
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] py-2 rounded-xl transition-all mt-1 cursor-pointer"
                >
                  Next Quiz Question
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
