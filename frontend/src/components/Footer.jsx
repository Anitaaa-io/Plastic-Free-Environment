import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Shield, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                PLASTIC-FREE
              </span>
            </div>
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              A comprehensive Community Service Project (CSP) engineered to eliminate single-use plastics, empower rural communities, and promote circular eco-alternatives.
            </p>
            <div className="pt-2 text-xs text-emerald-300/90 font-medium">
              <p className="font-bold text-white mb-1">Academic Affiliation:</p>
              <p>B.Tech CSE (Data Science) Project Initiative</p>
              <p>Lingamguntla Agraharam & Narasaraopet, AP</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Project & Team
                </Link>
              </li>
              <li>
                <Link to="/plastic-pollution" className="hover:text-white transition-colors">
                  Plastic Pollution Science
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="hover:text-white transition-colors">
                  Eco-Friendly Alternatives
                </Link>
              </li>
              <li>
                <Link to="/awareness-tips" className="hover:text-white transition-colors">
                  5 R's & Everyday Habits
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-white transition-colors">
                  Community Campaigns
                </Link>
              </li>
              <li>
                <Link to="/cleanup-events" className="hover:text-white transition-colors">
                  Upcoming Cleanup Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Action Modules */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Citizen Action
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link to="/pledge" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Take Plastic-Free Pledge
                </Link>
              </li>
              <li>
                <Link to="/waste-reports" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Report Plastic Dumping
                </Link>
              </li>
              <li>
                <Link to="/eco-tracker" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Log Daily Eco Actions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Community Feedback & Suggestions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Member / Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Study Area & Contact */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Field Study Center
            </h4>
            <div className="space-y-3 text-sm text-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span>
                  Lingamguntla Agraharam (Rural) & ZPH School, Narasaraopet Mandal, Palnadu Dist., AP - 522601
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>csp.plasticfree@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 94401 23456</span>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-900/60 text-xs text-emerald-300">
                GPS Verified Field Work: <span className="font-semibold text-white">29 June 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>
            © {new Date().getFullYear()} Plastic-Free Environment Platform. Built for B.Tech Community Service Project demonstration.
          </p>
          <div className="flex items-center gap-6">
            <span>Preserve Earth. Refuse Single-Use.</span>
            <span className="flex items-center gap-1 text-emerald-300">
              Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" /> for community impact
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

