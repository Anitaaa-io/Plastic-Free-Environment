import React, { useState, useEffect } from 'react';
import { communityService, ecoService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Award,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  BookOpen,
  School,
  Download,
  Copy
} from 'lucide-react';

const CSP_STUDENT_TEAM = [
  { name: "B. Bhavya Sai Sri", roll: "24471A4402", role: "Project Lead & Lead Researcher", area: "Data Collection & Platform Architecture" },
  { name: "M. Aparna", roll: "24471A4425", role: "Field Survey Coordinator", area: "School Outreach & Student Engagement" },
  { name: "N. Esther Rani", roll: "24471A4435", role: "Eco Alternatives Analyst", area: "Polymer Analysis & Alternatives" },
  { name: "T. Anitha", roll: "24471A4461", role: "Community Mobilizer", area: "Rural Awareness & Youth Mobilization" },
];

const FACULTY_GUIDES = [
  "Mr. P. Srinivasarao",
  "Mr. P. Solman",
  "Mr. N. Siva Rama Krishna",
  "Mr. B. Veera Brahmam"
];

const CommunityHub = () => {
  const { showToast } = useToast();

  const [stories, setStories] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [likedStories, setLikedStories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storiesRes, leaderRes] = await Promise.all([
          communityService.getStories(),
          ecoService.getLeaderboard(),
        ]);
        setStories(storiesRes.data?.results || storiesRes.data || []);
        setLeaderboard(leaderRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLike = async (id) => {
    if (likedStories[id]) return;
    try {
      const res = await communityService.likeStory(id);
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, likes_count: res.data.likes_count } : s))
      );
      setLikedStories((prev) => ({ ...prev, [id]: true }));
      showToast('Thank you for supporting community environmental action!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (story) => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.impact_summary || story.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${story.title} - ${window.location.href}`);
      showToast('Story link copied to clipboard!', 'info');
    }
  };

  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f7faf8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Community Hub & Field Projects</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif tracking-tight">
            Sustainability Community Hub
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Field reports, civic announcements, student research updates, and the verified community leaderboard driving change across Narasaraopet and rural Palnadu.
          </p>
        </div>

        {/* Academic Project Accreditation Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-700/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                <School className="w-4 h-4 text-emerald-400" />
                <span>B.Tech Community Service Project (CSP)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif">
                Department of Computer Science & Engineering (Data Science)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Narasaraopet, Palnadu District, Andhra Pradesh (PIN: 522601) • Field Study: ZPH School, Lingamguntla Agraharam (29 June 2026)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {CSP_STUDENT_TEAM.map((member, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-white">{member.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded">
                    {member.roll}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-semibold">{member.role}</p>
                <p className="text-[11px] text-emerald-300/80 mt-1">{member.area}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-200">
            <div>
              <span className="font-bold text-white">Faculty Guides: </span>
              <span>{FACULTY_GUIDES.join(' • ')}</span>
            </div>
            <span className="text-[11px] bg-emerald-800/80 px-2.5 py-1 rounded-full border border-emerald-600/30">
              Verified Field Visit: 29 June 2026
            </span>
          </div>
        </div>

        {/* 2-Column: Community Stories & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Stories & Field Updates (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'All Updates', key: 'all' },
                { label: 'Field Updates', key: 'update' },
                { label: 'Impact Stories', key: 'story' },
                { label: 'Civic Announcements', key: 'announcement' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.key
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Stories List */}
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">Loading stories...</div>
            ) : filteredStories.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-500 border border-slate-100">
                No stories found in this category.
              </div>
            ) : (
              filteredStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        story.category === 'update'
                          ? 'bg-purple-100 text-purple-800'
                          : story.category === 'announcement'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {story.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(story.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mb-2 leading-snug">
                      {story.title}
                    </h3>

                    {story.impact_summary && (
                      <div className="inline-block px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900 font-bold text-xs mb-3">
                        🎯 Impact: {story.impact_summary}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {story.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">By {story.author_name}</span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(story.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                          likedStories[story.id]
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedStories[story.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{story.likes_count || 0}</span>
                      </button>

                      <button
                        onClick={() => handleShare(story)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                        title="Share story"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}

          </div>

          {/* Right Column: Leaderboard & Recognition (1 Col) */}
          <div className="space-y-6">
            
            {/* Top Eco Champions Leaderboard */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 font-serif">
                  Community Leaderboard
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Top verified sustainability crusaders in Palnadu District
              </p>

              <div className="divide-y divide-slate-100">
                {leaderboard.slice(0, 7).map((champ, rank) => (
                  <div key={champ.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        rank === 0
                          ? 'bg-amber-400 text-white'
                          : rank === 1
                          ? 'bg-slate-300 text-slate-800'
                          : rank === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rank + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-[120px]">
                          {champ.full_name || champ.username}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {champ.city || 'Narasaraopet'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-emerald-800 block">
                        {champ.eco_points} pts
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Lvl {champ.level || 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Shareable Badge Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Spread the Green Revolution</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed mb-4">
                Invite friends and neighbors in Narasaraopet to sign the pledge, report pollution spots, and keep our village free from single-use plastics.
              </p>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Plastic-Free Environment Platform",
                      text: "Join me in taking the Plastic-Free Commitment in Palnadu District!",
                      url: window.location.origin + "/pledge",
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.origin + "/pledge");
                    showToast("Platform invite link copied!", "success");
                  }
                }}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Platform Link</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CommunityHub;

