import React, { useState, useEffect } from 'react';
import { adminService, wasteReportService, eventService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Award,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
  Shield,
  Edit,
  Plus,
  X,
  Filter,
  Check,
  Download,
  FileSpreadsheet,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [exportOpen, setExportOpen] = useState(false);

  // Status update modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('approved');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // New Event modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('CSP Student Action Group');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventTarget, setEventTarget] = useState(40);
  const [eventCreating, setEventCreating] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await adminService.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error("Error fetching admin analytics:", err);
      showToast("Error loading admin analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCSV = async (type) => {
    try {
      showToast(`Generating ${type} CSV export...`, 'info');
      const res = await adminService.exportCSV(type);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plastic_free_${type}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(`Exported ${type} CSV successfully!`, 'success');
      setExportOpen(false);
    } catch (err) {
      showToast('Failed to export CSV. Please try again.', 'error');
    }
  };

  const handleQuickStatusUpdate = async (reportId, statusVal, note) => {
    try {
      await wasteReportService.updateStatus(reportId, {
        status: statusVal,
        admin_notes: note || `Status updated to ${statusVal} by administrator.`,
      });
      showToast(`Report updated to ${statusVal}!`, 'success');
      fetchAnalytics();
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  const handleUpdateReportStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setStatusUpdating(true);

    try {
      await wasteReportService.updateStatus(selectedReport.id, {
        status: newStatus,
        admin_notes: adminNotes,
      });
      showToast(`Report ${selectedReport.tracking_id || selectedReport.id} updated!`, 'success');
      setSelectedReport(null);
      fetchAnalytics();
    } catch (err) {
      showToast("Failed to update status. Please try again.", "error");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventCreating(true);

    try {
      await eventService.createEvent({
        title: eventTitle,
        description: eventDesc,
        organizer: eventOrganizer,
        event_date: eventDate,
        location_name: eventVenue,
        address: eventAddress,
        city: 'Narasaraopet',
        target_volunteers: parseInt(eventTarget) || 30,
        status: 'upcoming'
      });
      showToast('Cleanup event created and published!', 'success');
      setEventModalOpen(false);
      setEventTitle('');
      setEventDesc('');
      setEventVenue('');
      setEventAddress('');
      fetchAnalytics();
    } catch (err) {
      showToast("Failed to create event. Please verify all fields.", "error");
    } finally {
      setEventCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Administrator Console & Analytics...</p>
      </div>
    );
  }

  const m = data?.metrics || {};
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-[#f7faf8]">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Platform Analytics & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time management for Narasaraopet & Lingamguntla Agraharam CSP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CSV Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export Reports / CSV</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-fadeIn">
                <button
                  onClick={() => handleExportCSV('reports')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Waste Reports CSV</span>
                </button>
                <button
                  onClick={() => handleExportCSV('pledges')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Pledges CSV</span>
                </button>
                <button
                  onClick={() => handleExportCSV('volunteers')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Volunteers CSV</span>
                </button>
                <button
                  onClick={() => handleExportCSV('activities')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Eco Activities CSV</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setEventModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Cleanup Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{m.total_users || 0}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Registered Accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pledges Taken</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">{m.total_pledges || 0}</div>
          <span className="text-[10px] text-slate-500 font-semibold">Verified Commitments</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Waste Reports</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{m.total_reports || 0}</div>
          <span className="text-[10px] text-amber-600 font-semibold">{m.pending_reports || 0} Pending</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Resolved Sites</span>
          <div className="text-2xl font-black text-green-700 mt-1">{m.resolved_reports || 0}</div>
          <span className="text-[10px] text-green-600 font-semibold">Remediated Clean</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cleanup Drives</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{m.total_events || 0}</div>
          <span className="text-[10px] text-slate-500 font-semibold">{m.total_volunteers || 0} Enrolled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Messages</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{m.total_messages || 0}</div>
          <span className="text-[10px] text-purple-600 font-semibold">{m.unread_messages || 0} Unread</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Analytics & Charts' },
          { id: 'reports', label: `Waste Reports (${m.total_reports || 0})` },
          { id: 'pledges', label: `Pledges (${m.total_pledges || 0})` },
          { id: 'volunteers', label: `Volunteers (${m.total_volunteers || 0})` },
          { id: 'messages', label: `Messages (${m.total_messages || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Waste Reports by Category */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Waste Incidents by Physical Category
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.category_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Reports" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Status Breakdown Pie */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Incident Resolution Status Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.status_data || []}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {(data?.status_data || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 3: Monthly Growth Trend */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Community Engagement Trend (Pledges vs Reports)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.monthly_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pledges" stroke="#10b981" strokeWidth={2} name="Pledges" />
                    <Line type="monotone" dataKey="reports" stroke="#f59e0b" strokeWidth={2} name="Waste Reports" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Eco Activities Impact */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Plastic Diverted by Activity Type (kg)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.activity_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="saved_kg" fill="#047857" radius={[6, 6, 0, 0]} name="Plastic Saved (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: WASTE REPORTS MANAGER */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Crowdsourced Waste Incident Manager
            </h3>
            <span className="text-xs text-slate-500">Approve, update status, and attach remediation notes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(data?.recent_reports || []).map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {rep.tracking_id || `#WR-${rep.id}`}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{rep.title}</span>
                      <span className="text-[10px] text-slate-400">{rep.location_address}, {rep.city}</span>
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                      {rep.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        rep.waste_severity === 'critical' ? 'bg-red-100 text-red-800' :
                        rep.waste_severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {rep.waste_severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block font-semibold text-slate-800">{rep.reporter_name}</span>
                      <span className="text-[10px] text-slate-400">{rep.reporter_phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] border ${
                        rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        rep.status === 'approved' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        rep.status === 'in_progress' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        rep.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {rep.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rep.status === 'pending' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(rep.id, 'approved', 'Verified and scheduled by coordinator.')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {rep.status === 'approved' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(rep.id, 'in_progress', 'Cleanup drive initiated on site.')}
                            className="px-2.5 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-lg text-[10px] font-bold"
                          >
                            In Progress
                          </button>
                        )}
                        {rep.status === 'in_progress' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(rep.id, 'resolved', 'Cleanup successfully completed.')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-[10px] font-bold"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReport(rep);
                            setNewStatus(rep.status);
                            setAdminNotes(rep.admin_notes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              Community Pledges Register
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Pledger Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Statement</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(data?.recent_pledges || []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{p.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.full_name}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-emerald-800">
                      {p.category || 'individual'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div>{p.email}</div>
                      {p.phone && <div className="text-[10px] text-slate-400">{p.phone}</div>}
                    </td>
                    <td className="py-3 px-4">{p.city}</td>
                    <td className="py-3 px-4 max-w-xs italic truncate">"{p.pledge_statement}"</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              Enrolled Volunteers
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Volunteer Name</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(data?.recent_volunteers || []).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{v.full_name}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">{v.event_title}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <div>{v.email}</div>
                      <div className="text-[10px] text-slate-400">{v.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[9px]">
                        {v.attendance_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(v.registered_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              Community Contact Inquiries
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {(data?.recent_messages || []).map((msg) => (
              <div key={msg.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{msg.name}</span>
                    <span className="text-slate-400">• {msg.email}</span>
                    {msg.phone && <span className="text-slate-400">• {msg.phone}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-emerald-950">{msg.subject}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scaleUp text-xs space-y-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Update Status
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-serif">
                {selectedReport.tracking_id || `#WR-${selectedReport.id}`}: {selectedReport.title}
              </h3>
            </div>

            <form onSubmit={handleUpdateReportStatus} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Resolution Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved & Scheduled</option>
                  <option value="under_review">Under Review with Authorities</option>
                  <option value="in_progress">Cleanup In Progress</option>
                  <option value="resolved">Resolved & Cleaned Up</option>
                  <option value="rejected">Rejected / Inaccurate</option>
                  <option value="dismissed">Dismissed / Duplicate</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Resolution / Action Note</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Coordinated with Lingamguntla Agraharam Panchayat; plastic cleared by volunteer tractor."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={statusUpdating}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors"
              >
                {statusUpdating ? 'Updating Status...' : 'Save Status Update'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp text-xs space-y-4">
            <button
              onClick={() => setEventModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Create Event
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-serif">
                Schedule New Cleanup Drive
              </h3>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Lingamguntla Agraharam Canal Waste Cleanup"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Event goals, safety gear provided, cleanup zones..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Volunteers</label>
                  <input
                    type="number"
                    value={eventTarget}
                    onChange={(e) => setEventTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Venue *</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. ZPH School Campus"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Address *</label>
                  <input
                    type="text"
                    required
                    value={eventAddress}
                    onChange={(e) => setEventAddress(e.target.value)}
                    placeholder="Lingamguntla Agraharam"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={eventCreating}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors"
              >
                {eventCreating ? 'Publishing Event...' : 'Publish Cleanup Event'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
