import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService, challengeService } from '../services/api';
import {
  Sparkles,
  Award,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bot,
  PlusCircle,
  AlertCircle,
  FileText,
  Users,
  Lock,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Droplets,
  Recycle,
  Share2,
  Coffee,
  Check
} from 'lucide-react';

const ICON_MAP = {
  Award: Award,
  Search: Trash2,
  ShieldCheck: ShieldCheck,
  Users: Users,
  Zap: Sparkles,
  TreePine: Award,
  Crown: Award,
  Coffee: Coffee,
  ShoppingBag: ShoppingBag,
  Droplets: Droplets,
  Recycle: Recycle,
  Share2: Share2,
  Sparkles: Sparkles,
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      console.error(err);
      showToast('Could not load user dashboard summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCompleteChallenge = async (challengeId) => {
    try {
      setCompletingId(challengeId);
      const res = await challengeService.completeChallenge(challengeId);
      showToast(res.data.message || 'Challenge completed!', 'badge');
      // Reload dashboard data
      await loadDashboard();
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not complete challenge';
      showToast(msg, 'error');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Loading your sustainability metrics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const currentPoints = stats.eco_points || 0;
  const currentLevel = stats.level || 1;
  const levelTitle = stats.level_title || 'Seedling Advocate';

  // Level thresholds
  const nextLevelThresholds = { 1: 100, 2: 250, 3: 400, 4: 600, 5: 1000 };
  const targetPoints = nextLevelThresholds[currentLevel] || 1000;
  const levelProgress = Math.min(100, Math.round((currentPoints / targetPoints) * 100));

  return (
    <div className="min-h-screen bg-[#f7faf8] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome & Level Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 uppercase tracking-wider">
                  Level {currentLevel}: {levelTitle}
                </span>
                <span className="text-xs text-emerald-300">
                  Palnadu Sustainability Champion
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                Every refusal of a single-use plastic bag and segregated bottle safeguards our local farmlands and water bodies.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/eco-tracker"
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>Log Eco Action</span>
              </Link>
              <Link
                to="/waste-reports"
                className="px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-emerald-300" />
                <span>Report Waste</span>
              </Link>
              <Link
                to="/eco-assistant"
                className="px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-teal-300" />
                <span>Ask Eco AI</span>
              </Link>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="relative z-10 mt-6 pt-6 border-t border-emerald-700/60">
            <div className="flex items-center justify-between text-xs text-emerald-200 mb-1.5 font-semibold">
              <span>Level {currentLevel} Progress: {currentPoints} / {targetPoints} pts</span>
              <span>{levelProgress}% towards next tier</span>
            </div>
            <div className="w-full h-3 bg-emerald-950/60 rounded-full overflow-hidden p-0.5 border border-emerald-600/40">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Eco Points</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.eco_points || 0}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Tier {currentLevel} Active</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Plastic Prevented</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.plastic_saved_kg || 0} kg</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{stats.plastic_saved_grams || 0} grams</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Waste Reports</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.reports_count || 0}</span>
              <Link to="/waste-reports" className="text-[10px] text-cyan-700 font-bold hover:underline block mt-0.5">
                View Tracking IDs
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Badges Unlocked</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.badges_earned_count || 0} / {stats.total_badges_count || 7}
              </span>
              <Link to="/profile" className="text-[10px] text-purple-700 font-bold hover:underline block mt-0.5">
                View Badge Showcase
              </Link>
            </div>
          </div>
        </div>

        {/* Daily Challenges Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Today's Zero-Waste Challenges</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete daily micro-actions to earn eco points and prevent single-use plastic waste.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data?.daily_challenges?.map((ch) => {
              const IconComponent = ICON_MAP[ch.icon] || Sparkles;
              return (
                <div
                  key={ch.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    ch.completed_today
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        ch.completed_today ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        +{ch.points_reward} pts
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{ch.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Saves ~{ch.plastic_saved_grams}g plastic
                    </span>
                    {ch.completed_today ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-200/60 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed Today</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCompleteChallenge(ch.id)}
                        disabled={completingId === ch.id}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {completingId === ch.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Mark Done</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Recent Waste Reports & Recent Eco Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Waste Reports with Tracking IDs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-emerald-700" />
                    <span>My Reported Waste Hotspots</span>
                  </h3>
                  <p className="text-xs text-slate-500">Track real-time remediation status</p>
                </div>
                <Link
                  to="/waste-reports"
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Report Spot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {(!data?.recent_reports || data.recent_reports.length === 0) ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    You haven't submitted any waste reports yet.
                    <div className="mt-2">
                      <Link to="/waste-reports" className="text-emerald-700 font-bold hover:underline">
                        Submit your first report (+50 pts)
                      </Link>
                    </div>
                  </div>
                ) : (
                  data.recent_reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[10px]">
                            {report.tracking_id || `#WR-${report.id}`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 truncate">{report.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{report.location_address}</p>
                      </div>

                      <div className="flex-shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          report.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : report.status === 'approved' || report.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <Link to="/waste-reports" className="text-xs text-slate-500 hover:text-emerald-800 font-semibold">
                View all community reports & tracking numbers →
              </Link>
            </div>
          </div>

          {/* Recent Eco Activities Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Recent Eco Actions Log</span>
                  </h3>
                  <p className="text-xs text-slate-500">Your logged zero-plastic habits</p>
                </div>
                <Link
                  to="/eco-tracker"
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Log New</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {(!data?.recent_activities || data.recent_activities.length === 0) ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No eco activities logged yet.
                    <div className="mt-2">
                      <Link to="/eco-tracker" className="text-emerald-700 font-bold hover:underline">
                        Log your reusable bag or bottle (+15 to +100 pts)
                      </Link>
                    </div>
                  </div>
                ) : (
                  data.recent_activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-800 truncate">{act.title}</h4>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Prevented ~{act.plastic_saved_grams}g • {act.activity_date}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full text-xs">
                          +{act.eco_points_earned} pts
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <Link to="/eco-tracker" className="text-xs text-slate-500 hover:text-emerald-800 font-semibold">
                Open full activities tracker & community leaderboard →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;

