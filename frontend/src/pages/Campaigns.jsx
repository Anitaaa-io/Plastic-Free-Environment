import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/api';
import {
  Sparkles,
  Users,
  Calendar,
  Target,
  ArrowRight,
  Share2,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignService.getCampaigns();
        setCampaigns(res.data.results || res.data || []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const categories = [
    { id: 'all', name: 'All Initiatives' },
    { id: 'school_outreach', name: 'School & Youth' },
    { id: 'plastic_ban', name: 'Plastic Bag Bans' },
    { id: 'recycling_drive', name: 'Canal & Village Recycling' },
    { id: 'awareness', name: 'General Awareness' },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Target className="w-4 h-4" />
              <span>Community Environmental Action</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Community Campaigns & Drives
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Targeted campaigns across Narasaraopet, Lingamguntla Agraharam schools, and rural agricultural markets to drive policy enforcement and plastic reduction.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns by title, keywords or objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === c.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-600">Loading verified campaigns from database...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No campaigns found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => {
              const progressPct = Math.min(100, Math.round((camp.current_reach / (camp.target_reach || 1)) * 100));

              return (
                <div
                  key={camp.id}
                  className="eco-card bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        {camp.category.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        camp.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {camp.title}
                    </h3>

                    {camp.subtitle && (
                      <p className="text-xs font-semibold text-emerald-700">
                        {camp.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {camp.description}
                    </p>

                    {/* Objective Box */}
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100/70 text-xs">
                      <span className="font-bold text-emerald-950 block mb-0.5">Objective:</span>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">{camp.objective}</p>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Community Reach</span>
                        <span className="font-mono text-emerald-700">{camp.current_reach} / {camp.target_reach}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block text-right">
                        {progressPct}% of target achieved
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Timeline: {camp.start_date} {camp.end_date ? `to ${camp.end_date}` : ''}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to="/pledge"
                        className="flex-1 text-center py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Support & Pledge
                      </Link>
                      <button
                        onClick={() => alert(`Campaign: ${camp.title}\nShare this campaign with your friends and family!`)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        title="Share Campaign"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default Campaigns;

