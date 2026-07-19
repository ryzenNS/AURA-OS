import React, { useState, useRef } from "react";
import { 
  Search, 
  Upload, 
  FileText, 
  CheckCircle, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Camera, 
  Trash2,
  ArrowRight,
  ShieldAlert,
  Inbox
} from "lucide-react";

interface LostAndFoundAIProps {
  onAskAura: (prompt: string) => void;
}

interface ReportedItem {
  id: string;
  name: string;
  category: string;
  color: string;
  locationFound: string;
  timeFound: string;
  status: "Stored" | "Claimed" | "In Review";
  matchProbability?: number;
  imageUrl?: string;
}

const SAMPLE_FOUND_ITEMS: ReportedItem[] = [
  { id: "lf-001", name: "iPhone 15 Pro (Black Case, FIFA Sticker)", category: "Electronics", color: "Black", locationFound: "Section 114 Row F", timeFound: "12:15 PM Today", status: "Stored", imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80" },
  { id: "lf-002", name: "Brown Leather Billfold Wallet", category: "Wallets/Bags", color: "Brown", locationFound: "Gate B Concourse", timeFound: "11:40 AM Today", status: "Stored", imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=150&q=80" },
  { id: "lf-003", name: "Canada National Team Scarf", category: "Merchandise", color: "Red/White", locationFound: "Fan Zone Plaza C", timeFound: "10:30 AM Today", status: "Stored", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80" },
  { id: "lf-004", name: "Sony Noise-Cancelling Earbuds (Silver)", category: "Electronics", color: "Silver", locationFound: "Section 204 Row K", timeFound: "09:15 AM Today", status: "In Review" },
  { id: "lf-005", name: "Kids Blue Adidas Backpack", category: "Wallets/Bags", color: "Blue", locationFound: "Restroom Block West", timeFound: "Yesterday", status: "Stored", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80" },
];

export const LostAndFoundAI: React.FC<LostAndFoundAIProps> = ({ onAskAura }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [color, setColor] = useState("");
  const [approxLocation, setApproxLocation] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Status states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<ReportedItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<ReportedItem | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG/JPG/JPEG)");
      return;
    }
    setErrorMsg("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setImageFile(null);
    setErrorMsg("");
  };

  // Match logic simulation
  const handleRunAiMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !uploadedImage) {
      setErrorMsg("Please provide either a photo or a description of your lost item.");
      return;
    }

    setErrorMsg("");
    setIsAnalyzing(true);
    setMatches([]);
    setSelectedMatch(null);
    setClaimSubmitted(false);

    setTimeout(() => {
      // Filter logic simulation
      const filtered = SAMPLE_FOUND_ITEMS.map(item => {
        let score = 30; // base score
        const lowerDesc = description.toLowerCase();
        const lowerItemName = item.name.toLowerCase();
        const lowerItemColor = item.color.toLowerCase();
        const lowerItemCategory = item.category.toLowerCase();

        // category matching bonus
        if (category.toLowerCase() === lowerItemCategory) score += 25;
        // color matching bonus
        if (color && lowerDesc.includes(color.toLowerCase()) || (color && lowerItemColor.includes(color.toLowerCase()))) score += 20;
        // location matching bonus
        if (approxLocation && lowerDesc.includes(approxLocation.toLowerCase())) score += 15;
        // text description matching words
        const keywords = lowerDesc.split(/\s+/).filter(w => w.length > 2);
        keywords.forEach(word => {
          if (lowerItemName.includes(word) || item.locationFound.toLowerCase().includes(word)) {
            score += 15;
          }
        });

        return {
          ...item,
          matchProbability: Math.min(score, 99)
        };
      })
      .filter(item => item.matchProbability && item.matchProbability > 40)
      .sort((a, b) => (b.matchProbability || 0) - (a.matchProbability || 0));

      setMatches(filtered);
      setIsAnalyzing(false);

      if (filtered.length > 0) {
        onAskAura(`Analyze lost and found reports. Matching uploaded item details (Category: ${category}, Color: ${color || 'Not Specified'}) with ${filtered.length} live database matches.`);
      } else {
        onAskAura(`Analyze lost and found reports. No immediate high-probability matches found in the active databases for description: "${description}". Registered lost item report.`);
      }
    }, 2000);
  };

  const handleSelectMatch = (item: ReportedItem) => {
    setSelectedMatch(item);
    setClaimSubmitted(false);
  };

  const handleInitiateClaim = () => {
    if (!selectedMatch) return;
    const generatedCode = "FIFA-LF-" + Math.floor(100000 + Math.random() * 900000);
    setClaimCode(generatedCode);
    setClaimSubmitted(true);
    onAskAura(`Successfully generated lost-item verification claim ticket **${generatedCode}** for ${selectedMatch.name}. Scheduled collection at primary Gate D Guest operations desk.`);
  };

  const filteredItemsBySearch = SAMPLE_FOUND_ITEMS.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || 
           item.category.toLowerCase().includes(q) || 
           item.locationFound.toLowerCase().includes(q) ||
           item.color.toLowerCase().includes(q);
  });

  return (
    <div id="lost-and-found-root" className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Smart Vault Analytics
            </span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Live Inventory</span>
          </div>
          <h2 className="font-sans font-black text-slate-800 text-lg tracking-tight flex items-center gap-2">
            <Search className="w-5.5 h-5.5 text-indigo-600" />
            AI-Powered Lost &amp; Found Retrieval
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Upload a picture or enter details. AURA will cross-reference computer vision models and metadata with all logged stadium collections in real time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Report Lost Form */}
        <div id="lf-report-panel" className="lg:col-span-7 bg-slate-50/50 border border-gray-150 p-5 rounded-2xl space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="font-sans font-extrabold text-sm text-slate-800">
              Report a Lost Item
            </h3>
          </div>

          <form onSubmit={handleRunAiMatch} className="space-y-4">
            
            {/* Visual Upload Area */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">
                Item Photo (Multimodal Analysis)
              </label>
              
              {!uploadedImage ? (
                <div
                  id="lf-drag-drop-zone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    dragActive
                      ? "border-indigo-600 bg-indigo-50/40 scale-[1.01]"
                      : "border-gray-200 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag &amp; drop photo here or <span className="text-indigo-600 underline">click to browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      Supports JPG, PNG up to 5MB. Fully checked by AURA Vision neural grids.
                    </p>
                  </div>
                </div>
              ) : (
                <div id="lf-image-preview-card" className="relative border border-gray-200 rounded-xl overflow-hidden bg-black flex items-center justify-center h-44 group">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Item"
                    referrerPolicy="no-referrer"
                    className="h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      id="lf-clear-image-btn"
                      type="button"
                      onClick={clearUpload}
                      className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Image loaded successfully
                  </div>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Category</label>
                <select
                  id="lf-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Wallets/Bags">Wallets/Bags</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other Accessories</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Main Color</label>
                <input
                  id="lf-color-input"
                  type="text"
                  placeholder="e.g. Black, Red, Silver"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Approximate Lost Location</label>
              <input
                id="lf-location-input"
                type="text"
                placeholder="e.g. Section 114 Row F, Concourse Gate B"
                value={approxLocation}
                onChange={(e) => setApproxLocation(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Detailed Description</label>
              <textarea
                id="lf-description-input"
                rows={3}
                placeholder="Describe any unique markings, stickers, brand names, or locked home screen images..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
                {errorMsg}
              </p>
            )}

            <button
              id="lf-submit-ai-match-btn"
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Executing Computer Vision Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze &amp; Search Vault</span>
                </>
              )}
            </button>
          </form>

          {/* Matches Output */}
          {matches.length > 0 && (
            <div id="lf-match-results" className="mt-5 space-y-3 pt-4 border-t border-gray-150 animate-[fadeIn_0.25s_ease-out]">
              <div className="flex items-center justify-between">
                <h4 className="font-sans font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  AURA Match Probability Log ({matches.length} matches)
                </h4>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Matches Found
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {matches.map((item) => (
                  <button
                    key={item.id}
                    id={`lf-match-item-${item.id}`}
                    onClick={() => handleSelectMatch(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 cursor-pointer ${
                      selectedMatch?.id === item.id
                        ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-sans font-black text-xs text-slate-800 truncate block">
                          {item.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          (item.matchProbability || 0) > 75 ? "text-emerald-600" : "text-indigo-600"
                        }`}>
                          {item.matchProbability}% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.locationFound}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.timeFound}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No matches response */}
          {!isAnalyzing && matches.length === 0 && description && (
            <div className="mt-4 p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl text-center">
              <p className="text-xs font-bold text-indigo-800">
                🔍 Registered in AURA Vault Registry
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                No active matches found. Your report has been broadcasted to all volunteer hand-held terminals. We will notify you instantly when matched.
              </p>
            </div>
          )}

        </div>

        {/* Right column: Active Vault Inventory Search & Claim Guide */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active claim status / instructions card */}
          {selectedMatch && (
            <div id="lf-claim-card" className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-150 p-5 rounded-2xl space-y-4 animate-[slideUp_0.2s_ease-out]">
              <div className="flex items-start justify-between gap-3 border-b border-gray-200/50 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider">
                    AI CLAIM RESOLVER
                  </span>
                  <h4 className="font-sans font-black text-sm text-slate-800">
                    Selected: {selectedMatch.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Found at {selectedMatch.locationFound}
                  </p>
                </div>
                <button
                  id="lf-cancel-claim-btn"
                  onClick={() => setSelectedMatch(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              </div>

              {!claimSubmitted ? (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Verify that this description matches your lost item. In order to claim ownership, please click "Initiate Claim" to produce your encrypted operations verification pass.
                  </p>
                  
                  <button
                    id="lf-confirm-claim-btn"
                    onClick={handleInitiateClaim}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Generate Claim Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {/* Success ticket box */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Verification Claim Code</span>
                      <h5 className="font-mono font-black text-slate-800 text-base mt-0.5">
                        {claimCode}
                      </h5>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="text-xs font-black text-slate-800">Step-by-Step Retrieval Plan:</h5>
                    <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-4 h-4 rounded-full font-bold font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Proceed directly to the **Operations Center Helpdesk** near **Gate D Level 1**.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-4 h-4 rounded-full font-bold font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Present your active World Cup Match ticket or ID along with the Claim Code **{claimCode}**.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-4 h-4 rounded-full font-bold font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>A volunteer safety coordinator will fetch your item from the security lockup cabinet.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database search panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="font-sans font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-indigo-600" />
                Browse active collections
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                View all items cataloged by stadium operations and volunteers.
              </p>
            </div>

            <div className="relative">
              <input
                id="lf-search-input"
                type="text"
                placeholder="Search database (e.g. iPhone, wallet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredItemsBySearch.length > 0 ? (
                filteredItemsBySearch.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-gray-150 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-400 font-medium">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.locationFound}</span>
                      </div>
                    </div>
                    <button
                      id={`lf-action-select-${item.id}`}
                      onClick={() => handleSelectMatch(item)}
                      className="shrink-0 bg-white hover:bg-slate-100 border border-gray-200 hover:border-gray-300 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg transition-all text-slate-700 cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No registered items match "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Quick operations guidelines */}
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5 border border-slate-150">
            <h5 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Lost Item Advisory
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              If your lost item contains medical prescriptions, baby food, or flight boarding passes, trigger an immediate operations escalations co-pilot query via **EMERGENCY AI** or the main **AURA co-pilot chat**. Our field support teams are dispatched near high-traffic sectors.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
