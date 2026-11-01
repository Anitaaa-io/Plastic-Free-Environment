import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  HelpCircle,
  Recycle,
  Shield,
  Calendar,
  Flame,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AwarenessTips = () => {
  // 30-day challenge state
  const [completedDays, setCompletedDays] = useState([1, 2, 3]);

  const toggleDay = (day) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  const fiveRs = [
    {
      r: '1. REFUSE',
      subtitle: 'The First Line of Defense',
      desc: 'Politely refuse single-use polybags at grocery stores, say no to plastic drinking straws, and decline wrapped marketing flyers.',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200'
    },
    {
      r: '2. REDUCE',
      subtitle: 'Minimalist Consumption',
      desc: 'Buy in bulk using your own containers. Select loose local vegetables in Narasaraopet markets rather than pre-wrapped plastic trays.',
      color: 'bg-teal-50 text-teal-900 border-teal-200'
    },
    {
      r: '3. REUSE',
      subtitle: 'Extend the Lifecycle',
      desc: 'Carry your durable steel water bottle daily. Reuse sturdy containers, biscuit tins, and glass condiment jars for dry grain storage.',
      color: 'bg-sky-50 text-sky-900 border-sky-200'
    },
    {
      r: '4. REPURPOSE',
      subtitle: 'Creative Upcycling',
      desc: 'Transform damaged plastic buckets into garden planters, composting bins, or seedling trays for home gardening.',
      color: 'bg-amber-50 text-amber-900 border-amber-200'
    },
    {
      r: '5. RECYCLE',
      subtitle: 'The Last Resort',
      desc: 'Never burn plastic! Clean and dry all recyclable polymers (PET, HDPE, PP) and hand them over to municipal collectors or local recyclers.',
      color: 'bg-purple-50 text-purple-900 border-purple-200'
    },
  ];

  const challengeTasks = [
    "Day 1: Carry your own cloth tote for all errands",
    "Day 2: Refuse single-use plastic straws and plastic stirrers",
    "Day 3: Drink only from a reusable steel or copper bottle",
    "Day 4: Buy groceries from local vendors with zero polybags",
    "Day 5: Pack your lunch/snacks in a stainless steel box",
    "Day 6: Inspect your bathroom and switch to a bamboo toothbrush",
    "Day 7: Segregate household waste into wet (green) and dry (blue)",
    "Day 8: Politely decline plastic cutlery during takeout orders",
    "Day 9: Replace plastic kitchen sponge with natural coconut coir",
    "Day 10: Educate 2 classmates or colleagues on microplastics",
    "Day 11: Switch from liquid shower gel bottles to paper-wrapped soap bars",
    "Day 12: Collect dry plastic wrappers and send them for recycling",
    "Day 13: Stop using plastic cling wrap; use steel lids or plates",
    "Day 14: Carry a handkerchief instead of buying plastic-packed wet wipes",
    "Day 15: Visit a local grocery store with cotton grain pouches",
    "Day 16: Pick up 5 pieces of littered plastic in your street or campus",
    "Day 17: Say no to plastic-wrapped tea/coffee cups",
    "Day 18: Encourage your local shopkeeper to provide cloth bag alternatives",
    "Day 19: Check your wardrobe and avoid fast fashion 100% polyester clothes",
    "Day 20: Clean and store 10 plastic milk pouches for scrap recycling",
    "Day 21: Share the Plastic-Free Pledge link with your family group",
    "Day 22: Carry a reusable metal spoon in your backpack",
    "Day 23: Report a roadside plastic litter spot on this platform",
    "Day 24: Store leftover food in glass or ceramic bowls",
    "Day 25: Attend or volunteer for a local cleanup event",
    "Day 26: Gift a reusable jute tote bag to a neighbor or friend",
    "Day 27: Audit your kitchen pantry for unnecessary plastic wraps",
    "Day 28: Drink fresh coconut water without plastic straw",
    "Day 29: Log your daily plastic-free actions on the Eco Tracker",
    "Day 30: Celebrate 1 month of conscious zero-plastic living!"
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Leaf className="w-4 h-4" />
              <span>Zero-Waste Guidelines & Habits</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Awareness & Everyday Tips
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Master the 5 R’s of zero waste and take on our 30-Day Plastic-Free Challenge to build lifelong sustainable habits.
            </p>
          </div>
        </div>
      </section>

      {/* The 5 R's Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
            Core Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            The 5 R’s of Plastic Reduction
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Prioritize from top to bottom. Recycling is essential, but refusing is the most effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {fiveRs.map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border ${item.color} shadow-sm flex flex-col justify-between`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75 mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-lg font-black tracking-tight mb-2">
                  {item.r}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 30-Day Plastic-Free Challenge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-eco space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Interactive Habit Builder</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                30-Day Plastic-Free Challenge
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Click on each day once you complete the prompt. Build your streak!
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {completedDays.length} / 30
              </span>
              <p className="text-[11px] text-slate-400 font-semibold">Days Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {challengeTasks.map((task, i) => {
              const dayNum = i + 1;
              const isDone = completedDays.includes(dayNum);
              return (
                <div
                  key={i}
                  onClick={() => toggleDay(dayNum)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs leading-snug">{task}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/eco-tracker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors"
            >
              <span>Log These Activities to Earn Eco Points</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AwarenessTips;

