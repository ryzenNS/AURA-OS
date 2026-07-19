import React, { useState } from "react";
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info,
  DollarSign,
  Heart,
  Minus,
  Plus
} from "lucide-react";

interface ShoppingAIProps {
  onAskAura: (prompt: string) => void;
}

interface MerchItem {
  id: string;
  name: string;
  price: number;
  description: string;
  team: string;
  stock: number;
  sizes: string[];
  image: string;
}

export const ShoppingAI: React.FC<ShoppingAIProps> = ({
  onAskAura,
}) => {
  const [supportedTeam, setSupportedTeam] = useState("Argentina");
  const [selectedSize, setSelectedSize] = useState<{ [itemId: string]: string }>({});
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [isOrdered, setIsOrdered] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("seat"); // seat or pickup

  const merchCatalog: MerchItem[] = [
    {
      id: "shop-1",
      name: "Official Commemorative Home Jersey",
      price: 85.00,
      description: "Matchday slim-fit jersey featuring recycled moisture-wicking fibers and gold team details.",
      team: "Argentina",
      stock: 12,
      sizes: ["S", "M", "L", "XL"],
      image: "🇦🇷"
    },
    {
      id: "shop-2",
      name: "Supporters Premium Fringe Scarf",
      price: 25.00,
      description: "Soft jacquard-woven high-density acrylic scarf with authentic match fringe tassels.",
      team: "Argentina",
      stock: 45,
      sizes: ["One Size"],
      image: "🧣"
    },
    {
      id: "shop-3",
      name: "Commemorative Winter Beanie Cap",
      price: 20.00,
      description: "Rib-knit crown with folded cuff and high-definition laser embroidered nation shield logo.",
      team: "Argentina",
      stock: 8,
      sizes: ["One Size"],
      image: "🧢"
    },
    {
      id: "shop-4",
      name: "Official Commemorative Home Jersey",
      price: 85.00,
      description: "Tricolor athletic jersey with gold embroidery star shields and double-knit moisture control.",
      team: "France",
      stock: 14,
      sizes: ["S", "M", "L", "XL"],
      image: "🇫🇷"
    },
    {
      id: "shop-5",
      name: "Supporters Premium Fringe Scarf",
      price: 25.00,
      description: "Traditional team-color jacquard scarf with printed stadium details and soft weave.",
      team: "France",
      stock: 30,
      sizes: ["One Size"],
      image: "🧣"
    },
    {
      id: "shop-6",
      name: "FIFA World Cup 2026 Official Match Ball",
      price: 130.00,
      description: "Premium seamless high-performance matchball containing embedded motion tracking chip technology.",
      team: "All",
      stock: 5,
      sizes: ["Size 5"],
      image: "⚽"
    }
  ];

  const handleAddToCart = (itemId: string) => {
    // Check if item has sizes and if user selected one
    const item = merchCatalog.find((m) => m.id === itemId);
    if (item && item.sizes.length > 1 && !selectedSize[itemId]) {
      // Auto-select first size as fallback
      setSelectedSize(prev => ({ ...prev, [itemId]: item.sizes[0] }));
    }
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[itemId] <= 1) {
        delete copy[itemId];
      } else {
        copy[itemId] -= 1;
      }
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart({});
    setIsOrdered(false);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setCart({});
    onAskAura(`Successfully ordered commemorative merchandise items! Provide confirmation details and instructions for ${deliveryMethod === "seat" ? "delivery directly to my seat" : "pickup at the Level 2 fan shop Hub"}.`);
  };

  // Filter based on supported team
  const filteredCatalog = merchCatalog.filter(
    (item) => item.team === "All" || item.team === supportedTeam
  );

  const cartItems = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = merchCatalog.find((m) => m.id === itemId);
      return item ? { item, quantity: qty, size: selectedSize[itemId] || "One Size" } : null;
    })
    .filter(Boolean) as { item: MerchItem; quantity: number; size: string }[];

  const cartTotal = cartItems.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  return (
    <div id="shopping-ai-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Team recommendation, Size charts & Catalog grid (8 Cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Supporting Team Recommendation Picker */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-3xl text-white flex flex-col sm:flex-row justify-between items-center gap-4 border border-indigo-800/25 relative overflow-hidden">
          <div className="space-y-1 relative z-10 text-center sm:text-left">
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Custom Merch AI Recommendation
            </span>
            <h3 className="font-sans font-black text-base tracking-tight">
              Get customized fan wear for your favorite nation!
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              We dynamically configure the available stock lists based on the teams you are backing today.
            </p>
          </div>

          <div className="flex gap-2 relative z-10 shrink-0">
            {["Argentina", "France"].map((team) => (
              <button
                key={team}
                onClick={() => setSupportedTeam(team)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                  supportedTeam === team
                    ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {team === "Argentina" ? "🇦🇷 Argentina" : "🇫🇷 France"}
              </button>
            ))}
          </div>
        </div>

        {/* Merch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCatalog.map((item) => {
            const inCartQty = cart[item.id] || 0;
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3 hover:border-indigo-100 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl bg-slate-50 border border-gray-150 p-2 rounded-xl">{item.image}</span>
                    <span className="font-mono text-xs font-black text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-gray-150">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-sans font-black text-slate-800 text-xs">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-normal">{item.description}</p>
                  </div>

                  {/* Size Selectors */}
                  {item.sizes.length > 1 && (
                    <div className="space-y-1 pt-1">
                      <span className="block text-[9px] font-mono uppercase text-slate-400 font-bold">Available Sizes</span>
                      <div className="flex gap-1.5">
                        {item.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(prev => ({ ...prev, [item.id]: sz }))}
                            className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                              selectedSize[item.id] === sz
                                ? "bg-indigo-600 border-indigo-600 text-white font-extrabold"
                                : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="font-mono text-slate-400">Stock Available: <strong className="text-slate-700 font-black">{item.stock} left</strong></span>
                    {item.stock < 10 && (
                      <span className="text-rose-600 bg-rose-50 border border-rose-100 font-mono font-bold uppercase px-1.5 py-0.5 rounded-md">
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <button
                    onClick={() => onAskAura(`Show me size dimensions, sleeve lengths, and garment washing specifications for: ${item.name}.`)}
                    className="text-[9px] font-mono text-indigo-500 hover:text-indigo-600 underline font-black cursor-pointer"
                  >
                    View Sizing Chart &rarr;
                  </button>

                  <div className="flex items-center gap-1.5">
                    {inCartQty > 0 ? (
                      <div className="flex items-center bg-indigo-50 border border-indigo-100 rounded-xl px-1.5 py-1 gap-3">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 hover:bg-white rounded-lg text-indigo-700 transition-all cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-black text-indigo-700">{inCartQty}</span>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="p-1 hover:bg-white rounded-lg text-indigo-700 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        Add to bag
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Checkout Cart Drawer (4 Cols) */}
      <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Thank You message on success */}
        {isOrdered && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2 animate-[slideUp_0.2s_ease-out]">
            <span className="text-3xl block">🛍️</span>
            <h4 className="font-sans font-black text-emerald-800 text-xs">Merch Order Placed!</h4>
            <p className="text-[11px] text-emerald-700 leading-normal font-semibold">
              Thank you for supporting your nation! Our smart system has compiled your receipt details and pushed them to the operations chat console.
            </p>
            <button
              onClick={() => setIsOrdered(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Shop More Wear
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h4 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            FIFA Shopping Bag
          </h4>
          {cartItems.length > 0 && (
            <button onClick={handleClearCart} className="text-[10px] font-mono text-slate-400 hover:text-rose-600 underline font-bold cursor-pointer">
              Clear Bag
            </button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="divide-y divide-gray-100 max-h-44 overflow-y-auto pr-1">
              {cartItems.map(({ item, quantity, size }) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Size: <strong className="text-indigo-600">{size}</strong> • ${item.price.toFixed(2)} x {quantity}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-800">${(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Delivery Method Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Delivery / Pickup Method</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("seat")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    deliveryMethod === "seat"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-black"
                      : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  🚴 In-Seat Runner
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-black"
                      : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  🏪 Shop Counter Pickup
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                {deliveryMethod === "seat" 
                  ? "Delivered directly to your seat (Row L, Seat 14) during the next break." 
                  : "Collect at the nearest Official merchandise counter (Hub Level 2) after checkout."}
              </p>
            </div>

            {/* Total summary */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 font-mono text-xs space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Sales Tax (8%)</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 border-t border-gray-200 pt-2 mt-1">
                <span>Grand Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Order</span>
            </button>
          </form>
        ) : (
          !isOrdered && (
            <div className="text-center py-8 text-xs text-slate-400 font-semibold space-y-2">
              <span className="block text-3xl">🛒</span>
              <span>Your shopping bag is empty. Explore custom fan wear!</span>
            </div>
          )
        )}
      </div>

    </div>
  );
};
