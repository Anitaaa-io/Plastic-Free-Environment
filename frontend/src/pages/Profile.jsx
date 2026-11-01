import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService, pledgeService, wasteReportService, eventService, badgeService } from '../services/api';
import {
  User,
  Sparkles,
  Award,
  AlertTriangle,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  KeyRound,
  ShieldCheck,
  Lock,
  TreePine,
  Zap,
  Users,
  Search,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICON_MAP = {
  Award: Award,
  Search: Search,
  ShieldCheck: ShieldCheck,
  Users: Users,
  Zap: Zap,
  TreePine: TreePine,
  Crown: Crown,
};

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [state, setState] = useState(user?.profile?.state || 'Andhra Pradesh');
  const [bio, setBio] = useState(user?.profile?.bio || '');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [saving, setSaving] = useState(false);
  const [myPledges, setMyPledges] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [myVolunteering, setMyVolunteering] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.profile?.phone || '');
      setCity(user.profile?.city || '');
      setState(user.profile?.state || 'Andhra Pradesh');
      setBio(user.profile?.bio || '');
    }

    const loadUserData = async () => {
      try {
        const [pRes, rRes, vRes, bRes] = await Promise.all([
          pledgeService.getMyPledges(),
          wasteReportService.getMyReports(),
          eventService.getMyVolunteering(),
          badgeService.getBadges(),
        ]);
        setMyPledges(pRes.data.results || pRes.data || []);
        setMyReports(rRes.data.results || rRes.data || []);
        setMyVolunteering(vRes.data.results || vRes.data || []);
        setAllBadges(bRes.data || []);
      } catch (err) {
        console.error("Error loading user profile data:", err);
      }
    };
    loadUserData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('bio', bio);

      await authService.updateProfileDetails(formData);
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile. Please verify fields.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setPasswordUpdating(true);

    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      showToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.old_password?.[0] || err.response?.data?.new_password?.[0] || 'Failed to change password. Please check your current password.';
      showToast(msg, 'error');
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 bg-[#f7faf8] min-h-screen">

      {/* Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-emerald-500/40">
                {user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
                </h1>
                <p className="text-xs text-emerald-200 flex items-center gap-2 mt-0.5">
                  <span>@{user?.username}</span>
                  <span>•</span>
                  <span className="capitalize">{user?.profile?.level_title || 'Seedling Advocate'}</span>
                  <span>•</span>
                  <span>{user?.profile?.city || 'Narasaraopet'}, {user?.profile?.state}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Eco Points</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {user?.profile?.eco_points || 0}
                </span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Level</span>
                <span className="text-xl font-black text-emerald-300 font-mono">
                  {user?.profile?.level || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'profile'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'badges'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges & Milestones ({allBadges.filter(b => b.unlocked).length}/{allBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'security'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'reports'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <span>My Waste Reports</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded-full text-[10px] font-mono">
              {myReports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pledges')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'pledges'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <span>My Pledges</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded-full text-[10px] font-mono">
              {myPledges.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Profile Form */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-xs space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-serif">
              Personal Information & Location
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94400 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Mandal</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Narasaraopet"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Environmental Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your sustainability commitment or local involvement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Badges & Milestones Showcase */}
        {activeTab === 'badges' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Achievement Badges & Milestones</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Unlock badges by taking the pledge, reporting plastic waste, and completing daily zero-waste challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBadges.map((badge) => {
                const IconComponent = ICON_MAP[badge.icon] || Award;
                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${badge.unlocked
                        ? 'bg-gradient-to-br from-amber-50/60 to-emerald-50/60 border-amber-300/80 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${badge.unlocked ? 'bg-amber-400 text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                      }`}>
                      {badge.unlocked ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900">{badge.name}</h4>
                        {badge.unlocked ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                            Locked ({badge.points_required} pts)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{badge.description}</p>
                      {badge.unlocked && badge.earned_at && (
                        <span className="text-[10px] text-slate-400 block mt-2">
                          Earned on: {new Date(badge.earned_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <div className="max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-700" />
                <span>Update Account Password</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your existing password and choose a secure new password.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={passwordUpdating}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors disabled:opacity-50"
              >
                {passwordUpdating ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: My Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">
                Your Submitted Plastic Waste Reports
              </h3>
              <Link to="/waste-reports" className="text-xs font-bold text-emerald-800 hover:underline">
                Report New Spot
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {myReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  You haven't submitted any waste reports yet.
                </div>
              ) : (
                myReports.map((rep) => (
                  <div key={rep.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                          {rep.tracking_id || `#WR-${rep.id}`}
                        </span>
                        <span className="text-slate-400">
                          {new Date(rep.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{rep.title}</h4>
                      <p className="text-slate-500 mt-0.5">{rep.location_address}, {rep.city}</p>
                      {rep.admin_notes && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded mt-2">
                          <strong>Admin Note:</strong> {rep.admin_notes}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 w-fit">
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: My Pledges */}
        {activeTab === 'pledges' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">
                Your Signed Plastic-Free Commitments
              </h3>
              <Link to="/pledge" className="text-xs font-bold text-emerald-800 hover:underline">
                Take New Pledge
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {myPledges.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No pledges recorded yet.
                </div>
              ) : (
                myPledges.map((p) => (
                  <div key={p.id} className="p-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{p.full_name}</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{p.pledge_statement}"</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.commitments?.map((c, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                          ✓ {c.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </section>

    </div>
  );
};

export default Profile;
