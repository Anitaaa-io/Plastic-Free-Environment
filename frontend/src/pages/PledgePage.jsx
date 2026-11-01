import React, { useState, useEffect } from 'react';
import { pledgeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Award,
  Sparkles,
  CheckCircle2,
  MapPin,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Leaf,
  Heart,
  School,
  Check
} from 'lucide-react';

const PledgePage = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [fullName, setFullName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [city, setCity] = useState(user?.profile?.city || 'Narasaraopet');
  const [category, setCategory] = useState('individual');
  const [statement, setStatement] = useState("I pledge to minimize single-use plastics, adopt eco-friendly alternatives, and safeguard our local environment.");
  const [commitments, setCommitments] = useState([
    'carry_cloth_bags',
    'carry_water_bottle',
    'refuse_plastic_straws',
    'segregate_waste'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const commitmentOptions = [
    { id: 'carry_cloth_bags', label: 'Carry reusable cloth or jute bags for all market shopping' },
    { id: 'carry_water_bottle', label: 'Use a refillable stainless steel or copper water flask' },
    { id: 'refuse_plastic_straws', label: 'Refuse single-use plastic straws, stirrers, and disposable cutlery' },
    { id: 'segregate_waste', label: 'Segregate dry recyclable plastics from wet kitchen compost' },
    { id: 'avoid_packaged_items', label: 'Choose unpackaged fruits and vegetables from local vendors' },
    { id: 'educate_others', label: 'Educate at least 5 friends, students, or neighbors on plastic hazards' },
  ];

  const categoryLabels = {
    individual: 'Individual Citizen',
    student: 'Student / Youth',
    household: 'Household / Family',
    merchant: 'Merchant / Retailer',
    institution: 'School / Institution',
  };

  const fetchPledges = async () => {
    try {
      const res = await pledgeService.getPledges();
      setPledges(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching pledges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  const handleToggleCommitment = (id) => {
    if (commitments.includes(id)) {
      setCommitments(commitments.filter(c => c !== id));
    } else {
      setCommitments([...commitments, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commitments.length === 0) {
      setErrorMsg("Please select at least one eco-commitment.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        full_name: fullName,
        email: email,
        phone: phone,
        city: city,
        category: category,
        pledge_statement: statement,
        commitments: commitments,
      };
      const res = await pledgeService.createPledge(payload);
      setCertificateData(res.data);
      showToast('Pledge verified and registered! +50 Eco Points earned!', 'badge');
      if (user) {
        refreshProfile();
      }
      fetchPledges();
    } catch (err) {
      const msg = err.response?.data?.email || "Failed to record pledge. Please check email address.";
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-16 pb-20 bg-[#f7faf8] min-h-screen">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Official Citizen Charter & Digital Certificate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif">
              Plastic-Free Environment Pledge
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Make a certified commitment as a student, household, merchant, or citizen to eliminate single-use plastics. Receive your official digital certificate stamped by the CSP Research Committee.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {certificateData ? (
          /* Certificate View */
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pledge recorded in official database! +50 Eco Points awarded.</span>
              </div>
              <button
                onClick={() => setCertificateData(null)}
                className="font-bold underline text-emerald-800 hover:text-emerald-950"
              >
                Submit another pledge
              </button>
            </div>

            {/* Printable Certificate Frame */}
            <div className="bg-white rounded-3xl border-8 border-emerald-800 p-8 sm:p-12 shadow-2xl relative text-center space-y-6 print:border-4 print:p-6">
              
              {/* Decorative Corner Leaves */}
              <div className="absolute top-4 left-4 text-emerald-700 opacity-60">
                <Leaf className="w-8 h-8" />
              </div>
              <div className="absolute top-4 right-4 text-emerald-700 opacity-60 rotate-90">
                <Leaf className="w-8 h-8" />
              </div>
              <div className="absolute bottom-4 left-4 text-emerald-700 opacity-60 -rotate-90">
                <Leaf className="w-8 h-8" />
              </div>
              <div className="absolute bottom-4 right-4 text-emerald-700 opacity-60 rotate-180">
                <Leaf className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black tracking-widest uppercase text-emerald-800 font-mono">
                  B.TECH COMMUNITY SERVICE PROJECT — NARASARAOPET
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif pt-2">
                  Certificate of Environmental Commitment
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  PLASTIC-FREE ENVIRONMENT INITIATIVE • CSE (DATA SCIENCE)
                </p>
              </div>

              <div className="py-4 space-y-2">
                <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                  This certificate is officially presented to:
                </p>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900 border-b-2 border-emerald-600 inline-block px-8 pb-1 font-serif">
                  {certificateData.full_name}
                </div>
                <p className="text-xs text-slate-500 font-medium pt-1">
                  Category: <span className="font-bold text-emerald-800">{categoryLabels[certificateData.category] || 'Citizen'}</span> • {certificateData.city}, Andhra Pradesh
                </p>
              </div>

              <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{certificateData.pledge_statement}"
              </p>

              {/* Commitments list */}
              <div className="max-w-lg mx-auto flex flex-wrap justify-center gap-1.5 pt-2">
                {certificateData.commitments?.map((c, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-3 items-end text-xs">
                <div className="text-left space-y-1">
                  <div className="font-mono text-[10px] text-slate-400">Pledge ID: #{certificateData.id}</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Date: {new Date(certificateData.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 mb-1 shadow-sm">
                    <Award className="w-7 h-7 text-emerald-700" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 font-mono">
                    VERIFIED SEAL
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-800 text-[11px]">CSP Research Committee</div>
                  <div className="text-[10px] text-slate-500">Dept. of CSE (Data Science)</div>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print or Save as PDF</span>
              </button>
            </div>

          </div>
        ) : (
          /* Form View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-eco">
              <div className="mb-6 space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Citizen Charter
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-serif">
                  Fill In Your Pledge Commitment
                </h2>
                <p className="text-xs text-slate-500">
                  Join hundreds of students, teachers, and citizens across Narasaraopet & Lingamguntla Agraharam.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. B. Bhavya Sai Sri"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pledge Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                    >
                      <option value="individual">Individual Citizen</option>
                      <option value="student">Student / Youth</option>
                      <option value="household">Household / Family</option>
                      <option value="merchant">Merchant / Retailer</option>
                      <option value="institution">School / Institution</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94400 00000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Village *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Narasaraopet"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Commitments Checklist */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 block">
                    Select Your Specific Eco Commitments: *
                  </label>
                  <div className="space-y-2">
                    {commitmentOptions.map((opt) => {
                      const isChecked = commitments.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleToggleCommitment(opt.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs leading-snug">{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Pledge Statement</label>
                  <textarea
                    rows={2}
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>{submitting ? 'Recording Pledge...' : 'Take the Pledge & Generate Certificate (+50 pts)'}</span>
                </button>

              </form>
            </div>

            {/* Live Feed Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-300 uppercase tracking-wider">
                  Community Roll
                </span>
                <h3 className="text-xl font-extrabold font-serif">Recent Plastic-Free Pledges</h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Real citizens, students, and merchants who have officially committed to eliminating disposable plastics.
                </p>
              </div>

              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {pledges.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                          {p.full_name ? p.full_name[0] : 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900">{p.full_name}</h4>
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 font-semibold rounded">
                              {categoryLabels[p.category] || 'Citizen'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                            {p.city}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">
                      "{p.pledge_statement}"
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {p.commitments?.map((c, i) => (
                        <span key={i} className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                          ✓ {c.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </section>

    </div>
  );
};

export default PledgePage;
