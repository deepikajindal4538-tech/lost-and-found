import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 text-primary-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary-900">
                Campus<span className="text-primary-500">Khoj</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              "Lost something? Let's help you find it."
            </p>
            <p className="text-xs text-muted leading-relaxed">
              The official centralized Lost &amp; Found network for students, faculty, and staff of Indian Institute of Information Technology, Allahabad.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-primary-600 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>Devghat, Jhalwa, Prayagraj — 211015</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-muted hover:text-primary-700 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/lost" className="text-muted hover:text-primary-700 transition-colors">
                  Browse Lost Items
                </Link>
              </li>
              <li>
                <Link to="/found" className="text-muted hover:text-primary-700 transition-colors">
                  Browse Found Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-muted hover:text-primary-700 transition-colors">
                  Report Missing Belonging
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted hover:text-primary-700 transition-colors">
                  How CampusKhoj Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Hotspots */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-900">
              Key Campus Locations
            </h4>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>• Central Library &amp; Reading Rooms</li>
              <li>• Computer Center 3 (CC3) &amp; Labs</li>
              <li>• Main Auditorium &amp; Open Air Theater</li>
              <li>• Boys Hostels (BH1 - BH5) &amp; GH Complex</li>
              <li>• Sports Complex &amp; Swimming Pool</li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-900">
              Security &amp; Privacy
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Student identities and personal phone numbers remain protected behind an in-app claim verification workflow.
            </p>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-primary-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>IIITA Campus Verification Active</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} CampusKhoj • Indian Institute of Information Technology, Allahabad</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary-700 cursor-pointer">About IIITA</span>
            <span className="hover:text-primary-700 cursor-pointer">Campus Safety</span>
            <span className="hover:text-primary-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary-700 cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
