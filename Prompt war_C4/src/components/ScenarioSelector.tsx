import React, { useState } from "react";
import { DemonstrationScenario } from "../types";
import { User, HeartHandshake, Shield, Sparkles } from "lucide-react";

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: DemonstrationScenario) => void;
  activeCategory: "fan" | "volunteer" | "command";
}

const DEMO_SCENARIOS: DemonstrationScenario[] = [
  // FANS
  {
    id: "scen-1",
    title: "Late for Kickoff",
    description: "Suggest fast tracks and optimal entrance strategies to reach seats immediately.",
    category: "fan",
    query: "I'm late for kickoff. Guide me to the fastest route to my seat."
  },
  {
    id: "scen-2",
    title: "Gate Ingress Advice",
    description: "Determine the best gate to enter based on current live gate queue counts.",
    category: "fan",
    query: "Which gate should I use right now to enter the stadium with the shortest delay?"
  },
  {
    id: "scen-3",
    title: "Overwhelmed Child",
    description: "Locate sensory-friendly quiet rooms and low-density pathways for relief.",
    category: "fan",
    query: "My child is overwhelmed by the loud crowd. What sensory-friendly spaces or quiet zones are near, and how do I get there?"
  },
  {
    id: "scen-4",
    title: "Wheelchair Accessibility",
    description: "Plan a step-free journey utilizing dedicated elevators and ramps.",
    category: "fan",
    query: "I use a wheelchair. Recommend step-free accessible routes, elevators, and accessible services."
  },
  {
    id: "scen-5",
    title: "Multilingual Assistance",
    description: "Request help in native languages for non-English speakers.",
    category: "fan",
    query: "I don't speak English. Help me find my way around and provide assistance in Spanish and Portuguese."
  },

  // VOLUNTEERS
  {
    id: "scen-6",
    title: "Medical Emergency",
    description: "Coordinate immediate first aid deployment near Section 117.",
    category: "volunteer",
    query: "A medical emergency occurs near Section 117. What are the immediate response steps for volunteers, and where is the nearest medical team?"
  },
  {
    id: "scen-7",
    title: "Weather Action Plan",
    description: "Manage sudden rain start, poncho distribution, and safe shelter areas.",
    category: "volunteer",
    query: "Heavy rain starts. Guide the volunteer team on shelter routing, poncho distribution, and wet surface safety protocols."
  },
  {
    id: "scen-8",
    title: "Metro Delay Response",
    description: "Coordinate fan holding areas and shuttle redirects when trains fail.",
    category: "volunteer",
    query: "Metro services stop. Generate crowd control and alternative transportation guidance for stranded fans."
  },
  {
    id: "scen-9",
    title: "Gate C Incident",
    description: "Reroute crowds and post clear signage when Gate C shuts down unexpectedly.",
    category: "volunteer",
    query: "Gate C closes unexpectedly due to a security incident. Generate volunteer instructions for active crowd redirection."
  },
  {
    id: "scen-10",
    title: "Multilingual Alert",
    description: "Generate emergency announcements in English, Spanish, French, and Portuguese.",
    category: "volunteer",
    query: "Generate a multilingual emergency announcement for a minor corridor delay in English, Spanish, French, and Portuguese."
  },

  // COMMAND CENTER
  {
    id: "scen-11",
    title: "Stadium Evacuation",
    description: "Run a full-scale AI evacuation simulation and estimate timeline impact.",
    category: "command",
    query: "Simulate stadium evacuation due to an extreme weather event. Generate predicted timeline, crowd distribution, and recovery plans."
  },
  {
    id: "scen-12",
    title: "30-Min Crowd Forecast",
    description: "Predict gate bottleneck risks and traffic density for the next 30 minutes.",
    category: "command",
    query: "Predict crowd conditions and gate congestion for the next 30 minutes using current weather and transit delay telemetry."
  },
  {
    id: "scen-13",
    title: "Volunteer Deployment",
    description: "Optimize staffing locations to absorb gate overload dynamically.",
    category: "command",
    query: "Recommend optimal volunteer deployment numbers and tactical stations to assist with the congestion at Gate B."
  },
  {
    id: "scen-14",
    title: "Sustainability Audit",
    description: "Formulate waste-reduction, water conservation, and eco-transit improvements.",
    category: "command",
    query: "Suggest sustainable operational improvements for energy conservation and zero-waste initiatives during tournament matchday."
  },
  {
    id: "scen-15",
    title: "Management Briefing",
    description: "Generate an executive dashboard summary of stadium safety and metrics.",
    category: "command",
    query: "Create an executive summary report for stadium management summarizing current gate delays, transport impacts, and safety index."
  }
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onSelectScenario,
  activeCategory,
}) => {
  const filtered = DEMO_SCENARIOS.filter((s) => s.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "fan":
        return <User className="w-4 h-4 text-indigo-600" />;
      case "volunteer":
        return <HeartHandshake className="w-4 h-4 text-rose-600" />;
      default:
        return <Shield className="w-4 h-4 text-slate-700" />;
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "fan":
        return "bg-indigo-50/40 hover:bg-indigo-50 border-indigo-100/60 hover:border-indigo-300 text-slate-800";
      case "volunteer":
        return "bg-rose-50/40 hover:bg-rose-50 border-rose-100/60 hover:border-rose-300 text-slate-800";
      default:
        return "bg-slate-50/60 hover:bg-slate-100 border-gray-200 hover:border-gray-350 text-slate-800";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
          Operational Scenario Drilldowns
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {filtered.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            id={`demo-scenario-btn-${scenario.id}`}
            className={`text-left p-3 rounded-xl border ${getCategoryTheme(
              scenario.category
            )} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between h-[120px] shadow-sm`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 border-b border-gray-100/60 pb-1.5">
                {getCategoryIcon(scenario.category)}
                <h4 className="font-sans font-bold text-xs text-slate-800 truncate">
                  {scenario.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-3 leading-snug font-medium">
                {scenario.description}
              </p>
            </div>
            
            <div className="flex justify-end mt-1">
              <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors">
                Simulate Query &rarr;
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
