import React, { useState, useEffect } from "react";
import { MenuItem, FoodOrder, UserProfile } from "../types";
import { 
  ShoppingBag, 
  Utensils, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Star, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Info,
  DollarSign
} from "lucide-react";

interface FoodAIProps {
  profile: UserProfile;
  onOrderPlaced: (order: FoodOrder) => void;
  onAskAura: (prompt: string) => void;
}

const STADIUM_RESTAURANTS = [
  { id: "rest-1", name: "🍔 Stadium Grillhouse", desc: "Premium hand-crafted beef burgers and tenders", rating: "4.8", waitTime: "12 mins queue", loc: "Sector 104" },
  { id: "rest-2", name: "🍕 Arena Slice & Crust", desc: "Oven-baked pizzas and warm garlic nachos", rating: "4.6", waitTime: "4 mins queue", loc: "Section 112" },
  { id: "rest-3", name: "🥤 AURA Hydration & Brews", desc: "Energy smoothies, cold sodas, and local draft beers", rating: "4.9", waitTime: "2 mins queue", loc: "Food Court B" }
];

const MENU_ITEMS: MenuItem[] = [
  { id: "item-1", name: "World Cup Burger Combo", price: 14.50, description: "Premium Black Angus beef patty, melted cheddar, crispy bacon, and dynamic glaze, served with fresh-cut salt fries and soda.", category: "Meals", isAvailable: true, tags: ["Halal"] },
  { id: "item-2", name: "Kickoff Beef Hot Dog", price: 7.00, description: "100% kosher beef sausage in a freshly toasted sesame bun, topped with sweet pickle relish and mustard.", category: "Meals", isAvailable: true, tags: ["Halal", "Gluten-Free Available"] },
  { id: "item-3", name: "Golden Goal Cheese Nachos", price: 9.50, description: "Crispy warm tortilla chips smothered in hot cheddar cheese dip, sliced jalapeños, and fresh pico de gallo.", category: "Snacks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "item-4", name: "Striker Crispy Chicken Tenders", price: 11.00, description: "Four golden crispy tenders served with honey mustard or hickory BBQ dipping sauce.", category: "Meals", isAvailable: true, tags: ["Halal"] },
  { id: "item-5", name: "Pitchside Bavarian Pretzel", price: 5.50, description: "Super-soft giant oven-baked pretzel served warm with a side of zesty honey mustard.", category: "Snacks", isAvailable: true, tags: ["Vegetarian"] },
  { id: "item-6", name: "Aura Power Super Smoothie", price: 6.50, description: "Antioxidant berry blend, Greek yogurt, fresh spinach, honey, and clean energy booster.", category: "Drinks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free", "Vegan Available"] },
  { id: "item-7", name: "Stadium Soda (Souvenir Cup)", price: 4.00, description: "Commemorative FIFA World Cup 2026 souvenir cup with free unlimited refills at any automated fountain.", category: "Drinks", isAvailable: true, tags: ["Vegetarian", "Vegan"] },
  { id: "item-8", name: "Championship Popcorn Bucket", price: 5.00, description: "Mega-sized bucket of fresh warm kettle corn tossed in real cream butter.", category: "Snacks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "item-9", name: "World Cup Churro Basket", price: 6.00, description: "Three traditional fried churros dusted in sweet cinnamon sugar, served with a warm dark chocolate dip.", category: "Sweets", isAvailable: true, tags: ["Vegetarian"] }
];

export const FoodAI: React.FC<FoodAIProps> = ({ 
  profile, 
  onOrderPlaced, 
  onAskAura 
}) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(STADIUM_RESTAURANTS[0].id);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "Meals" | "Snacks" | "Drinks" | "Sweets">("ALL");
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dietary filters
  const [dietVegan, setDietVegan] = useState(false);
  const [dietGlutenFree, setDietGlutenFree] = useState(false);
  const [dietHalal, setDietHalal] = useState(false);
  const [budgetMax, setBudgetMax] = useState<number>(15);

  // Checkout details form
  const [custName, setCustName] = useState(profile.name || "");
  const [custPhone, setCustPhone] = useState(profile.phone || "");
  const [deliverySeat, setDeliverySeat] = useState("Sec 112, Row L, Seat 14");
  const [orderNotes, setOrderNotes] = useState("");
  
  // Placement State
  const [isPlacing, setIsPlacing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FoodOrder | null>(null);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (profile.name) setCustName(profile.name);
    if (profile.phone) setCustPhone(profile.phone);
  }, [profile]);

  // Sync placed order status periodically if active
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const allOrders = await response.json();
          const match = allOrders.find((o: FoodOrder) => o.id === activeOrder.id);
          if (match && match.status !== activeOrder.status) {
            setActiveOrder(match);
          }
        }
      } catch (err) {
        console.error("Failed to sync placed order status:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const cartItems = Object.entries(cart)
    .map(([itemId, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === itemId);
      return item ? { item, quantity: qty } : null;
    })
    .filter(Boolean) as { item: MenuItem; quantity: number }[];

  const cartTotal = cartItems.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
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

  const handleClearCart = () => setCart({});

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsPlacing(true);
    setOrderError("");

    const orderPayload = {
      customerName: custName || "Leo Messi",
      customerPhone: custPhone || "+1 (555) 000-0000",
      deliverySeat: deliverySeat || "Sec 112, Row L, Seat 14",
      items: cartItems.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity
      })),
      total: cartTotal,
      notes: orderNotes
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error("Kitchen server rejected your dining order.");
      }

      const confirmedOrder = await response.json();
      setActiveOrder(confirmedOrder);
      handleClearCart();
      setOrderNotes("");
      onOrderPlaced(confirmedOrder);
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  // Filter logic based on searches, category, budget, and dietary choices
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
    const matchesBudget = item.price <= budgetMax;

    // Tag verification
    const tagsLower = item.tags.map(t => t.toLowerCase());
    const matchesVegan = !dietVegan || tagsLower.some(t => t.includes("vegan") || t.includes("vegetarian"));
    const matchesGlutenFree = !dietGlutenFree || tagsLower.some(t => t.includes("gluten"));
    const matchesHalal = !dietHalal || tagsLower.some(t => t.includes("halal"));

    return matchesSearch && matchesCategory && matchesBudget && matchesVegan && matchesGlutenFree && matchesHalal;
  });

  return (
    <div id="food-ai-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left Column: Restaurants, Filters & Food Grid (8 Cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Restaurants Quick Picker Cards with ratings & Wait time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STADIUM_RESTAURANTS.map((rest) => (
            <button
              key={rest.id}
              onClick={() => setSelectedRestaurantId(rest.id)}
              className={`border rounded-2xl p-4 text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${
                selectedRestaurantId === rest.id
                  ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-400"
                  : "bg-white border-gray-200 hover:bg-slate-50"
              }`}
            >
              <div>
                <span className="block text-xs font-black text-slate-800 tracking-tight leading-tight">{rest.name}</span>
                <span className="text-[10px] text-slate-400 block mt-1 leading-normal truncate">{rest.desc}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-150 text-[10px] font-mono">
                <span className="flex items-center gap-0.5 font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {rest.rating}
                </span>
                <span className="font-extrabold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded-md">
                  {rest.waitTime}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Dietary Filters & Search Bar */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search meals, snacks, or drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto">
              {["ALL", "Meals", "Snacks", "Drinks", "Sweets"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white font-extrabold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Diet & Budget Grid */}
          <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Dietary Guidelines:</span>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={dietVegan} 
                  onChange={(e) => setDietVegan(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Vegan / Vegetarian</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={dietGlutenFree} 
                  onChange={(e) => setDietGlutenFree(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Gluten-Free</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={dietHalal} 
                  onChange={(e) => setDietHalal(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Halal Certified</span>
              </label>
            </div>

            {/* Budget Selector */}
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Max Price:</span>
              <span className="font-mono font-black text-indigo-600">${budgetMax.toFixed(2)}</span>
              <input
                type="range"
                min="4"
                max="15"
                step="0.5"
                value={budgetMax}
                onChange={(e) => setBudgetMax(parseFloat(e.target.value))}
                className="w-24 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenuItems.map((item) => {
            const inCartQty = cart[item.id] || 0;
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3 transition-all hover:shadow-md hover:border-indigo-100">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-sans font-black text-slate-800 text-xs">
                      {item.name}
                    </h5>
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg border border-gray-150">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <button
                    onClick={() => {
                      onAskAura(`Analyze ingredients and dietary allergens (such as nut-free, dairy, or calories index) for the: ${item.name}.`);
                    }}
                    className="text-[9px] font-mono text-indigo-500 hover:text-indigo-600 underline font-black cursor-pointer"
                  >
                    Allergen Info &rarr;
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
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add To Cart
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
      <div className="lg:col-span-4 space-y-4">
        
        {/* Placed order status tracker card */}
        {activeOrder && (
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-5 shadow-sm space-y-3 animate-[slideUp_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-extrabold">Active Kitchen Order</span>
              <span className="text-[10px] font-mono bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                {activeOrder.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-semibold leading-relaxed">
              <p>ID: <strong className="font-mono font-bold">{activeOrder.id}</strong></p>
              <p>Delivery seat: <strong className="text-indigo-600">{activeOrder.deliverySeat}</strong></p>
              <p className="text-[11px] text-slate-500">Stay in your seat! Our runner is cooking and dispatching your items directly to you.</p>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onAskAura(`Check exact real-time preparing progress or ETA for my hot food order: ${activeOrder.id}.`)}
                  className="w-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] py-1.5 rounded-lg transition-all text-center cursor-pointer"
                >
                  Ask Progress Progress
                </button>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  New Order
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h4 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              Active Dining Cart
            </h4>
            {cartItems.length > 0 && (
              <button onClick={handleClearCart} className="text-[10px] font-mono text-slate-400 hover:text-rose-600 underline font-bold cursor-pointer">
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length > 0 ? (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="divide-y divide-gray-100 max-h-44 overflow-y-auto pr-1">
                {cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">${item.price.toFixed(2)} x {quantity}</span>
                    </div>
                    <span className="font-mono font-black text-slate-800">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order Seat Details */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Seat Location (Direct Delivery Point)</label>
                  <input
                    type="text"
                    required
                    value={deliverySeat}
                    onChange={(e) => setDeliverySeat(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-bold"
                  />
                  <p className="text-[9px] text-slate-400 font-medium leading-none mt-1">Our seat runner will walk right to this row/seat.</p>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Cooking Requests / Notes</label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. no bacon, extra dipping sauce"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 font-mono text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                  <span>In-Seat Delivery Fee</span>
                  <span>$0.00 (Free Ref)</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t border-gray-200 pt-2 mt-1">
                  <span>Grand Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  <span>{orderError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPlacing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isPlacing ? "Placing Order..." : `Place Order ($${cartTotal.toFixed(2)})`}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-semibold space-y-2">
              <span className="block text-3xl">🍿</span>
              <span>Your active cart is empty. Add hot food from the menu!</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
