import React, { useState } from 'react';
import {
  ShoppingBag,
  Coffee,
  Utensils,
  Package,
  Sparkles,
  Check,
  ShieldCheck,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Alternatives = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'shopping', name: 'Shopping & Groceries' },
    { id: 'drinking', name: 'Water & Beverages' },
    { id: 'dining', name: 'Dining & Kitchen' },
    { id: 'packaging', name: 'Storage & Packaging' },
  ];

  const items = [
    {
      category: 'shopping',
      plasticItem: 'Single-Use Polythene Carry Bag',
      alternative: 'Jute & Cotton Khadi Tote Bags',
      material: 'Organic Jute / Cotton Canvas',
      durability: '2+ Years (Reusable 500+ times)',
      lifespan: 'Fully Biodegradable in 3-6 months',
      savings: 'Replaces ~350 plastic bags per person annually',
      benefits: ['Washable and heavy-weight load bearing', 'Supports rural Indian weavers & artisans', 'Zero chemical leaching in food items'],
    },
    {
      category: 'drinking',
      plasticItem: 'PET Mineral Water Bottle',
      alternative: 'Stainless Steel & Copper Flask',
      material: 'Food-Grade 304 Steel / Pure Copper',
      durability: '10+ Years (Indefinite)',
      lifespan: '100% Recyclable high-value metal',
      savings: 'Avoids ~180 single-use bottles per person annually',
      benefits: ['No microplastics leaching into drinking water', 'Maintains temperature for 12-24 hours', 'Traditional Ayurvedic health benefits of copper'],
    },
    {
      category: 'dining',
      plasticItem: 'Plastic Straw & Stirrer',
      alternative: 'Bamboo & Stainless Steel Straws',
      material: 'Natural Bamboo Shoot / Steel',
      durability: 'Reusable (Comes with cleaning brush)',
      lifespan: 'Bamboo is compostable; Steel is infinite',
      savings: 'Prevents choking hazards for marine and terrestrial animals',
      benefits: ['Chemical-free natural finish', 'Dishwasher and hot-water safe', 'Compact travel pouch included'],
    },
    {
      category: 'dining',
      plasticItem: 'Thermocol / Plastic Disposable Plates',
      alternative: 'Areca Palm Leaf & Sal Leaf Plates',
      material: 'Naturally Shed Areca Nut Palm Sheaths',
      durability: 'Single-use or light re-use',
      lifespan: 'Naturally composts in soil within 45 days',
      savings: 'Eliminates carcinogenic styrenes from hot food contact',
      benefits: ['Microwave safe and water resistant', 'No trees cut—made from naturally fallen leaves', 'Enriches agricultural soil as organic mulch'],
    },
    {
      category: 'packaging',
      plasticItem: 'Plastic Cling Film & Poly Wraps',
      alternative: 'Beeswax Wraps & Banana Leaves',
      material: 'Organic Cotton coated with Natural Beeswax',
      durability: 'Washable and reusable for 1 year',
      lifespan: '100% Home compostable',
      savings: 'Replaces ~25 rolls of plastic cling film',
      benefits: ['Naturally antibacterial and antifungal', 'Self-adhesive from hands warmth', 'Keeps breads, cheese, and vegetables fresh longer'],
    },
    {
      category: 'packaging',
      plasticItem: 'Plastic Food Takeaway Boxes',
      alternative: 'Traditional Stainless Steel Dabba / Tiffin',
      material: 'Grade 304 Stainless Steel',
      durability: 'Generational (Decades)',
      lifespan: 'Infinitely recyclable',
      savings: 'Eliminates 120+ takeaway containers per year',
      benefits: ['Zero phthalates or BPA hormone disruption', 'Leak-proof silicone seal ring', 'Classic Indian tiffin heritage design'],
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(it => it.category === activeCategory);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Sustainable Substitutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Eco-Friendly Alternatives Catalog
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Replacing single-use plastics with natural, circular, and durable materials: glass, food-grade metal, bamboo, jute, and compostable organics.
            </p>
          </div>
        </div>
      </section>

      {/* Six Easy Steps Infographic Showcase (From Slide 13) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-eco">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Action Plan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                6 Simple Steps to a Plastic-Free Lifestyle
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                As demonstrated in our community outreach at ZPH School, transitioning away from plastics does not require radical sacrifices—it begins with simple, everyday habit swaps.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "1. Bring your own shopping bag (Cotton / Jute tote)",
                  "2. Carry a refillable steel or copper water flask",
                  "3. Bring your own reusable mug / tiffin container",
                  "4. Say NO to plastic straws and disposable cutlery",
                  "5. Choose unpacked whole fruits & vegetables",
                  "6. Share awareness with your school and neighborhood"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80 text-xs sm:text-sm font-semibold text-slate-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src="/images/six_easy_steps_infographic.jpg"
                  alt="Six Easy Steps Infographic"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Catalog Filters & Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Material Replacement Guide
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a category to inspect durable substitutes for common plastic waste items.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === c.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="eco-card bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                {/* Header: Plastic Item vs Eco Alt */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-red-500 line-through block">
                      Replace: {item.plasticItem}
                    </span>
                    <h4 className="text-lg font-extrabold text-emerald-950 mt-0.5">
                      {item.alternative}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    Eco Certified
                  </span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Composition:</span>
                    <strong className="text-slate-700">{item.material}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Durability:</span>
                    <strong className="text-slate-700">{item.durability}</strong>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">Key Advantages:</span>
                  {item.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>{item.savings}</span>
                <Link to="/pledge" className="font-bold underline underline-offset-2 hover:text-emerald-900">
                  Pledge this swap →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Alternatives;

