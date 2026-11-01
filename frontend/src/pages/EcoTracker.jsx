import React, { useState, useEffect } from 'react';
import { ecoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Award,
  TrendingUp,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  Leaf,
  Trophy,
  History,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EcoTracker = () => {
  const { user, refreshProfile } = useAuth();
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [activityType, setActivityType] = useState('reusable_bag');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemsCount, setItemsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const activityOptions = [
    { id: 'reusable_bag', name: 'Carried Reusable Cloth/Jute Bag', defaultPoints: 15, defaultGrams: 40 },
    { id: 'avoid_plastic_bottle', name: 'Used Refillable Steel/Glass Bottle', defaultPoints: 20, defaultGrams: 60 },
    { id: 'recycle_plastic', name: 'Segregated & Recycled Clean Plastics', defaultPoints: 25, defaultGrams: 100 },
    { id: 'cleanup_participation', name: 'Participated in Local Litter Cleanup', defaultPoints: 100, defaultGrams: 500 },
    { id: 'reusable_container', name: 'Opted for Reusable Tiffin / Cutlery', defaultPoints: 20, defaultGrams: 80 },
    { id: 'eco_pledge_shared', name: 'Shared Awareness & Guided Others', defaultPoints: 15, defaultGrams: 30 },
    { id: 'other', name: 'Other Sustainable Action', defaultPoints: 10, defaultGrams: 50 },
  ];

  const fetchData = async () => {
    try {
      const [actRes, leadRes] = await Promise.all([
        ecoService.getActivities(),
        ecoService.getLeaderboard(),
      ]);
      setActivities(actRes.data.results || actRes.data || []);
      setLeaderboard(leadRes.data || []);
    } catch (err) {
      console.error("Error loading eco tracker:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogActivity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const chosen = activityOptions.find(o => o.id === activityType);
    const activityTitle = title.trim() || chosen?.name || 'Sustainable Action';

    try {
      const payload = {
        activity_type: activityType,
        title: activityTitle,
        description: description,
        items_avoided_count: parseInt(itemsCount) || 1,
      };
      await ecoService.logActivity(payload);
      setMsg({ type: 'success', text: `Activity logged successfully! Impact points added to your score.` });
      setTitle('');
      setDescription('');
      setItemsCount(1);
      await refreshProfile();
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to record eco action. Please retry.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalPoints = user?.profile?.eco_points || 0;
  const totalGramsSaved = activities.reduce((acc, a) => acc + (a.plastic_saved_grams || 0), 0);
  const totalKgSaved = (totalGramsSaved / 1000).toFixed(2);

  const getRankBadge = (pts) => {
    if (pts >= 400) return { title: 'Forest Guardian', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (pts >= 250) return { title: 'Eco Champion', color: 'bg-teal-100 text-teal-900 border-teal-300' };
    if (pts >= 100) return { title: 'Green Crusader', color: 'bg-green-100 text-green-900 border-green-300' };
    return { title: 'Seedling Advocate', color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const rank = getRankBadge(totalPoints);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Personal Sustainability Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Eco Activity & Impact Tracker
              </h1>
              <p className="text-emerald-100/90 text-sm leading-relaxed">
                Log daily zero-waste decisions, track plastic weight diverted from nature, and earn verified impact points.
              </p>
            </div>

            {/* User Level Card */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right min-w-[200px]">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                Current Standing
              </span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                {totalPoints} <span className="text-xs text-white">pts</span>
              </div>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${rank.color}`}>
                ★ {rank.title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plastic Diverted</span>
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {totalKgSaved} <span className="text-base font-bold text-emerald-700">kg</span>
            </div>
            <p className="text-[11px] text-slate-500">Prevented from polluting land & waterways</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activities Recorded</span>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {activities.length} <span className="text-base font-bold text-teal-700">actions</span>
            </div>
            <p className="text-[11px] text-slate-500">Eco-friendly substitutions logged</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pledge Status</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-2">
              {user?.profile?.pledge_taken ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Pledger
                </span>
              ) : (
                <Link to="/pledge" className="text-amber-600 underline text-sm hover:text-amber-800">
                  Take Pledge (+50 pts) →
                </Link>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Official commitment charter</p>
          </div>

        </div>
      </section>

      {/* Main Grid: Log Action & Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Action Logger Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-eco space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Log New Action
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Record Today's Sustainable Habit
              </h2>
              <p className="text-xs text-slate-500">
                Every substitution counts. Earn points and climb the community rank.
              </p>
            </div>

            {msg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleLogActivity} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Sustainable Action *</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
                >
                  {activityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} (+{opt.defaultPoints} pts / ~{opt.defaultGrams}g saved)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity / Count Avoided *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={itemsCount}
                    onChange={(e) => setItemsCount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">e.g. 3 polybags, 2 water bottles</span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Title (Optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Carried jute tote at Narasaraopet vegetable market"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Reflection (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details on how you encouraged others or avoided plastic..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Recording Action...' : 'Save & Claim Impact Points'}</span>
              </button>

            </form>

            {/* Personal Activity Log Table */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-700" />
                <span>Your Activity History</span>
              </h3>

              {activities.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No activities logged yet. Record your first eco habit above!
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-800">{act.title}</h4>
                        <span className="text-[10px] text-slate-400">
                          {act.activity_date} | {act.items_avoided_count} item(s) avoided
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-800 font-mono block">
                          +{act.eco_points_earned} pts
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {act.plastic_saved_grams}g saved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Community Leaderboard Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-eco space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                Rankings
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Community Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-500">
                Top environmental contributors across Narasaraopet & Lingamguntla Agraharam.
              </p>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((champ, index) => {
                const medalColors = [
                  'bg-amber-100 text-amber-800 border-amber-300 font-bold',
                  'bg-slate-100 text-slate-700 border-slate-300 font-bold',
                  'bg-orange-100 text-orange-800 border-orange-300 font-bold',
                ];

                return (
                  <div
                    key={champ.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                        medalColors[index] || 'bg-white text-slate-500 border-slate-200'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900">{champ.full_name}</h4>
                        <span className="text-[10px] text-slate-400">{champ.city}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-800 font-mono text-sm block">
                        {champ.eco_points}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">points</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>College Semester CSP Credits</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Active students logging over 300 verified eco points and attending 2 cleanup drives qualify for Community Service Project excellence credentials.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default EcoTracker;

