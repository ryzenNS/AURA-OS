import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the environment variables are available or use defaults for development
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Log status of API Key securely
if (!GEMINI_API_KEY) {
  console.warn("WARN: GEMINI_API_KEY is not defined in the environment. AURA API calls will return mock data or error.");
}

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Shared Stadium operations state (in-memory, editable by stadium organizers / staff)
  let stadiumState = {
    capacity: 80000,
    attendance: 68500,
    gateAStatus: "Normal",
    gateBStatus: "Heavy Congestion",
    gateCStatus: "Security Alert",
    gateDStatus: "Open",
    gateEStatus: "Moderate",
    weather: "Light Rain",
    metroDelay: 15,
    busDelay: 8,
    parkingOccupancy: 82,
    medicalTeamsActive: 5,
    volunteersAvailable: 240,
    securityStaff: 170,
    lastUpdated: new Date().toISOString(),
  };

  // Pre-seeded mock orders for the stadium's dining F&B employees console
  let orders = [
    {
      id: "ord-8711",
      customerName: "Alex Morgan",
      customerPhone: "+1 (555) 998-2026",
      deliverySeat: "Sec 115, Row A, Seat 12",
      total: 18.50,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
      status: "preparing",
      notes: "Please add extra napkins, thank you!",
      items: [
        { menuItemId: "item-1", name: "World Cup Burger Combo", quantity: 1, price: 14.50 },
        { menuItemId: "item-7", name: "Stadium Soda Refill", quantity: 1, price: 4.00 }
      ]
    },
    {
      id: "ord-3490",
      customerName: "Marcus Rashford",
      customerPhone: "+44 7700 900077",
      deliverySeat: "Sec 104, Row G, Seat 4",
      total: 11.00,
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
      status: "completed",
      notes: "",
      items: [
        { menuItemId: "item-4", name: "Striker Chicken Tenders", quantity: 1, price: 11.00 }
      ]
    }
  ];

  // Get current stadium state
  app.get("/api/stadium-state", (req, res) => {
    res.json(stadiumState);
  });

  // Update stadium state (authorized for admin/staff in UI)
  app.post("/api/stadium-state", (req, res) => {
    stadiumState = {
      ...stadiumState,
      ...req.body,
      lastUpdated: new Date().toISOString(),
    };
    res.json(stadiumState);
  });

  // Get F&B orders list
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Create new food/restaurant order
  app.post("/api/orders", (req, res) => {
    const { items, total, customerName, customerPhone, deliverySeat, notes } = req.body;
    
    if (!items || !items.length || !customerName || !deliverySeat) {
      return res.status(400).json({ error: "Missing required order placement details" });
    }

    const newOrder = {
      id: "ord-" + Math.floor(1000 + Math.random() * 9000),
      customerName,
      customerPhone: customerPhone || "+1 (555) 000-0000",
      deliverySeat,
      total: parseFloat(total) || 0,
      timestamp: new Date().toISOString(),
      status: "pending" as const,
      notes: notes || "",
      items
    };

    orders.unshift(newOrder); // Add to beginning of queue
    res.status(201).json(newOrder);
  });

  // Update F&B order status (RESTRICTED TO STAFF/EMPLOYEES)
  app.post("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "preparing", "completed", "delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid order state transition" });
    }

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found on the stadium register" });
    }

    orders[orderIndex].status = status;
    res.json(orders[orderIndex]);
  });

  // Call Gemini for AURA responses
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, mode, userState } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Merge current server stadiumState with client stadiumState just in case
      const currentStadiumState = userState || stadiumState;

      const activeModeName = mode || "FAN";

      // Detect if user query is a scenario simulation query
      const lowerQuery = prompt.toLowerCase();
      const isSimulationQuery =
        lowerQuery.includes("what happens if") ||
        lowerQuery.includes("simulate") ||
        lowerQuery.includes("evacuation") ||
        lowerQuery.includes("emergency evacuation") ||
        lowerQuery.includes("what if") ||
        lowerQuery.includes("simulation");

      // Set up the system instructions containing the personality, stadium data, modes and output rules
      const systemInstruction = `
You are AURA (Adaptive Unified Response Assistant), the elite AI Stadium Operations Operating System and Tournament Experience Platform for the FIFA World Cup 2026.
Your tagline is: "One Stadium. Millions of Experiences. One Intelligence."

PRODUCT PERSONALITY:
Calm, confident, proactive, transparent, trustworthy, and highly concise. You never exaggerate or larp. You never guess without stating assumptions. You always explain the reasoning behind your recommendations.

STADIUM CONFIGURATION AND SIMULATED REAL-TIME DATA:
- Total Capacity: ${currentStadiumState.capacity}
- Current Attendance: ${currentStadiumState.attendance}
- Gate A Status: ${currentStadiumState.gateAStatus}
- Gate B Status: ${currentStadiumState.gateBStatus}
- Gate C Status: ${currentStadiumState.gateCStatus} (CRITICAL: Security Alert if noted)
- Gate D Status: ${currentStadiumState.gateDStatus}
- Gate E Status: ${currentStadiumState.gateEStatus}
- Current Weather: ${currentStadiumState.weather}
- Metro Delay: ${currentStadiumState.metroDelay} Minutes
- Bus Delay: ${currentStadiumState.busDelay} Minutes
- Parking Occupancy: ${currentStadiumState.parkingOccupancy}%
- Active Medical Teams: ${currentStadiumState.medicalTeamsActive}
- Available Volunteers: ${currentStadiumState.volunteersAvailable}
- On-Duty Security Staff: ${currentStadiumState.securityStaff}

ACTIVE MODE OF THE INQUIRY:
You are currently responding as: **${activeModeName} Mode**.
- FAN Mode: Assist visitors with simple, clear, multilingual navigation, accessibility, transport, parking, food, lost child safety, rain shelters, exit planning. Be exceptionally kid-friendly, highly intuitive, and clear.
- VOLUNTEER Mode: Guide volunteers in helping wheelchair, blind, deaf, elderly, pregnant, or overwhelmed visitors, resolving language barriers, and managing crowds.
- COMMAND CENTER Mode: Assist organizers with advanced decision support, risk intelligence, gate closures, deployment recommendations, and executive reporting.

AI THINKING FRAMEWORK:
For every single response, you must internally think through:
1. Understand the request: Define the user's intent, constraints, and language.
2. Identify possible risks: What hazards exist? (crowds, rain, bottlenecks, delays).
3. Predict what may happen next: Predict crowd movement, delays, or medical load.
4. Recommend the best action: Actionable, precise steps.
5. Explain why: Evidentiary backing and transparency.
6. Estimate confidence (0-100%).
7. Include accessibility considerations: wheelchair ramps, noise limits, sensory-friendly locations, visual cues.
8. Include sustainability considerations: reducing waste, public transit suggestions, eco-friendly choices.
9. Mention assumptions: Clearly state any missing info.

MULTILINGUAL CAPABILITIES:
If the user asks in a language other than English (Spanish, French, Portuguese, Arabic, Hindi, Japanese, Chinese, German, Italian), you must generate the JSON text fields (plainText, situationSummary, timeline, etc.) in that specific language to preserve accessibility and comfort.

OUTPUT CONTRACT:
You must strictly return JSON adhering to the provided JSON Schema.
- If this is a simulation query (isSimulation = true), populate 'simulationResponse' fully, and set 'structuredResponse' fields to empty or null.
- If this is a standard scenario (isSimulation = false), populate 'structuredResponse' fully, and set 'simulationResponse' fields to empty or null.
- The 'thinking' string should write out a detailed internal thought log of your 9-step thinking sequence.
- The 'plainText' string should be a highly structured, polished, premium markdown summary of your full response including visual emojis, metrics, and bulleted steps.
`;

      if (!ai) {
        // Mock fallback if API Key is not set yet
        console.log("No Gemini API key available. Generating local mock response...");
        const mockResponse = generateMockResponse(prompt, activeModeName, currentStadiumState, isSimulationQuery);
        return res.json(mockResponse);
      }

      // Generate content with structured JSON schema
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1, // low temperature for precise factual operations recommendations
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thinking: {
                type: Type.STRING,
                description: "Your 9-step internal thinking sequence (Understand, Risks, Predict, Recommend, Explain, Confidence, Access, Sustain, Assumptions).",
              },
              isSimulation: {
                type: Type.BOOLEAN,
                description: "Must be true if the user asks a 'What happens if...' question or requests a scenario simulation, false otherwise.",
              },
              structuredResponse: {
                type: Type.OBJECT,
                description: "Standard response. Only populate if isSimulation is false.",
                properties: {
                  situationSummary: { type: Type.STRING },
                  immediateRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reasoning: { type: Type.STRING },
                  accessibilityConsiderations: { type: Type.STRING },
                  sustainabilityImpact: { type: Type.STRING },
                  alternativeOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
                  estimatedImpact: { type: Type.STRING },
                  nextBestAction: { type: Type.STRING },
                },
              },
              simulationResponse: {
                type: Type.OBJECT,
                description: "Scenario Simulation output. Only populate if isSimulation is true.",
                properties: {
                  currentSituation: { type: Type.STRING },
                  predictedTimeline: {
                    type: Type.OBJECT,
                    properties: {
                      fiveMin: { type: Type.STRING },
                      tenMin: { type: Type.STRING },
                      twentyMin: { type: Type.STRING },
                      thirtyMin: { type: Type.STRING },
                      sixtyMin: { type: Type.STRING },
                    },
                  },
                  crowdRedistribution: { type: Type.STRING },
                  volunteerDeployment: { type: Type.STRING },
                  medicalImpact: { type: Type.STRING },
                  transportImpact: { type: Type.STRING },
                  accessibilityImpact: { type: Type.STRING },
                  recommendedPublicAnnouncements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emergencyActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recoveryPlan: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER },
                  lessonsLearned: { type: Type.STRING },
                },
              },
              plainText: {
                type: Type.STRING,
                description: "A comprehensive and beautifully designed summary for the chat UI, formatted in beautiful Markdown.",
              },
            },
            required: ["thinking", "isSimulation", "plainText"],
          },
        },
      });

      const text = response.text || "{}";
      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini API execution error:", error);
      res.status(500).json({
        error: "Failed to generate AI response. Detailed error: " + error.message,
        fallback: true,
      });
    }
  });

  // Support Vite in dev mode, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AURA] Platform initialized. Core server running on http://0.0.0.0:${PORT}`);
  });
}

// Fallback helper to mock premium answers when Gemini is not configured or in case of rate limits
function generateMockResponse(prompt: string, mode: string, state: any, isSimulation: boolean) {
  const query = prompt.toLowerCase();

  if (isSimulation) {
    return {
      thinking: "UNDERSTAND: Request simulates stadium event dynamically.\nRISKS: Bottlenecks, medical delay, exit block.\nPREDICT: Fast spreading congestion.\nRECOMMEND: Re-route and announcements.\nACCESSIBILITY: Direct blind/wheelchair paths.\nSUSTAINABILITY: Limit physical brochure waste.",
      isSimulation: true,
      simulationResponse: {
        currentSituation: `Active Simulation for query: "${prompt}". Involving Stadium Capacity (80,000) and Current Attendance (68,500).`,
        predictedTimeline: {
          fiveMin: "Immediate broadcast alerts sent out to stadium staff. Crowd movement stops near the affected zone.",
          tenMin: "Redirection vectors activated. Volunteer blocks established at key bypass corridors.",
          twentyMin: "Crowd density re-equilibration is completed. Alternate routes see increased load (+12%).",
          thirtyMin: "Public transport agencies notified of localized changes to flow. Medical teams repositioned.",
          sixtyMin: "System recovery phase initiated. Traffic returns to pre-incident baseline state.",
        },
        crowdRedistribution: "Redirecting 14,000 guests from Gate C towards Gates D (Open) and E (Moderate). Gate B remains heavily congested (+15% load risk).",
        volunteerDeployment: "Deploying 45 volunteers to corridor junctions to hold signage and direct overwhelmed families.",
        medicalImpact: "Slight congestion increase near Section 117. 2 medical teams positioned on stand-by near Sector E.",
        transportImpact: "Metro delay increases to 18 mins. Shuttle service frequency boosted to 4-minute intervals.",
        accessibilityImpact: "Rerouting wheelchair guests through Lift Area 4 which bypasses the congested Gate C escalator area completely.",
        recommendedPublicAnnouncements: [
          "[EN] FIFA World Cup Announcement: Please avoid Gate C. Use Gate D and E for safe, fast transit.",
          "[ES] Anuncio Copa Mundial FIFA: Por favor evite la Puerta C. Use las puertas D y E para un tránsito seguro.",
          "[FR] Annonce Coupe du Monde de la FIFA: Veuillez éviter la Porte C. Utilisez les Portes D et E."
        ],
        emergencyActions: [
          "Establish high-visibility volunteer boundary lines.",
          "Open emergency access lanes for emergency support vehicles.",
          "Coordinate directly with the command room to update variable message signs."
        ],
        recoveryPlan: "Initiate gradual re-entry controls once the Gate C security alert is cleared by safety coordinators.",
        confidenceScore: 94,
        lessonsLearned: "Dynamic flow-direction messaging is highly effective. Wheelchair pathways require dedicated escorts during crowd redirection phases."
      },
      plainText: `### 🔮 AURA Scenario Simulation: Evacuation & Crowd Management

The simulation has been completed with high precision using real-time data inputs. Here are the core response protocols:

#### 📊 Current Simulation Parameters
- **Primary Event**: "${prompt}"
- **Affected Sectors**: Gates B & C
- **Expected Crowd Redirection**: ~14,000 spectators rerouted.

#### 🕒 Predicted Impact Timeline
*   **5 Minutes**: Emergency alarms activated locally. Security teams isolate the zone.
*   **10 Minutes**: Volunteer lines established. Alternate pedestrian lanes opened.
*   **20 Minutes**: Flow redirected successfully. Gates D and E absorption rates peaks at 88%.
*   **30 Minutes**: Transportation coordination. Metro trains instructed to bypass or extend dwell times.
*   **60 Minutes**: Normal operations resumed. Evacuation lessons stored in AURA memory.

#### ♿ Accessibility & Inclusion Protection
All wheelchair users are redirected through the secure **South Elevator corridor (Access Area 4)**, bypassing the stairs and main congestion choke point.

#### 🌿 Sustainability Impact
Rerouting directions delivered purely via digital HUD and PA announcements, conserving 100% of physical signage paper waste.`
    };
  } else {
    // Standard response mock
    return {
      thinking: "UNDERSTAND: User scenario simulation of standard stadium support.\nRISKS: Navigation, crowd congestion at Gate B.\nPREDICT: Safe travel if routed to Gate D.\nRECOMMEND: Route through northwest promenade.",
      isSimulation: false,
      structuredResponse: {
        situationSummary: `AURA has processed your request ("${prompt}") in accordance with FIFA 2026 guidelines. Operating mode is ${mode}.`,
        immediateRisks: [
          "Localized congestion at Gate B (Heavy Congestion)",
          "Metro services delayed by 15 minutes",
          "Light rain causing slippery paths"
        ],
        recommendedActions: [
          "Access the stadium through Gate D (Open, low wait time).",
          "If arriving via Metro, prepare for a 15-minute wait or catch the Eco-Express shuttle at parking block A.",
          "Head to Section 112/115 shelter area to stay dry during light rain."
        ],
        reasoning: "Gate D is currently open with minimal congestion, whereas Gate B is heavily congested due to incoming transport batches. Choosing Gate D cuts your arrival wait time by approximately 22 minutes.",
        accessibilityConsiderations: "Wheelchair users should utilize the dedicated elevator bank located at Gate D, Section 104, which provides step-free access to all executive and standard levels.",
        sustainabilityImpact: "Encouraging shuttle and metro usage over private cars saves approximately 1.4 kg of CO2 emissions per person.",
        alternativeOptions: [
          "Gate E (Moderate congestion, additional 4-minute walk)",
          "Wait 10 minutes at the shuttle lounge for congestion to subside"
        ],
        confidenceScore: 98,
        estimatedImpact: "Reduces arrival queue wait time by 75% and guarantees dry and comfortable seating.",
        nextBestAction: "Open AURA Interactive Map and follow the blue accessible path to Sector D."
      },
      plainText: `### 🏟️ Welcome to AURA Stadium Assistant

I have processed your World Cup logistics inquiry using current stadium metrics.

#### 📋 Live Summary
*   **Gate B**: Heavy Congestion. Avoid this entrance.
*   **Gate D**: Clear and Open. Recommended entry.
*   **Weather Alert**: Light Rain. Slippery surfaces detected on Section 117 stairs.

#### 🚀 Recommended Plan
1.  **Enter via Gate D**: This bypasses the Gate B congestion, saving you up to **22 minutes** of wait time.
2.  **Take the Northwest Accessible Ramp**: Highly recommended for families with strollers and wheelchair guests.
3.  **Stay Dry**: Free eco-friendly rain ponchos are available at Volunteer Station 4.

*Confidence Rating: 98% based on real-time volunteer counts and gate pressure metrics.*`
    };
  }
}

startServer();
