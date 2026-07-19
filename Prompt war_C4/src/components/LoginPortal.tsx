import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "../types";
import { AuraLogo } from "./AuraLogo";
import { KickOffTransition } from "./KickOffTransition";
import {
  Globe,
  Award,
  Shield,
  Brain,
  Lock,
  Sparkles,
  Cpu,
  Tv,
  CheckCircle,
  HelpCircle,
  UserCheck,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Upload,
  ArrowRight,
  ChevronRight,
  Database,
  Layers,
  Activity,
  Maximize2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Key
} from "lucide-react";

interface LoginPortalProps {
  onLogin: (profile: UserProfile) => void;
}

const PREBUILT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
];

const SEEDED_ACCOUNTS = [
  {
    name: "Alex Gridmaster",
    email: "admin@aura.com",
    phone: "+1 (555) 2026-GRID",
    role: "admin",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    about: "System Administrator. Fully verified with master credential keys to manage 16 host stadiums.",
    password: "password123",
    credentialId: "ADM-2026-GRID"
  },
  {
    name: "Chef Maria",
    email: "maria@aura.com",
    phone: "+1 (555) 2026-CHEF",
    role: "staff",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    about: "Event & Restaurant Staff Lead. Coordinating F&B seat delivery operations across VIP suites.",
    password: "password123",
    credentialId: "STF-2026-CHEF"
  },
  {
    name: "Sam Volunteer",
    email: "volunteer@aura.com",
    phone: "+1 (555) 2026-VOLS",
    role: "volunteer",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    about: "FIFA Volunteer Captain. Assisting lost fans and checking acoustic and medical telemetry points.",
    password: "password123",
    credentialId: "VOL-2026-FIFA"
  },
  {
    name: "Diego Fan",
    email: "diego@aura.com",
    phone: "+1 (555) 2026-FANS",
    role: "fan",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    about: "Super Fan traveling from Mexico City to support El Tri in Vancouver! Vamos!",
    password: "password123"
  }
];

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLogin }) => {
  // Login vs SignUp mode
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states for SignUp
  const [role, setRole] = useState<"admin" | "fan" | "volunteer" | "staff">("fan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [avatar, setAvatar] = useState(PREBUILT_AVATARS[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form states for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // UI state
  const [animatingUser, setAnimatingUser] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerCardRef = useRef<HTMLDivElement>(null);

  // Initialize Seed Accounts
  useEffect(() => {
    const existing = localStorage.getItem("aura_users");
    if (!existing) {
      localStorage.setItem("aura_users", JSON.stringify(SEEDED_ACCOUNTS));
    }
  }, []);

  const scrollToRegister = () => {
    registerCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Sign In / Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const existing = localStorage.getItem("aura_users");
    const users = existing ? JSON.parse(existing) : SEEDED_ACCOUNTS;
    const found = users.find((u: any) => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());

    if (!found) {
      setErrorMsg("No account found with this email. Please sign up or try another email.");
      return;
    }

    if (found.password !== loginPassword) {
      setErrorMsg("Incorrect secure password. Please try again.");
      return;
    }

    setSuccessMsg(`Welcome back, ${found.name}! Preparing Kick-Off...`);
    setTimeout(() => {
      setAnimatingUser({
        ...found,
        isLoggedIn: true
      });
    }, 800);
  };

  // Submit Sign Up / Register
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate email
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Validate passwords
    if (password.length < 6) {
      setErrorMsg("Secure password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify your secure password entries.");
      return;
    }

    // Check credential IDs for staff, volunteer, and admin
    if (role !== "fan" && !credentialId.trim()) {
      setErrorMsg(`Please enter your official ${getRoleLabel(role)} ID to authenticate.`);
      return;
    }

    const existing = localStorage.getItem("aura_users");
    const users = existing ? JSON.parse(existing) : [...SEEDED_ACCOUNTS];

    const found = users.find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (found) {
      setErrorMsg("An account with this email already exists. Please Sign In instead.");
      return;
    }

    const newUser = {
      name: name || `${getRoleLabel(role)} Guest`,
      email: email.toLowerCase().trim(),
      phone: phone || "+1 (555) 2026-FIFA",
      role,
      photoUrl: avatar,
      about: about || `FIFA World Cup 2026 ${getRoleLabel(role)} Member.`,
      password,
      credentialId: role !== "fan" ? credentialId : undefined
    };

    users.push(newUser);
    localStorage.setItem("aura_users", JSON.stringify(users));

    setSuccessMsg("Account successfully created! Preparing Kick-Off...");
    setTimeout(() => {
      setAnimatingUser({
        ...newUser,
        isLoggedIn: true
      });
    }, 1000);
  };

  // One-click login helper
  const handleQuickLogin = (acc: typeof SEEDED_ACCOUNTS[0]) => {
    setLoginEmail(acc.email);
    setLoginPassword(acc.password);
    setErrorMsg("");
    setSuccessMsg(`Selected ${acc.name}. Press 'Secure Sign In' to enter.`);
  };

  const getRoleLabel = (r: typeof role) => {
    switch (r) {
      case "fan":
        return "Fan";
      case "volunteer":
        return "Volunteer";
      case "staff":
        return "Event Staff Member";
      case "admin":
        return "System Administrator";
    }
  };

  const getRolePlaceholder = (r: typeof role) => {
    switch (r) {
      case "volunteer":
        return "VOL-2026-FIFA";
      case "staff":
        return "STF-2026-CHEF";
      case "admin":
        return "ADM-2026-GRID";
      default:
        return "";
    }
  };

  const getRoleInfoText = (r: typeof role) => {
    switch (r) {
      case "volunteer":
        return "🔒 Volunteers must verify with their authorized FIFA Volunteer Copilot ID. You will gain access to safety checklists, guest-routing wayfinders, and local support dispatching.";
      case "staff":
        return "🍳 Event & Restaurant Staff must provide their Culinary Operations ID. This unlocks the real-time F&B Kitchen Orders queue, seat runner dispatch controls, and active telemetry dashboard.";
      case "admin":
        return "⚡ System Administrators require full cryptographic security keys. This grants ultimate override rights over live stadium status, active gate lockdowns, transit delay variables, and AI OS nodes.";
      default:
        return "🏟️ Attendees are registered as general Fans. No credential ID required. Explore standard safety tools, order stadium seat-delivery food, and interact with the AURA AI assistant.";
    }
  };

  if (animatingUser) {
    return (
      <KickOffTransition
        user={animatingUser}
        onComplete={() => onLogin(animatingUser)}
      />
    );
  }

  return (
    <div id="login-portal-root" className="min-h-screen bg-[#fbfaf7] text-[#191919] font-sans selection:bg-indigo-200 selection:text-indigo-950 overflow-x-hidden">
      
      {/* 1. PREMIUM HEADER / NAVIGATION */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/60">
        {/* AURA Premium Crafted Logo */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0">
            <AuraLogo size="md" showText={false} light={true} />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-black text-xl tracking-widest text-slate-900 leading-none">AURA</span>
            <span className="font-mono text-[7px] text-slate-500 tracking-wider font-extrabold mt-1 uppercase">
              Automated Unified Resources &amp; Allocation OS
            </span>
          </div>
        </div>

        {/* Central Nav Links (Anthropic Editorial Style) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
          <a href="#about-section" className="hover:text-slate-900 transition-colors">OS Model Security</a>
          <a href="#stadium-impact" className="hover:text-slate-900 transition-colors">Stadium Impact</a>
          <a href="#releases" className="hover:text-slate-900 transition-colors">Latest Releases</a>
          <span className="h-4 w-[1px] bg-slate-300" />
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100 font-bold">
            AURA V2.4-SECURE
          </span>
        </nav>

        {/* CTA Button to Scroll to Register */}
        <button
          onClick={scrollToRegister}
          className="bg-[#111111] hover:bg-slate-800 text-white text-xs font-bold px-4.5 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          Secure Access
        </button>
      </header>

      {/* 2. THE EDITORIAL HERO SECTION (Matched to Anthropic Landing Style) */}
      <section id="about-section" className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Elegant Big Display Title without line */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tight leading-[1.08]">
            Cognitive AI and <br />
            <span className="relative inline-block">
              stadium systems
            </span> <br />
            that put safety first.
          </h1>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed font-medium">
            The AURA neural matrix works continuously behind the scenes of the FIFA World Cup 2026™. Spanning 16 cities and 104 matches, we connect physical gate networks, stadium dining queues, and smart accessibility route-guides to create a beautifully smooth attendee experience.
          </p>
        </div>

        {/* Right Side: Fine Editorial Supporting Info */}
        <div className="lg:col-span-5 pt-4 lg:pt-8 space-y-6 border-l border-slate-200 pl-6 lg:pl-10">
          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
            AURA represents the crown jewel of modern sports infrastructure. Built as a dual-layer AI agent, it simultaneously serves general attendees, guides sensory-sensitive families, coordinates culinary kitchen orders, and alerts emergency security dispatchers of crowd density spikes.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToRegister}
              className="group text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-500 transition-colors"
            >
              <span>Sign in with authorized secure keys</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>



      {/* 3. COGNITIVE RADIATING CORE MAP (THE IMMERSIVE DARK BANNER) */}
      <section className="bg-[#0c0d12] text-[#e5e5e5] py-20 px-6 relative overflow-hidden">
        {/* Subtle Pitch Background grid lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Radial Neural Graphic representing AURA Connected variables */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* Center Glowing Logo Core */}
              <div className="absolute w-24 h-24 bg-slate-950/90 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.6)] border border-indigo-500/30 z-20 hover:scale-110 transition-transform">
                <AuraLogo size="md" showText={false} light={false} />
              </div>

              {/* Connecting Rings */}
              <div className="absolute w-44 h-44 rounded-full border border-indigo-500/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-64 h-64 rounded-full border border-slate-800/60" />
              <div className="absolute w-72 h-72 rounded-full border border-dashed border-rose-500/10" />

              {/* Outer Radial floating nodes (rays in the screenshot) */}
              {[
                { label: "Predict Gate Traffic", angle: 0, x: "85%", y: "40%" },
                { label: "Dispatch Assist", angle: 60, x: "70%", y: "85%" },
                { label: "Route Lost Parents", angle: 120, x: "15%", y: "80%" },
                { label: "Monitor Sound Meter", angle: 180, x: "10%", y: "35%" },
                { label: "F&B Kitchen Queue", angle: 240, x: "35%", y: "10%" },
                { label: "Acoustic Sensors", angle: 300, x: "72%", y: "15%" },
              ].map((node, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", left: node.x, top: node.y }}
                  className="z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  {/* Subtle connecting lines to the center */}
                  <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-gradient-to-r from-indigo-500/0 to-indigo-500/30 origin-left" style={{ transform: `rotate(${node.angle}deg) translate(-100%)` }} />
                  
                  <div className="bg-[#14161f] border border-slate-800 px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 hover:border-indigo-500 transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-300 whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Right Text Block explaining Built on complex stadium variables */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              AURA SECURITY GRID
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
              AURA is built on <br />
              hard stadium questions.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              See how we are tackling the most demanding security, crowd routing, and real-time operations challenges across the FIFA World Cup 2026™ grid ecosystem.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToRegister}
                className="bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Access Security Panel</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CENTRAL SECURE REGISTER AND LOG IN PANEL */}
      <section ref={registerCardRef} className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Photo Upload Guide & Quick seed login cards */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block">
              PORTAL ENTRANCE
            </span>
            <h2 className="font-sans font-black text-3xl text-slate-900 tracking-tight leading-none">
              Verify Credentials &amp; Join Grid
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Select your assigned profile role to access custom operations. Set a private secure password to protect your analytical stadium session.
            </p>
          </div>

          {/* Quick Sandbox Seed Accounts */}
          {showDemoAccounts && (
            <div className="bg-amber-50/50 border border-amber-200/70 rounded-3xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" /> Pre-Configured Secure Accounts
                </span>
                <button 
                  onClick={() => setShowDemoAccounts(false)}
                  className="text-[9px] font-mono text-amber-600 hover:text-amber-800 font-bold hover:underline"
                >
                  Hide
                </button>
              </div>
              <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                Click any profile below to auto-fill its secure parameters, then press <strong>Secure Sign In</strong>. Password for all is <code className="bg-amber-100 px-1 py-0.5 rounded font-bold font-mono">password123</code>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SEEDED_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLogin(acc)}
                    className="flex items-center gap-2 p-2 bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl transition-all text-left shadow-xs cursor-pointer group"
                  >
                    <img 
                      src={acc.photoUrl} 
                      alt={acc.name} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-100" 
                    />
                    <div className="min-w-0">
                      <span className="block text-[10.5px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                        {acc.name}
                      </span>
                      <span className="block text-[8px] font-mono text-slate-400 uppercase font-bold leading-none">
                        {acc.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DRAG AND DROP PROFILE PHOTO UPLOADER (Only needed for Sign Up) */}
          {isSignUp && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm animate-[fadeIn_0.2s_ease-out]">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-extrabold">
                Step 1: Set Profile Photo
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/40"
                    : "border-slate-250 hover:border-slate-400 bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {avatar ? (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="relative group">
                      <img
                        src={avatar}
                        alt="Uploaded Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-bold block">
                        CUSTOM PHOTO ATTACHED
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1">Click or drag another to update</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="bg-white p-2.5 rounded-full border border-slate-200 text-slate-400 shadow-xs">
                      <Upload className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Drag & drop profile photo</span>
                      <span className="text-[10px] text-slate-400 font-medium">Or click to browse files</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Prebuilt Quick-Select Avatars */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Or pick a quick-select avatar:
                </span>
                <div className="flex gap-2">
                  {PREBUILT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === av ? "border-indigo-600 scale-110 shadow-sm" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={av} alt="avatar option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center">
              <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">MATCHES</span>
              <span className="text-xs font-black text-slate-900">104</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center">
              <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">TEAMS</span>
              <span className="text-xs font-black text-slate-900">48</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center">
              <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">HOSTS</span>
              <span className="text-xs font-black text-slate-900">3 STATIONS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek High-Contrast Input Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-8 sm:p-10 shadow-md space-y-6">
          
          {/* Form Mode Selector Header */}
          <div className="flex border-b border-slate-100 pb-4">
            <button
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-2.5 text-sm font-bold text-center cursor-pointer transition-all border-b-2 flex items-center justify-center gap-2 ${
                !isSignUp
                  ? "border-indigo-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Secure Sign In</span>
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 pb-2.5 text-sm font-bold text-center cursor-pointer transition-all border-b-2 flex items-center justify-center gap-2 ${
                isSignUp
                  ? "border-indigo-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-sans font-black text-xl text-slate-900 tracking-tight">
              {isSignUp ? "Step 2: Account Parameters" : "Enter Cryptographic Security Keys"}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {isSignUp 
                ? "Register a secure network account to access stadium sensory dashboards."
                : "Enter your secure email address and passcode to authenticate."
              }
            </p>
          </div>

          {/* SIGN IN FORM */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" /> Secure Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="e.g., admin@aura.com"
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" /> Security Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[9px] font-mono text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Status Notifications */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] font-bold text-rose-600 leading-relaxed animate-[shake_0.2s_ease-in-out]">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10.5px] font-bold text-emerald-700 leading-relaxed animate-pulse">
                  ✓ {successMsg}
                </div>
              )}

              {/* Submit Sign In button */}
              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-slate-800 py-3.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Secure Sign In &rarr;</span>
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
              
              {/* Name & Role Field Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="e.g., Alex Johnson"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Profile Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as any);
                      setCredentialId("");
                      setErrorMsg("");
                    }}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
                  >
                    <option value="fan">Fan (Attendee)</option>
                    <option value="volunteer">Volunteer Copilot</option>
                    <option value="staff">Stadium Event Staff</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              {/* Contact Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="e.g., alex@fifa2026.com"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +1 (555) 2026-FIFA"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Secure Password Entry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/10 border border-indigo-100/50 p-4 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5 flex items-center justify-between">
                    <span>Set Secure Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="At least 6 chars"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Verify password"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Credential ID Input */}
              {role !== "fan" && (
                <div className="animate-[slideDown_0.2s_ease-out] p-4 bg-rose-50/40 border border-rose-100 rounded-2xl">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-rose-600 font-extrabold mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Official {getRoleLabel(role)} ID
                  </label>
                  <input
                    type="text"
                    required
                    value={credentialId}
                    onChange={(e) => {
                      setCredentialId(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder={`e.g., ${getRolePlaceholder(role)}`}
                    className="w-full bg-white border border-rose-250 rounded-xl px-3.5 py-2.5 text-xs text-rose-800 placeholder-rose-300 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono font-bold"
                  />
                </div>
              )}

              {/* Custom Bio / Intent Statement */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                  About Your FIFA Role &amp; Intent
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={role === "fan" ? "Traveling to cheer on my favorite national squad!" : "Ready to keep operations moving perfectly."}
                  rows={2}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Role Notice */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-500 font-medium leading-relaxed">
                {getRoleInfoText(role)}
              </div>

              {/* Error Message notice box */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] font-bold text-rose-600">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10.5px] font-bold text-emerald-700 animate-pulse">
                  ✓ {successMsg}
                </div>
              )}

              {/* Submit Action button */}
              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-slate-800 py-3.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Create Secure Account &rarr;</span>
              </button>

            </form>
          )}
        </div>

      </section>

      {/* 5. "LATEST RELEASES" SECTION (REPLICATING ANTHROPIC GRID CARD DESIGN) */}
      <section id="releases" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block">
              PRODUCT PIPELINE
            </span>
            <h3 className="font-sans font-black text-2xl text-slate-900 tracking-tight">
              Latest releases &amp; milestones
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
            Updated July 2026
          </span>
        </div>

        {/* 3 Columns representing Latest Releases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 block font-bold">DATE: June 20, 2026</span>
              <h4 className="font-sans font-extrabold text-sm text-[#111111]">
                Redeploying Sonnet &amp; Gemini for active video feeds
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Our core model integrations are now capable of analyzing 30fps stadium safety feeds locally, automatically alerting operations staff of choke points.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>CATEGORY: Safety</span>
              <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={scrollToRegister}>Read Release &rarr;</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 block font-bold">DATE: June 15, 2026</span>
              <h4 className="font-sans font-extrabold text-sm text-[#111111]">
                Dynamic Seat-Delivery F&amp;B dispatch system
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Optimized route planning for culinary runners. Orders placed via dining menu are instantly funneled to appropriate kitchen hubs based on sector distance.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>CATEGORY: Operations</span>
              <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={scrollToRegister}>Read Release &rarr;</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 block font-bold">DATE: June 01, 2026</span>
              <h4 className="font-sans font-extrabold text-sm text-[#111111]">
                Spectator acoustic analysis tracking crowd excitement
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Integrated sector microphone arrays are connected to stadium visualizers, rendering micro-decibel peaks to detect fan excitement levels in real-time.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>CATEGORY: Analytics</span>
              <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={scrollToRegister}>Read Release &rarr;</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. EDITORIAL FOOTER DIRECTORY */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black">AI &amp; Safety</span>
            <ul className="space-y-1.5 text-xs text-slate-500 font-semibold">
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Model Overview</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Constitutional Rules</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Safety Checklists</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Responsible AI</li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black">FIFA World Cup</span>
            <ul className="space-y-1.5 text-xs text-slate-500 font-semibold">
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Canada host cities</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Mexico arenas</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>United States stadiums</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Match schedules</li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black">Core Company</span>
            <ul className="space-y-1.5 text-xs text-slate-500 font-semibold">
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>About FIFA Portal</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Operational Careers</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>F&amp;B Partnerships</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Newsroom</li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black">Clearance</span>
            <ul className="space-y-1.5 text-xs text-slate-500 font-semibold">
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Credential ID Lookup</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Volunteer Hub login</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>Restaurant Staff check</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer" onClick={scrollToRegister}>SysAdmin overrides</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-slate-400 font-bold">
          <span>© FIFA World Cup 2026™ | AURA Cognitive Stadium Network</span>
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Shield className="w-4 h-4" /> Secure SSL Cryptographic Key Verified
          </span>
        </div>
      </footer>

    </div>
  );
};
