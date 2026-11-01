import React, { useState, useEffect } from 'react';
import { wasteReportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  AlertTriangle,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  X,
  AlertCircle,
  Eye,
  Crosshair,
  Search,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

const WasteReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [detailReport, setDetailReport] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('roadside');
  const [severity, setSeverity] = useState('medium');
  const [locationAddress, setLocationAddress] = useState('');
  const [city, setCity] = useState('Narasaraopet');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [reporterName, setReporterName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [reporterPhone, setReporterPhone] = useState(user?.profile?.phone || '');
  const [reporterEmail, setReporterEmail] = useState(user?.email || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const fetchReports = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (searchTrackingId.trim()) params.tracking_id = searchTrackingId.trim();
      const res = await wasteReportService.getReports(params);
      setReports(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching waste reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, selectedStatus, searchTrackingId]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
          showToast('GPS coordinates fetched from device!', 'info');
        },
        (err) => {
          showToast('Could not access GPS. Please enter street landmark.', 'error');
        }
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image exceeds 5MB size limit.', 'error');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionSuccess(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('waste_severity', severity);
    formData.append('location_address', locationAddress);
    formData.append('city', city);
    formData.append('reporter_name', reporterName);
    formData.append('reporter_phone', reporterPhone);
    formData.append('reporter_email', reporterEmail);
    if (latitude) formData.append('latitude', latitude);
    if (longitude) formData.append('longitude', longitude);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await wasteReportService.createReport(formData);
      const generatedId = res.data.tracking_id || `#WR-${res.data.id}`;
      setSubmissionSuccess({
        tracking_id: generatedId,
        title: res.data.title,
      });
      showToast(`Waste report logged with ID ${generatedId}!`, 'success');
      fetchReports();

      // Reset form
      setTitle('');
      setDescription('');
      setLocationAddress('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      const errTxt = err.response?.data?.detail || 'Failed to submit report. Please check required fields.';
      showToast(errTxt, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    showToast(`Tracking ID ${id} copied to clipboard!`, 'info');
  };

  return (
    <div className="space-y-12 pb-20 bg-[#f7faf8] min-h-screen">

      {/* Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Crowdsourced Environmental Surveillance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif">
              Smart Waste Reporting System
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Report illegal plastic dump yards, clogged rural canals, and burning hazards in Narasaraopet and Lingamguntla Agraharam. Receive an official Tracking ID and follow remediation progress live.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => { setSubmissionSuccess(null); setModalOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Waste Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">

          {/* Tracking ID Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                placeholder="Search by Tracking ID (e.g. WR-2026-4401)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTrackingId && (
                <button
                  onClick={() => setSearchTrackingId('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{reports.length}</span> verified incident reports
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-700" /> Category:
              </span>
              {['all', 'roadside', 'waterbody', 'dump_yard', 'school_park', 'commercial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600 mr-1">Status:</span>
              {['all', 'pending', 'approved', 'in_progress', 'resolved', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all uppercase tracking-wider ${selectedStatus === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Reports Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-600">Loading incident reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No reports found matching your criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category or status filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((rep) => {
              const statusColors = {
                pending: 'bg-amber-100 text-amber-900 border-amber-300',
                approved: 'bg-blue-100 text-blue-900 border-blue-300',
                under_review: 'bg-indigo-100 text-indigo-900 border-indigo-300',
                in_progress: 'bg-purple-100 text-purple-900 border-purple-300',
                resolved: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                rejected: 'bg-red-100 text-red-900 border-red-300',
                dismissed: 'bg-slate-100 text-slate-700 border-slate-300',
              };

              const severityColors = {
                low: 'text-slate-600',
                medium: 'text-amber-600',
                high: 'text-orange-600',
                critical: 'text-red-600 font-extrabold',
              };

              const trackingIdDisplay = rep.tracking_id || `#WR-${rep.id}`;

              return (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">

                    {/* Header: Tracking ID + Status Badge */}
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => copyTrackingId(trackingIdDisplay)}
                        className="font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors group"
                        title="Click to copy tracking ID"
                      >
                        <span>{trackingIdDisplay}</span>
                        <Copy className="w-3 h-3 text-emerald-600 group-hover:text-emerald-900" />
                      </button>

                      <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${statusColors[rep.status] || 'bg-slate-100'}`}>
                        {rep.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Image Preview */}
                    {rep.image && (
                      <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                        <img
                          src={rep.image}
                          alt={rep.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {rep.description}
                    </p>

                    {/* Severity & Location Info */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px]">Hazard Severity:</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${severityColors[rep.waste_severity]}`}>
                          ● {rep.waste_severity}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-semibold">{rep.location_address}, {rep.city}</span>
                      </div>
                    </div>

                    {/* Admin Action Notes if present */}
                    {rep.admin_notes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-950">
                        <strong className="block text-[10px] uppercase tracking-wider text-emerald-800">
                          Remediation Action Note:
                        </strong>
                        {rep.admin_notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[130px]">By: {rep.reporter_name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-scaleUp">

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submissionSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                  Report Successfully Registered!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your report has been logged and assigned to local volunteer coordinators in Palnadu.
                </p>

                {/* Tracking ID Badge */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-sm mx-auto">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block mb-1">
                    Your Unique Tracking ID
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-mono font-black text-emerald-950">
                      {submissionSuccess.tracking_id}
                    </span>
                    <button
                      onClick={() => copyTrackingId(submissionSuccess.tracking_id)}
                      className="p-1.5 text-emerald-700 hover:text-emerald-950 rounded-lg hover:bg-emerald-200/50"
                      title="Copy Tracking ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-800 mt-1 block">
                    Use this ID anytime in the search bar above to verify cleanup status.
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setModalOpen(false);
                    }}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Done & View Reports
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 space-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                    Community Watch
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                    Report a Plastic Waste Hazard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Help identify dumping sites and choked waterbodies in Narasaraopet & Lingamguntla Agraharam.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Issue Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Heaps of single-use polybags near canal bund"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Waste Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="roadside">Roadside / Public Footpath</option>
                        <option value="waterbody">Waterbody / Canal / Stream</option>
                        <option value="dump_yard">Illegal Dump Yard</option>
                        <option value="school_park">School / Community Park</option>
                        <option value="commercial">Commercial / Market Zone</option>
                        <option value="other">Other Location</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Hazard Severity *</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="low">Low (Minor litter)</option>
                        <option value="medium">Medium (Noticeable accumulation)</option>
                        <option value="high">High (Heavy accumulation / blockages)</option>
                        <option value="critical">Critical (Toxic burning / animal threat)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the nature of plastic items (polybags, cups, thermocol), estimated volume, and environmental hazards..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Exact Location / Landmark *</label>
                      <input
                        type="text"
                        required
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="e.g. Near ZPH School West Gate, Lingamguntla"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City / Village *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* GPS Coordinates */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">GPS Coordinates (Optional)</span>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Fetch Device GPS</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Latitude (e.g. 16.1528)"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="p-2 rounded-xl border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Longitude (e.g. 80.0492)"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="p-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Evidence Photo (Max 5MB)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {imagePreview && (
                      <div className="mt-2 w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Reporter Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Contact Phone *</label>
                      <input
                        type="text"
                        required
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder="+91 98480 00000"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Report...' : 'Publish Plastic Waste Report'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default WasteReports;
