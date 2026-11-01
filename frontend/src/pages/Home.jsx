import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { overviewService } from '../services/api';
import {
  Leaf,
  ShieldAlert,
  Award,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  HeartHandshake,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
  Bot,
  Calculator,
  RefreshCw
} from 'lucide-react';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Plastic Footprint Estimator State
  const [bagsPerWeek, setBagsPerWeek] = useState(6);
  const [bottlesPerWeek, setBottlesPerWeek] = useState(4);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await overviewService.getOverview();
        setData(res.data);
      } catch (err) {
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const stats = data?.stats || {
    total_users: 6,
    total_pledges: 6,
    total_reports: 5,
    resolved_reports: 2,
    total_events: 3,
    total_volunteers: 5,
    total_plastic_saved_kg: 455.5
  };

  // Footprint Calculation:
  // Polybag ~ 30g, PET bottle ~ 45g
  const yearlyBags = bagsPerWeek * 52;
  const yearlyBottles = bottlesPerWeek * 52;
  const yearlyPlasticKg = ((yearlyBags * 30 + yearlyBottles * 45) / 1000).toFixed(1);
  const oilSavedLitres = (yearlyPlasticKg * 2.5).toFixed(1);

  return (
    <div className="space-y-20 pb-20 bg-[#f7faf8]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Glow accents */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>B.Tech Community Service Project • Department of CSE (Data Science)</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-serif">
              Building a Cleaner, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-100">
                Plastic-Free Environment
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              An action-oriented environmental platform connecting students, teachers, and citizens of Narasaraopet & Lingamguntla Agraharam. Report plastic waste, track eco habits, volunteer for cleanups, and commit to a sustainable future.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                to="/pledge"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Award className="w-5 h-5" />
                <span>Take the Plastic-Free Pledge</span>
              </Link>
              <Link
                to="/waste-reports"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-sm transition-all"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Report Waste Dump</span>
              </Link>
              <Link
                to="/eco-assistant"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-teal-900/60 hover:bg-teal-900 text-teal-200 border border-teal-500/30 font-bold text-sm transition-all"
              >
                <Bot className="w-5 h-5 text-teal-300" />
                <span>Ask Eco AI</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 p-4 sm:p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md text-white shadow-xl">
            
            <div className="p-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Pledges Taken</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold">{stats.total_pledges}</div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Committed Citizens</p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Waste Reports</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold">{stats.total_reports}</div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">{stats.resolved_reports} Remediated</p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>Cleanup Drives</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold">{stats.total_events}</div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Palnadu Rural & Urban</p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>Volunteers</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold">{stats.total_volunteers}</div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Enrolled Advocates</p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Plastic Saved</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.total_plastic_saved_kg} <span className="text-base font-bold">kg</span></div>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Diverted from Landfills</p>
            </div>

          </div>
        </div>
      </section>

      {/* Verified Field Work & Academic Research Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xs">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Verified Field Research – 29 June 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug font-serif">
              ZPH School, Lingamguntla Agraharam <br className="hidden sm:block" />
              <span className="text-emerald-800">Community Outreach & Awareness</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              As part of our B.Tech Community Service Project in Narasaraopet, our student research team conducted an on-ground field study at Lingamguntla Agraharam. We engaged students and teachers at Zilla Parishad High School, demonstrated the lifecycle of single-use polymers, and mobilized the village youth to eliminate polybags.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Student & Staff Briefing</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Live classroom sessions on Resin Codes 1–7 and safe domestic waste segregation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">GPS Stamped Evidence</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Documented photographic evidence collected during the 29 June 2026 field survey.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                Meet the Team & Guides <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 bg-slate-100 px-3 py-1.5 rounded-xl"
              >
                <span>Read Field Stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl shadow-xs border border-slate-100 aspect-square">
              <img
                src="/images/activity_educational_session_1.jpg"
                alt="Educational session at ZPH School"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-xs border border-slate-100 aspect-square">
              <img
                src="/images/activity_student_interaction_2.jpg"
                alt="Student Interaction in classroom"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-xs border border-slate-100 aspect-square">
              <img
                src="/images/gallery_team_at_school.jpg"
                alt="Team at ZPH School campus"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-xs border border-slate-100 aspect-square">
              <img
                src="/images/study_area_zph_school.jpg"
                alt="Lingamguntla Agraharam Study Area"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Plastic Footprint Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Interactive Personal Impact Calculator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
                Calculate Your Annual Plastic Prevention
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                See how simple everyday habit changes—like carrying a cloth tote and a reusable water flask—scale into tangible environmental protection.
              </p>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Weekly Single-Use Carry Bags Used:</span>
                    <span className="text-amber-400 font-mono text-sm">{bagsPerWeek} bags / week</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={bagsPerWeek}
                    onChange={(e) => setBagsPerWeek(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Weekly Disposable Water Bottles Bought:</span>
                    <span className="text-cyan-400 font-mono text-sm">{bottlesPerWeek} bottles / week</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={bottlesPerWeek}
                    onChange={(e) => setBottlesPerWeek(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Result Cards */}
            <div className="w-full lg:w-auto grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Plastic Diverted / Year</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1 block">
                  {yearlyPlasticKg} kg
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 block">~{yearlyBags} bags avoided</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Petroleum Saved</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono mt-1 block">
                  {oilSavedLitres} L
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 block">Fossil fuel preserved</span>
              </div>

              <div className="col-span-2 bg-emerald-800/80 p-3.5 rounded-2xl border border-emerald-500/40 text-center flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-100">Ready to make this commitment official?</span>
                <Link
                  to="/pledge"
                  className="px-3.5 py-1.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50"
                >
                  Sign Pledge
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
            Key Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
            Integrated Environmental Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Practical tools turning student and citizen awareness into measurable grassroots impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-serif">Education & 5Rs Center</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive resin identification codes 1 to 7, the 5 R’s framework, and proper wet/dry waste segregation techniques.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/education" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950">
                Explore Education Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-serif">Smart Waste Reporting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload photos of plastic dumping grounds or choked canals, receive unique tracking IDs (#WR-2026-XXXX), and monitor remediation.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/waste-reports" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950">
                Report Incident <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-serif">Interactive Eco AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural-language sustainability engine answering queries on alternatives, polymer toxicity, and our local CSP research findings.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/eco-assistant" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950">
                Consult Eco Assistant <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
              Field Action
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
              Ongoing Environmental Campaigns
            </h2>
          </div>
          <Link
            to="/campaigns"
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Browse All Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.featured_campaigns?.length > 0 ? (
            data.featured_campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                      {camp.category.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-500">
                      Target: {camp.target_reach}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 font-serif">{camp.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">{camp.description}</p>
                </div>

                <div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Reach Progress</span>
                      <span>{camp.current_reach} / {camp.target_reach}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((camp.current_reach / (camp.target_reach || 1)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    to="/campaigns"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-dashed border-emerald-200">
              <p className="text-sm text-slate-500">Loading campaigns...</p>
            </div>
          )}
        </div>
      </section>

      {/* Community Pledges Feed */}
      <section className="bg-emerald-50/60 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-200/60 px-3 py-1 rounded-full">
              Citizens In Action
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
              Voices Pledging for Change
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Real community members who have taken the verified Plastic-Free commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.recent_pledges?.length > 0 ? (
              data.recent_pledges.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        {p.full_name ? p.full_name[0] : 'P'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{p.full_name}</h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{p.city}</span>
                        </p>
                      </div>
                    </div>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    "{p.pledge_statement}"
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.commitments?.map((c, i) => (
                      <span key={i} className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                        ✓ {c.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-sm text-slate-500">Loading verified pledges...</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/pledge"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Join Them & Take Your Pledge (+50 pts)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Ready to eliminate single-use plastics from your daily life?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              Every plastic carry bag refused and every reusable container chosen keeps toxic microplastics out of our soil, food chain, and groundwater.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/alternatives"
              className="px-5 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
            >
              Explore Eco Alternatives
            </Link>
            <Link
              to="/waste-reports"
              className="px-5 py-3 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-500/40 transition-colors"
            >
              Report Waste Site
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
