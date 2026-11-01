import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
  Sparkles,
  Clock,
  X,
  AlertCircle,
  Plus
} from 'lucide-react';

const CleanupEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await eventService.getEvents();
      setEvents(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openVolunteerModal = (event) => {
    setSelectedEvent(event);
    setMessage(null);
    if (user) {
      setFullName(user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username);
      setEmail(user.email || '');
      setPhone(user.profile?.phone || '');
    }
    setModalOpen(true);
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        full_name: fullName,
        email: email,
        phone: phone,
        emergency_contact: emergencyContact,
        notes: notes,
      };
      await eventService.volunteer(selectedEvent.id, payload);
      setMessage({ type: 'success', text: 'You have been successfully registered as a volunteer! Thank you for standing up for clean surroundings.' });
      fetchEvents(); // Refresh volunteer counts
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.email || 'Failed to submit registration. Please verify details.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Users className="w-4 h-4" />
              <span>Grassroots Volunteer Operations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Community Cleanup Events
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Step into the field alongside local students, teachers, and environmental volunteers. Clear choking plastics from public roads, irrigation canals, and school zones.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Scheduled & Completed Cleanups
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verified community drives in Narasaraopet and Lingamguntla Agraharam.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-600">Loading events from database...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No scheduled events found</h4>
            <p className="text-xs text-slate-500 mt-1">Check back soon for upcoming village and campus drives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const regCount = evt.registered_count || evt.volunteers?.length || 0;
              const progressPct = Math.min(100, Math.round((regCount / (evt.target_volunteers || 1)) * 100));
              const eventDateObj = new Date(evt.event_date);
              const formattedDate = eventDateObj.toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={evt.id}
                  className="eco-card bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Status & Date Tag */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        evt.status === 'upcoming'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {evt.status}
                      </span>
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Location Details */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-start gap-2 font-semibold text-slate-800">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{evt.location_name}, {evt.address}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-6">
                        Organizer: {evt.organizer}
                      </p>
                    </div>

                    {/* Waste Collected metric if completed */}
                    {parseFloat(evt.waste_collected_kg) > 0 && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs">
                        <Trash2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-emerald-950 font-semibold">
                          Waste Cleared: <strong className="font-extrabold text-emerald-800">{evt.waste_collected_kg} kg</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Volunteer Progress & Button */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Volunteers Enrolled</span>
                        <span className="font-mono text-emerald-700">
                          {regCount} / {evt.target_volunteers}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block text-right">
                        {evt.target_volunteers - regCount > 0
                          ? `${evt.target_volunteers - regCount} spots remaining`
                          : 'Target capacity reached!'}
                      </span>
                    </div>

                    {evt.status === 'upcoming' ? (
                      <button
                        onClick={() => openVolunteerModal(evt)}
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Join as a Volunteer</span>
                      </button>
                    ) : (
                      <div className="text-center py-2 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl">
                        Event Completed
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Volunteer Registration Modal */}
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Volunteer Enrollment
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Join "{selectedEvent.title}"
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {selectedEvent.location_name}, {selectedEvent.city}
              </p>
            </div>

            {message ? (
              <div className={`p-4 rounded-xl text-xs space-y-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
                {message.type === 'success' && (
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2 bg-emerald-700 text-white font-bold rounded-lg mt-2"
                  >
                    Close Window
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98480 12345"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Contact / Guardian Phone</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+91 94400 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Equipment / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bringing cloth bags, trash pickers, or first-aid kit"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Enrolling earns +40 Eco Points towards your community rank.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Confirm Volunteer Participation'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default CleanupEvents;

