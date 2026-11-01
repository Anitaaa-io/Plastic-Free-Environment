import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Layers,
  HeartPulse,
  Fish,
  Flame,
  Globe,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PlasticPollution = () => {
  // Calculator State
  const [bagsPerWeek, setBagsPerWeek] = useState(5);
  const [bottlesPerWeek, setBottlesPerWeek] = useState(3);
  const [containersPerWeek, setContainersPerWeek] = useState(4);
  const [cutleryPerWeek, setCutleryPerWeek] = useState(6);

  // Calculations
  const yearlyItems = (bagsPerWeek + bottlesPerWeek + containersPerWeek + cutleryPerWeek) * 52;
  const yearlyWeightKg = (
    (bagsPerWeek * 8 + bottlesPerWeek * 25 + containersPerWeek * 30 + cutleryPerWeek * 5) * 52 / 1000
  ).toFixed(1);
  const crudeOilLiters = (yearlyWeightKg * 2.0).toFixed(1); // Approx 2L oil per 1kg plastic
  const microplasticsPieces = (yearlyWeightKg * 1250).toLocaleString();

  const degradationData = [
    { item: 'Single-Use Plastic Bag', time: '20 to 50 Years', hazard: 'High ingestion risk for cattle and wildlife' },
    { item: 'Plastic Straw & Stirrer', time: '200 Years', hazard: 'Chokes marine and avian respiratory systems' },
    { item: 'PET Beverage Bottle', time: '450 Years', hazard: 'Slowly fragments into microscopic particles' },
    { item: 'Disposable Diaper / Sanitary Wrap', time: '500 Years', hazard: 'Non-degradable synthetic polyolefin liners' },
    { item: 'Nylon Fishing Net / Line', time: '600 Years', hazard: 'Ghost fishing and marine habitat destruction' },
    { item: 'Styrofoam / Thermocol Cup', time: 'Never (Infinite)', hazard: 'Leaches styrene; breaks into toxic micro-beads' },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Scientific & Environmental Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Understanding Plastic Pollution
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Why synthetic petroleum-based plastics resist decomposition, disrupt rural ecosystems, and pose severe hazards to community health.
            </p>
          </div>
        </div>
      </section>

      {/* Definition & Nature of Plastics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-eco">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Definition & Properties
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              What is Plastic Pollution?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Plastic pollution is the excessive build-up of synthetic plastic products in the environment—carry bags, bottles, packaging film, and secondary microplastics—that persist for centuries because natural microorganisms lack the enzymes required to break down synthetic carbon-carbon polymer chains.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Synthesized primarily from petroleum hydrocarbons, plastics do not decompose. Instead, UV radiation and mechanical abrasion weather them down into microplastics (&lt; 5mm) and nanoplastics, which permeate soil, agricultural runoff, municipal water supplies, and the animal food chain.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-slate-800">Centuries Persistence</h4>
                <p className="text-[10px] text-slate-500">Resists bacterial decay</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-slate-800">Petroleum-Based</h4>
                <p className="text-[10px] text-slate-500">Derived from crude oil</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Layers className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <h4 className="text-xs font-bold text-slate-800">Microplastics</h4>
                <p className="text-[10px] text-slate-500">Enters human food chain</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="/images/pollution_illustration.jpg"
                alt="Plastic Pollution Impact"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Degradation Timeline Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
            Environmental Persistence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            How Long Does Discarded Plastic Last?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Items used for only 5 minutes persist in nature for generations of human life.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-emerald-900 text-white text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Common Disposable Item</th>
                  <th className="py-4 px-6">Decomposition Time</th>
                  <th className="py-4 px-6">Specific Environmental Threat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {degradationData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {row.item}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                      {row.time}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {row.hazard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Harm */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
            Impact Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            The 4 Dimensions of Plastic Damage
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Plastic harms at every single stage: production, consumption, and open disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Land & Water Pollution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uncollected plastics clog roadside drainage culverts, choke rural canals, degrade agricultural soil permeability, and leach microplastics into groundwater aquifers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Fish className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Wildlife & Cattle Hazards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In rural Andhra Pradesh, stray cattle and sheep frequently ingest food waste wrapped in polythene bags, causing rumen impaction, internal starvation, and death.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Climate & Toxic Fumes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open burning of plastics releases carcinogenic dioxins, furans, and black carbon. The global petrochemical plastic cycle consumes ~6% of global oil extraction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Human Health Risks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Additives such as Bisphenol-A (BPA) and phthalates act as endocrine disruptors. Microplastics have now been detected in human bloodstreams, lungs, and breast milk.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Plastic Footprint Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Impact Tool</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Personal Plastic Footprint Calculator</h3>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              Adjust the sliders to estimate your yearly single-use plastic waste generation and see the ecological cost.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Plastic Carry Bags (per week)</span>
                  <span className="text-emerald-300 font-mono text-sm">{bagsPerWeek}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={bagsPerWeek}
                  onChange={(e) => setBagsPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Single-Use PET Bottles (per week)</span>
                  <span className="text-emerald-300 font-mono text-sm">{bottlesPerWeek}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={bottlesPerWeek}
                  onChange={(e) => setBottlesPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Packaged Food Containers / Wrappers (per week)</span>
                  <span className="text-emerald-300 font-mono text-sm">{containersPerWeek}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={containersPerWeek}
                  onChange={(e) => setContainersPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Disposable Cups, Straws & Cutlery (per week)</span>
                  <span className="text-emerald-300 font-mono text-sm">{cutleryPerWeek}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={cutleryPerWeek}
                  onChange={(e) => setCutleryPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

            </div>

            {/* Results Output */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
                Your Estimated Annual Footprint:
              </h4>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs text-slate-500 font-medium">Total Plastic Discarded / Year</span>
                <div className="text-3xl font-black text-emerald-900 mt-0.5">
                  {yearlyWeightKg} <span className="text-base font-semibold">kg</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">{yearlyItems} individual plastic pieces</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Crude Oil Consumed</span>
                  <strong className="text-base text-slate-800 font-mono">{crudeOilLiters} L</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Microplastic Particles</span>
                  <strong className="text-base text-slate-800 font-mono">~{microplasticsPieces}</strong>
                </div>
              </div>

              <Link
                to="/pledge"
                className="block text-center w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-colors"
              >
                Pledge to Reduce This by 80% Today →
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default PlasticPollution;

