import React, { useState } from 'react';
import { contactService } from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle
} from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      await contactService.sendMessage({
        name,
        email,
        phone,
        subject,
        message,
      });
      setStatusMsg({ type: 'success', text: 'Thank you! Your inquiry has been sent to our project team and recorded in the database.' });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to deliver message. Please verify all fields and retry.' });
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What happens after I submit a plastic waste report?",
      a: "Reports are reviewed by student coordinators and routed to the respective village Gram Panchayat or municipal sanitation teams. High-severity locations are prioritized for upcoming community volunteer cleanups."
    },
    {
      q: "Can I receive Community Service Project credit for volunteering?",
      a: "Yes! Registered students who participate in verified cleanup events and log consistent plastic-free activities on our Eco Tracker receive verified participation records."
    },
    {
      q: "Where was the core empirical field survey conducted?",
      a: "Our team conducted on-site field visits and classroom awareness briefings at Zilla Parishad High School (ZPH School), Lingamguntla Agraharam (PIN: 522601), Narasaraopet Mandal, Andhra Pradesh."
    },
    {
      q: "How can local merchants partner to eliminate plastic bags?",
      a: "Shopkeepers and street vendors can submit a message above to receive subsidized cloth bag distribution kits and display the 'Plastic-Free Partner' badge."
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Mail className="w-4 h-4" />
              <span>Direct Communication</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Get in Touch with Our Team
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Have questions regarding our community cleanup events, waste report follow-ups, or campus workshops? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-eco space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Send a Message
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Community Inquiry & Collaboration Form
              </h2>
            </div>

            {statusMsg && (
              <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94400 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Organizing cleanup drive in Lingamguntla Agraharam"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, query, or feedback here..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>

          {/* Info Card & Study Area */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-5">
              <h3 className="text-xl font-extrabold">Field Research Headquarters</h3>
              
              <div className="space-y-4 text-xs text-emerald-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Study Area & Community Center:</strong>
                    Lingamguntla Agraharam (Rural) & ZPH School Campus, Narasaraopet Mandal, Palnadu District, Andhra Pradesh - PIN 522601
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Email Correspondence:</strong>
                    csp.plasticfree@gmail.com
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Coordinator Helpline:</strong>
                    +91 94401 23456 / +91 94402 34567
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Community Outreach Hours:</strong>
                    Monday – Saturday: 9:00 AM – 5:00 PM IST
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800 text-[11px] text-emerald-200">
                Verified Community Service Project under Department of CSE (Data Science).
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3 text-xs">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <h4 className="font-bold text-slate-800">{faq.q}</h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;

