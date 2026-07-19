import React, { useState, useEffect } from "react";
import { MenuItem, FoodOrder, OrderItem, UserProfile } from "../types";
import { ShoppingBag, Utensils, CheckCircle, Clock, MapPin, Search, Plus, Minus, Send, Star, AlertCircle, RefreshCw } from "lucide-react";

interface RestaurantsMenuProps {
  profile: UserProfile;
  onOrderPlaced: (order: FoodOrder) => void;
  onAskAura: (prompt: string) => void;
}

const STADIUM_RESTAURANTS = [
  { id: "rest-1", name: "🍔 Stadium Grillhouse", desc: "Premium hand-crafted burgers and crispy flame-grilled tenders", rating: "4.8", loc: "Concourse Sectors 104 & 115" },
  { id: "rest-2", name: "🍕 Arena Slice & Crust", desc: "Traditional brick-oven pizzas, warm jumbo nachos and salty stadium pretzels", rating: "4.6", loc: "South Promenade & Section 112" },
  { id: "rest-3", name: "🥤 AURA Hydration & Brews", desc: "Eco-energy fruit smoothies, unlimited soft drink cups, and local draft beers", rating: "4.9", loc: "East Concourse & Food Court B" }
];

const MENU_ITEMS: MenuItem[] = [
  { id: "item-1", name: "World Cup Burger Combo", price: 14.50, description: "Premium Black Angus beef patty, cheddar cheese, smoked bacon, and dynamic AURA glaze, served with fresh-cut salt fries and soda.", category: "Meals", isAvailable: true, tags: ["Halal Available"] },
  { id: "item-2", name: "Kickoff Beef Hot Dog", price: 7.00, description: "100% kosher beef sausage in a freshly toasted sesame bun, topped with sweet pickle relish and yellow mustard.", category: "Meals", isAvailable: true, tags: ["Halal"] },
  { id: "item-3", name: "Golden Goal Cheese Nachos", price: 9.50, description: "Crispy warm tortilla chips smothered in hot cheddar cheese dip, sliced jalapeños, and fresh pico de gallo salsa.", category: "Snacks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "item-4", name: "Striker Crispy Chicken Tenders", price: 11.00, description: "Four golden crispy white-meat tenders with sweet honey mustard or classic hickory BBQ dipping sauce.", category: "Meals", isAvailable: true, tags: [] },
  { id: "item-5", name: "Pitchside Bavarian Pretzel", price: 5.50, description: "Super-soft giant oven-baked salted pretzel, served warm with a side of zesty honey mustard or cheese sauce.", category: "Snacks", isAvailable: true, tags: ["Vegetarian"] },
  { id: "item-6", name: "Aura Power Super Smoothie", price: 6.50, description: "Antioxidant berry blend, Greek yogurt, spinach, honey, and organic clean energy booster, served in a souvenir cup.", category: "Drinks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "item-7", name: "Stadium Soda (Souvenir Cup)", price: 4.00, description: "Large 32oz commemorative FIFA World Cup 2026 souvenir cup with free unlimited soft drink refills at any automated fountain.", category: "Drinks", isAvailable: true, tags: ["Vegetarian"] },
  { id: "item-8", name: "Championship Butter Popcorn", price: 5.00, description: "Mega-sized bucket of fresh warm kettle corn tossed in real cream butter.", category: "Snacks", isAvailable: true, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "item-9", name: "World Cup Churro Basket", price: 6.00, description: "Three traditional Spanish-style fried churros dusted in sweet cinnamon sugar, served with a hot dark chocolate dip.", category: "Sweets", isAvailable: true, tags: ["Vegetarian"] }
];

export const RestaurantsMenu: React.FC<RestaurantsMenuProps> = ({ profile, onOrderPlaced, onAskAura }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(STADIUM_RESTAURANTS[0].id);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "Meals" | "Snacks" | "Drinks" | "Sweets">("ALL");
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Checkout details form
  const [custName, setCustName] = useState(profile.name || "");
  const [custPhone, setCustPhone] = useState(profile.phone || "");
  const [deliverySeat, setDeliverySeat] = useState("Sec 112, Row L, Seat 14");
  const [orderNotes, setOrderNotes] = useState("");
  
  // Placement State
  const [isPlacing, setIsPlacing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FoodOrder | null>(null);
  const [orderError, setOrderError] = useState("");

  // Sync profile when it updates
  useEffect(() => {
    if (profile.name) setCustName(profile.name);
    if (profile.phone) setCustPhone(profile.phone);
  }, [profile]);

  // Fetch the active order's latest status from the server periodically if active
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

  // Restructure items in cart
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

  const handleClearCart = () => {
    setCart({});
  };

  // Place Order on the Express server!
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    if (!custName.trim() || !deliverySeat.trim()) {
      setOrderError("Please enter your name and seat delivery location.");
      return;
    }

    setIsPlacing(true);
    setOrderError("");

    try {
      const postBody = {
        customerName: custName,
        customerPhone: custPhone,
        deliverySeat: deliverySeat,
        notes: orderNotes,
        total: cartTotal,
        items: cartItems.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price
        }))
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody)
      });

      if (!response.ok) {
        throw new Error("The stadium register rejected your order. Please retry.");
      }

      const createdOrder = await response.json();
      setActiveOrder(createdOrder);
      onOrderPlaced(createdOrder);
      setCart({}); // Clear active cart
      setOrderNotes("");
    } catch (err: any) {
      setOrderError(err.message || "An error occurred while transmitting your order.");
    } finally {
      setIsPlacing(false);
    }
  };

  // Filter products
  const currentRest = STADIUM_RESTAURANTS.find(r => r.id === selectedRestaurant);
  const filteredItems = MENU_ITEMS.filter(item => {
    // Basic category filter
    if (activeCategory !== "ALL" && item.category !== activeCategory) return false;
    
    // Simple mock association to restaurants to give visual depth
    if (selectedRestaurant === "rest-1" && !["Meals", "Drinks"].includes(item.category)) {
      // Stadium Grillhouse focuses on meals/drinks
      if (item.category === "Sweets") return false;
    }
    if (selectedRestaurant === "rest-2" && !["Snacks", "Meals", "Sweets"].includes(item.category)) {
      // Arena Crust focuses on slices, pretzels, nachos
      if (item.category === "Drinks") return false;
    }

    // Search text query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div id="restaurants-menu-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.2s_ease-out] text-slate-800">
      
      {/* Left Area: Restaurants Catalog & Menu Items */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Restaurants Selection Row */}
        <div className="bg-white border border-gray-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Utensils className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-sans font-extrabold text-sm text-slate-800">World Cup Dining Outlets</h4>
              <p className="text-xs text-slate-400 font-medium">Browse menus, check crowd waits, and order directly to your seat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STADIUM_RESTAURANTS.map((rest) => (
              <button
                key={rest.id}
                onClick={() => {
                  setSelectedRestaurant(rest.id);
                  setActiveCategory("ALL");
                }}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRestaurant === rest.id
                    ? "bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-400 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-black text-xs text-slate-800">{rest.name}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> {rest.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mt-1.5">{rest.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold mt-3 border-t border-gray-100 pt-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{rest.loc.split("&")[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Search & Categorized Food Card Grid */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto shrink-0 max-w-full">
              {(["ALL", "Meals", "Snacks", "Drinks", "Sweets"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search food, soft drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const itemQty = cart[item.id] || 0;
              return (
                <div key={item.id} className="border border-gray-200 p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-400 transition-colors shadow-xs relative overflow-hidden bg-white">
                  
                  {/* Food visual highlights */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <h5 className="font-sans font-extrabold text-sm text-slate-800 leading-tight">{item.name}</h5>
                      <span className="text-sm font-mono font-black text-indigo-600 shrink-0">${item.price.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.description}</p>
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order controls */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">{item.category}</span>
                    
                    {itemQty > 0 ? (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-150 rounded-xl p-1">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="bg-white hover:bg-gray-100 text-indigo-700 p-1.5 rounded-lg border border-gray-200 cursor-pointer shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-black text-xs text-indigo-800 px-1">{itemQty}</span>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="bg-white hover:bg-gray-100 text-indigo-700 p-1.5 rounded-lg border border-gray-200 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="col-span-2 text-center py-8 text-slate-400 text-xs font-medium">
                No items found match current filters or searches.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Area: Cart & Interactive Seat Delivery checkout or Live Order Status Tracker */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Placed Order Status Monitor */}
        {activeOrder && (
          <div className="bg-indigo-950 text-white border border-indigo-900 p-5 rounded-3xl shadow-md space-y-4 animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-indigo-900 pb-2.5">
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Live Stadium Order Tracker
              </span>
              <span className="text-[10px] font-mono bg-indigo-900 border border-indigo-800 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                {activeOrder.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-900 p-2.5 rounded-2xl text-indigo-300">
                <ShoppingBag className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <span className="block text-[10px] text-indigo-300 font-mono uppercase">Delivery Location</span>
                <span className="font-sans font-extrabold text-xs text-white block">{activeOrder.deliverySeat}</span>
              </div>
            </div>

            {/* Stepper Status tracker */}
            <div className="relative py-2 space-y-3 font-semibold text-xs">
              {[
                { label: "Order Received", desc: "Added to the stadium register queue", key: "pending", order: 1 },
                { label: "Preparing Food", desc: "Chefs are packing hot food combos", key: "preparing", order: 2 },
                { label: "En-Route to Seat", desc: "AURA Runner is carrying your order", key: "completed", order: 3 },
                { label: "Safely Delivered", desc: "Enjoy your stadium meal!", key: "delivered", order: 4 }
              ].map((step, idx) => {
                const currentStatusOrder = 
                  activeOrder.status === "pending" ? 1 : 
                  activeOrder.status === "preparing" ? 2 : 
                  activeOrder.status === "completed" ? 3 : 4;
                
                const isPassed = currentStatusOrder >= step.order;
                const isCurrent = activeOrder.status === step.key;

                return (
                  <div key={idx} className="flex gap-2.5 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-black z-10 transition-colors ${
                        isCurrent ? "bg-indigo-600 border-white text-white animate-pulse" :
                        isPassed ? "bg-emerald-500 border-emerald-400 text-slate-900" : "bg-indigo-950 border-indigo-800 text-indigo-400"
                      }`}>
                        {isPassed ? "✓" : step.order}
                      </div>
                      {idx < 3 && <div className={`w-0.5 h-6 z-0 ${isPassed ? "bg-emerald-500" : "bg-indigo-900"}`}></div>}
                    </div>
                    <div>
                      <span className={`block text-xs font-extrabold ${isCurrent ? "text-white" : isPassed ? "text-slate-300" : "text-indigo-400"}`}>
                        {step.label}
                      </span>
                      <p className="text-[10px] text-indigo-300 leading-none mt-0.5 font-medium">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-indigo-900 pt-3 text-center space-y-2.5">
              <p className="text-[11px] text-indigo-300 italic font-medium leading-relaxed">
                "Order is fully synced! Changing your role in the control panel to 'staff' or 'admin' unlocks the kitchen employees dashboard."
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAskAura(`Analyze my order ${activeOrder.id} containing ${activeOrder.items.map(i=>i.name).join(", ")} for calories, allergens and nutritional value.`)}
                  className="bg-indigo-900 hover:bg-indigo-850 border border-indigo-800 text-indigo-200 text-[10px] font-bold py-1.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  🥗 Allergen Info
                </button>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="bg-indigo-800 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Order Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Cart View */}
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
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">${item.price.toFixed(2)} each</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-slate-500 text-[11px] font-bold">Qty {quantity}</span>
                      <span className="font-mono font-black text-slate-800">${(item.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order form credentials */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Leo Messi"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 000-0000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Seat Delivery Point</label>
                  <input
                    type="text"
                    required
                    value={deliverySeat}
                    onChange={(e) => setDeliverySeat(e.target.value)}
                    placeholder="e.g. Sec 112, Row L, Seat 14"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-bold"
                  />
                  <p className="text-[9px] text-slate-400 font-medium leading-none mt-1">Order will be dispatched directly to your exact seat location.</p>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Cooking Requests / Notes</label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. no pickles, extra cheese"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 font-mono text-xs space-y-1.5 shadow-inner">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                  <span>AURA Delivery Fee</span>
                  <span>$0.00 (Promo)</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t border-gray-200 pt-2 mt-1.5">
                  <span>Grand Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1 leading-normal font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {orderError}
                </p>
              )}

              <button
                type="submit"
                disabled={isPlacing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isPlacing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Place Seat Delivery Order
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold flex flex-col items-center justify-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-200 stroke-[1.5]" />
              <div>
                <span>Cart is empty</span>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 max-w-[180px] leading-normal">Select a restaurant, configure menu items, and add them to order.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
