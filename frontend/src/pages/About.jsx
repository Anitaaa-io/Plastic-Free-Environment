import React from 'react';
import {
  Users,
  Award,
  BookOpen,
  MapPin,
  Calendar,
  CheckCircle,
  GraduationCap,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const students = [
    {
      name: 'B. Bhavya Sai Sri',
      roll: '24471A4402',
      dept: 'CSE (Data Science)',
      role: 'Student Researcher & Team Lead'
    },
    {
      name: 'M. Aparna',
      roll: '24471A4425',
      dept: 'CSE (Data Science)',
      role: 'Survey Coordination & Data Analytics'
    },
    {
      name: 'N. Esther Rani',
      roll: '24471A4435',
      dept: 'CSE (Data Science)',
      role: 'Field Activity & Documentation'
    },
    {
      name: 'T. Anitha',
      roll: '24471A4461',
      dept: 'CSE (Data Science)',
      role: 'Outreach & Alternative Solutions'
    }
  ];

  const faculty = [
    { name: 'Mr. P. Srinivasarao', role: 'Faculty Guide', dept: 'Department of CSE (DS)' },
    { name: 'Mr. P. Solman', role: 'Faculty Guide', dept: 'Department of CSE (DS)' },
    { name: 'Mr. N. Siva Rama Krishna', role: 'Faculty Guide', dept: 'Department of CSE (DS)' },
    { name: 'Mr. B. Veera Brahmam', role: 'Faculty Guide', dept: 'Department of CSE (DS)' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Identify Community Problem',
      desc: 'Selected excessive single-use plastic disposal and lack of segregated recycling in rural communities as the focal challenge.'
    },
    {
      step: '02',
      title: 'Plan & Formulate Tools',
      desc: 'Designed field survey questionnaires, educational visual charts, and alternative product demonstration kits.'
    },
    {
      step: '03',
      title: 'Field Visit & Engagement',
      desc: 'Conducted field study on 29 June 2026 at ZPH School Lingamguntla Agraharam, meeting students, staff, and village residents.'
    },
    {
      step: '04',
      title: 'Interactive Education',
      desc: 'Delivered interactive presentations, guided discussions on microplastics, and collected direct survey responses.'
    },
    {
      step: '05',
      title: 'Analyze & Deliver Platform',
      desc: 'Synthesized data, mapped real-world solutions (Kannur & Sikkim models), and built this complete digital sustainability platform.'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>B.Tech Community Service Project (CSP)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              About The Project & Team
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Preserving verified research, grassroots field interactions, and actionable software solutions for environmental sustainability in Narasaraopet Mandal.
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-eco space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Official Project Title
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                "Plastic Free Environment"
              </h2>
            </div>
            <div className="text-left md:text-right space-y-1 text-xs text-slate-500">
              <p><strong className="text-slate-800">Department:</strong> CSE (Data Science)</p>
              <p><strong className="text-slate-800">Location:</strong> Narasaraopet, Palnadu District, AP</p>
              <p><strong className="text-slate-800">Target Community:</strong> Lingamguntla Agraharam (PIN: 522601)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Our Core Purpose</span>
              </h3>
              <p>
                Single-use plastics pose severe irreversible damage to rural agriculture, soil aeration, cattle health, and rural water bodies. In our field visits, we identified that despite widespread public awareness campaigns, practical substitution and organized waste reporting remained major barriers.
              </p>
              <p>
                Our objective was to bridge this gap: not only by conducting verified classroom education at ZPH School Lingamguntla Agraharam on 29 June 2026, but also by engineering a digital platform where citizens can continuously report plastic dumping, log personal eco-actions, and register for community cleanups.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <span>Key Learning Outcomes</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Understood ground-level causes and rural agricultural impacts of plastic waste accumulation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Practised direct community engagement, student moderation, and survey administration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Analyzed empirical survey patterns and mapped actionable civic solutions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Designed and deployed a full-stack sustainability web platform with authentication and real database storage.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full">
            Systematic Approach
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Our 5-Stage Project Methodology
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Followed rigorously during the B.Tech Community Service Project execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-emerald-200 block mb-2 font-mono">
                  {s.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Team & Faculty Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Student Researchers */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="text-xl font-extrabold text-slate-900">
              Student Research Team (Submitted By)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {students.map((student, i) => (
              <div key={i} className="eco-card bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  {student.name.split(' ')[0][0]}
                </div>
                <h4 className="text-base font-bold text-slate-900">{student.name}</h4>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold mt-1 border border-emerald-200">
                  {student.roll}
                </div>
                <p className="text-xs text-emerald-700 font-semibold mt-2">{student.dept}</p>
                <p className="text-[11px] text-slate-500 mt-1">{student.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Guides */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <h3 className="text-xl font-extrabold text-slate-900">
              Under Guidance (Faculty Mentors)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {faculty.map((mentor, i) => (
              <div key={i} className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-300 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  G{i + 1}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
                <p className="text-xs text-emerald-700 font-semibold mt-1">{mentor.role}</p>
                <p className="text-[11px] text-slate-500">{mentor.dept}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Field Visit Location & Verified Gallery Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geographic Scope</span>
              </div>
              <h3 className="text-2xl font-extrabold">Study Area: Lingamguntla Agraharam (Rural)</h3>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                Zilla Parishad High School (ZPH School) | Narasaraopet Mandal | PIN 522601
              </p>
            </div>
            <div className="text-xs bg-emerald-800/80 px-4 py-2 rounded-xl border border-emerald-700 shrink-0">
              Field Visit Date: <span className="font-bold text-white">29 June 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="overflow-hidden rounded-xl aspect-square border border-emerald-700/50">
              <img
                src="/images/gallery_educational_activity.jpg"
                alt="Educational Activity"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square border border-emerald-700/50">
              <img
                src="/images/gallery_student_interaction.jpg"
                alt="Student Interaction"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square border border-emerald-700/50">
              <img
                src="/images/gallery_school_group_activity.jpg"
                alt="School Group Activity"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square border border-emerald-700/50">
              <img
                src="/images/gallery_team_at_school.jpg"
                alt="Team at the School"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;

