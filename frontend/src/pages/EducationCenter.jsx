import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Recycle,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  Droplet,
  Fish,
  Trees,
  Award
} from 'lucide-react';

const RESIN_DATA = [
  {
    code: 1,
    acronym: "PET / PETE",
    name: "Polyethylene Terephthalate",
    color: "emerald",
    recyclability: "High (Most commonly recycled)",
    safety: "Caution (Single-use only)",
    temperature: "Up to 70°C",
    items: ["Water & soft drink bottles", "Salad dressing containers", "Cooking oil bottles", "Peanut butter jars"],
    description: "Clear, tough, and shatterproof. Prone to bacterial accumulation and antimony leaching when exposed to heat, sun, or repeated washing.",
    ecoTip: "Never reuse PET water bottles under the sun or in cars! Always crush and drop into the blue dry recycling bin."
  },
  {
    code: 2,
    acronym: "HDPE",
    name: "High-Density Polyethylene",
    color: "blue",
    recyclability: "High (Easily remolded into pipes & bins)",
    safety: "Safe (Low leaching risk)",
    temperature: "Up to 120°C",
    items: ["Milk jugs", "Detergent & shampoo bottles", "Motor oil containers", "Bleach bottles"],
    description: "Translucent, stiff plastic known for exceptional chemical resistance and high strength-to-density ratio.",
    ecoTip: "Rinse bottles thoroughly before recycling. Sturdy HDPE containers can safely be reused for cleaning products."
  },
  {
    code: 3,
    acronym: "PVC",
    name: "Polyvinyl Chloride",
    color: "red",
    recyclability: "Very Low (< 1% globally)",
    safety: "Toxic (Contains Phthalates & Dioxins)",
    temperature: "Up to 60°C",
    items: ["Plumbing pipes", "Electrical wire insulation", "Faux leather", "Vinyl flooring", "Shower curtains"],
    description: "Known in environmental science as the 'Poison Plastic'. Releases carcinogenic dioxins upon incineration and leaches toxic plasticizers.",
    ecoTip: "Strictly avoid heating or storing food in PVC wraps. Choose silicone or beeswax food covers."
  },
  {
    code: 4,
    acronym: "LDPE",
    name: "Low-Density Polyethylene",
    color: "amber",
    recyclability: "Low to Moderate (Clogs sorting gear)",
    safety: "Relatively Safe",
    temperature: "Up to 80°C",
    items: ["Polybags & grocery carry bags", "Bread wrappers", "Squeezable sauce bottles", "Shrink wrap film"],
    description: "Flexible, tough, and chemically inert. The primary culprit behind choked rural stormwater drains and ingested by cattle in open dumps.",
    ecoTip: "Say NO to carry bags! Carry your own washable jute or cotton bag for every grocery and market trip."
  },
  {
    code: 5,
    acronym: "PP",
    name: "Polypropylene",
    color: "teal",
    recyclability: "Moderate (Recycled into brooms & bins)",
    safety: "Safe (Microwave-safe variants)",
    temperature: "Up to 135°C",
    items: ["Curd & yogurt tubs", "Medicine bottles", "Straw caps", "Microwaveable meal boxes"],
    description: "High thermal resistance with good fatigue resistance. Safer for hot foods than PET or Polystyrene.",
    ecoTip: "Wash and reuse sturdy PP containers for storing spices, buttons, or gardening seedlings."
  },
  {
    code: 6,
    acronym: "PS",
    name: "Polystyrene / Styrofoam",
    color: "rose",
    recyclability: "Very Low (Economically unfeasible)",
    safety: "Hazardous (Styrene leaching)",
    temperature: "Up to 80°C",
    items: ["Disposable foam tea cups", "Egg cartons", "Takeaway food clamshells", "Packaging thermocol"],
    description: "Lightweight, fragile foam that breaks into thousands of micro-particles. Leaches neurotoxic styrene into hot soups and beverages.",
    ecoTip: "Never drink hot tea or coffee from thermocol cups. Insist on ceramic, steel cups, or clay kulhads."
  },
  {
    code: 7,
    acronym: "OTHER",
    name: "Mixed Plastics, Polycarbonate & Bioplastics",
    color: "purple",
    recyclability: "Extremely Low",
    safety: "Variable (May contain BPA)",
    temperature: "Varies",
    items: ["Multi-layer chip packets (MLP)", "Polycarbonate water jugs", "Nylon fibers", "PLA bioplastics"],
    description: "A catch-all category for multilayer composite packaging and newer biopolymers. Almost impossible to recycle in municipal streams.",
    ecoTip: "Avoid buying multi-layer metallized chip packets when possible. Opt for freshly cooked local snacks."
  }
];

const FIVE_RS = [
  {
    step: "1",
    title: "REFUSE",
    action: "Say NO upfront to single-use plastics.",
    details: "The most impactful step in waste prevention. Politely decline disposable polybags, plastic cutlery, plastic straws, and packaged promotional giveaways.",
    impact: "Prevents waste before it ever enters production or consumption cycles."
  },
  {
    step: "2",
    title: "REDUCE",
    action: "Curtail overall packaging and consumption.",
    details: "Buy groceries and grains in loose bulk. Select concentrates that require minimal packaging. Choose bar soaps instead of plastic bottled body washes.",
    impact: "Shrinks your personal carbon and plastic waste footprint by up to 60%."
  },
  {
    step: "3",
    title: "REUSE",
    action: "Switch to durable, refillable essentials.",
    details: "Carry a stainless steel or copper water flask. Keep durable jute shopping bags in your vehicle or backpack. Store food in glass jars and stainless steel tiffins.",
    impact: "A single reusable bag eliminates over 300 single-use polybags annually."
  },
  {
    step: "4",
    title: "REPURPOSE",
    action: "Upcycle discarded items creatively before disposal.",
    details: "Convert plastic bottles into hanging herb planters or drip irrigation stakes for agriculture. Pack dense plastic films into 'eco-bricks' for garden borders.",
    impact: "Diverts solid plastic waste from waterways and open dumpsites."
  },
  {
    step: "5",
    title: "RECYCLE",
    action: "Clean, segregate, and route to verified recycling facilities.",
    details: "Always rinse milk pouches and food tubs before binning. Deliver clean dry plastics to local recyclers (kabadiwalas) or municipal collection centers.",
    impact: "Reduces virgin petroleum extraction and lowers energy consumption by 70%."
  }
];

const EducationCenter = () => {
  const [selectedResin, setSelectedResin] = useState(1);
  const [activeTab, setActiveTab] = useState('resin'); // 'resin' | '5rs' | 'segregation' | 'microplastics'

  const currentResin = RESIN_DATA.find((r) => r.code === selectedResin);

  return (
    <div className="min-h-screen bg-[#f7faf8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Environmental Science & Waste Literacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif tracking-tight">
            Environmental Education Center
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Master plastic resin codes 1–7, the 5 R’s framework, proper segregation protocols, and the scientific impact of microplastics on our ecosystems.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('resin')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'resin'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resin Codes (1–7)</span>
          </button>

          <button
            onClick={() => setActiveTab('5rs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === '5rs'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Recycle className="w-4 h-4" />
            <span>The 5 R's Framework</span>
          </button>

          <button
            onClick={() => setActiveTab('segregation')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'segregation'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Waste Segregation Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('microplastics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'microplastics'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Microplastics Deep Dive</span>
          </button>
        </div>

        {/* TAB 1: RESIN CODES 1 TO 7 */}
        {activeTab === 'resin' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Resin Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {RESIN_DATA.map((resin) => (
                <button
                  key={resin.code}
                  onClick={() => setSelectedResin(resin.code)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    selectedResin === resin.code
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-lg scale-105'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center text-sm mb-1.5 border border-emerald-300">
                    ♳ {resin.code}
                  </div>
                  <span className="font-extrabold text-xs tracking-tight">{resin.acronym}</span>
                  <span className={`text-[10px] mt-0.5 line-clamp-1 ${selectedResin === resin.code ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {resin.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Resin Deep-Dive Card */}
            {currentResin && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                      #{currentResin.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif">
                          {currentResin.acronym}
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Resin Code #{currentResin.code}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">{currentResin.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                      <span className="text-slate-500 block text-[10px]">Recyclability</span>
                      <span className="font-bold text-slate-800">{currentResin.recyclability}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                      <span className="text-slate-500 block text-[10px]">Safety Profile</span>
                      <span className="font-bold text-slate-800">{currentResin.safety}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-600" />
                      <span>Polymer Characteristics & Impact</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentResin.description}
                    </p>

                    <h3 className="font-bold text-sm text-slate-900 mt-5 mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Common Consumer Applications</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentResin.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-5 rounded-2xl border border-emerald-100">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm mb-2">
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span>Best Practice Recommendation</span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                        {currentResin.ecoTip}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-200/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-800">Need alternatives to this resin?</span>
                      <Link
                        to="/alternatives"
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Alternatives</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: THE 5 R's FRAMEWORK */}
        {activeTab === '5rs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif mb-2">
                The 5 R’s Environmental Hierarchy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                True sustainability begins by eliminating unnecessary consumption. The 5 R framework ranks waste management strategies from highest environmental priority (Refuse) down to final disposal measures (Recycle).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {FIVE_RS.map((r, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-lg flex items-center justify-center mb-3">
                      {r.step}
                    </div>
                    <h3 className="font-extrabold text-base text-emerald-950 mb-1">{r.title}</h3>
                    <p className="text-xs font-bold text-emerald-700 mb-2">{r.action}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{r.details}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 font-medium">
                    <strong>Impact:</strong> {r.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WASTE SEGREGATION GUIDE */}
        {activeTab === 'segregation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Green Bin: Organic */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border-t-8 border-t-emerald-600 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Trees className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Green Bin: Wet Organic</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Biodegradable Kitchen & Garden Waste</p>
                
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Accepted Items:</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 mb-4">
                  <li>• Vegetable and fruit peels</li>
                  <li>• Leftover cooked foods and curries</li>
                  <li>• Tea leaves & coffee grounds</li>
                  <li>• Garden trimmings, leaves, twigs</li>
                  <li>• Eggshells and fruit seeds</li>
                </ul>

                <div className="p-3 rounded-xl bg-emerald-50 text-[11px] text-emerald-950">
                  <strong>Outcome:</strong> Converts into nutrient-rich compost in 45–60 days; keeps moisture out of landfills.
                </div>
              </div>

              {/* Blue Bin: Dry Recyclable */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border-t-8 border-t-blue-600 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Blue Bin: Dry Recyclables</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Clean, Dry Polymers, Paper & Metals</p>
                
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Accepted Items:</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 mb-4">
                  <li>• Rinsed PET water and juice bottles</li>
                  <li>• Cleaned HDPE milk sachets & shampoo bottles</li>
                  <li>• Cardboard packaging & newspapers</li>
                  <li>• Metal beverage and food tins</li>
                  <li>• Glass bottles and clean jars</li>
                </ul>

                <div className="p-3 rounded-xl bg-blue-50 text-[11px] text-blue-950">
                  <strong>CRITICAL RULE:</strong> Plastics must be 100% dry and free from food grease to avoid contaminating recycling bales.
                </div>
              </div>

              {/* Red Bin: Hazardous */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border-t-8 border-t-red-600 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Red Bin: Domestic Hazard</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Sanitary, Medical & Chemical Toxic Items</p>
                
                <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">Items for Red Bin:</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 mb-4">
                  <li>• Sanitary napkins & diapers (wrapped)</li>
                  <li>• Expired medicines & syringes</li>
                  <li>• Alkaline and lithium batteries</li>
                  <li>• CFL bulbs and tube lights</li>
                  <li>• Pesticide and chemical plastic containers</li>
                </ul>

                <div className="p-3 rounded-xl bg-red-50 text-[11px] text-red-950">
                  <strong>Safe Routing:</strong> Incinerated or routed to certified hazardous waste treatment facilities.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: MICROPLASTICS DEEP DIVE */}
        {activeTab === 'microplastics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Fish className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Marine & Freshwater Trophic Cascade</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Microplastics (particles under 5mm) are either manufactured directly (microbeads) or fragment from macroplastics via UV photo-oxidation and wave abrasion.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <strong>False Satiety:</strong> Plankton, fish, and seabirds ingest microplastics, mistaking them for food. The plastic fills their gut without caloric value, resulting in fatal starvation.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <strong>Bioaccumulation:</strong> Hydrophobic toxic chemicals (DDT, PCBs) absorb onto microplastic surfaces in water, concentrating contaminants up the food chain to human seafood consumers.
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Trees className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Soil & Agricultural Degradation (Palnadu District)</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Our field survey at Lingamguntla Agraharam highlighted extensive plastic film litter in rural irrigation canals and farmlands.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <strong>Root Barrier:</strong> Thin polybag fragments create physical barriers in soil, impeding root proliferation and reducing soil water retention.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <strong>Cattle Ingestion:</strong> Foraging stray cows ingest kilograms of plastic bags from open dump yards, leading to rumen compaction, metabolic distress, and premature mortality.
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Action CTA Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold font-serif">Be Part of the Verified Solution</h3>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                  Take the verified plastic-free commitment, track your daily eco points, or report plastic hotspots in your neighborhood today.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/pledge"
                  className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  Take Digital Pledge
                </Link>
                <Link
                  to="/waste-reports"
                  className="px-5 py-2.5 bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-500/40 rounded-xl text-xs sm:text-sm font-bold transition-all"
                >
                  Report Waste Dump
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default EducationCenter;

