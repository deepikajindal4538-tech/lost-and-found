import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MapPin,
  ArrowRight,
  HelpCircle,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          Campus Protocol &amp; Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-900 tracking-tight">
          How CampusKhoj Works
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Designed specifically for the students, scholars, and staff of IIIT Allahabad. Learn how we verify ownership and protect your privacy.
        </p>
      </div>

      {/* 3 Step Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-extrabold text-xl">
            1
          </div>
          <h3 className="text-base font-bold text-primary-900">
            1. Report Your Item
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Whether you lost your calculator in CC3 Lab or found a wildcraft backpack outside Academic Block 2, publish a listing with location, date, and photo.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-extrabold text-xl">
            2
          </div>
          <h3 className="text-base font-bold text-primary-900">
            2. In-App Claim &amp; Proof
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Instead of exposing private phone numbers to the entire internet, claimants describe distinctive details (serial numbers, scratches, wallpaper) directly through the portal.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-xl">
            3
          </div>
          <h3 className="text-base font-bold text-primary-900">
            3. Safe Handover on Campus
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Once the finder verifies the claimant's answer, they accept the claim, unlocking meeting notes to arrange a physical pickup at a designated campus hotspot.
          </p>
        </div>
      </div>

      {/* Safe Campus Handover Spots */}
      <div className="bg-linear-to-b from-primary-50/70 to-white rounded-3xl p-8 sm:p-10 border border-primary-100 shadow-soft space-y-6">
        <div className="max-w-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-primary-500" />
            Recommended Handover Locations
          </div>
          <h2 className="text-xl font-bold text-primary-900">
            Where to exchange belongings safely at IIITA
          </h2>
          <p className="text-xs text-muted">
            For personal security and peace of mind, we advise conducting physical handovers in well-lit public zones:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <p className="font-bold text-xs text-primary-900">Central Library</p>
            <p className="text-[11px] text-muted mt-0.5">
              Ground floor main entrance security desk
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <p className="font-bold text-xs text-primary-900">CC3 Building</p>
            <p className="text-[11px] text-muted mt-0.5">
              Computer Center 3 central atrium or reception
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <p className="font-bold text-xs text-primary-900">Hostel Caretaker Desk</p>
            <p className="text-[11px] text-muted mt-0.5">
              Respective BH (1-5) or GH caretaker reception
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <p className="font-bold text-xs text-primary-900">Main Cafeteria / Mess</p>
            <p className="text-[11px] text-muted mt-0.5">
              Daytime public seating area
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-primary-900">
              Why do I need an @iiita.ac.in email address?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Restricting registration to official college accounts guarantees that every listing and claim is associated with a verified IIITA roll number, eliminating anonymous spam and theft attempts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-primary-900">
              Is my personal phone number displayed publicly?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              No. We strictly protect student privacy. Your phone number is never displayed on public listings. Claims and handover notes are handled exclusively inside the platform.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-primary-900">
              What if a fraudulent claim is submitted?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              As the post owner, you have the full authority to reject any claim that cannot describe specific unique features. You can also click "Report Listing" to alert campus administrators.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center space-y-4 shadow-soft">
        <h3 className="text-xl font-bold text-primary-900">
          Ready to reunite with your lost belongings?
        </h3>
        <p className="text-xs text-muted max-w-md mx-auto">
          Start browsing active campus listings or post a new report in under 60 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/report"
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-soft transition-all"
          >
            Report an Item
          </Link>
          <Link
            to="/found"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-primary-900 font-semibold text-xs rounded-xl transition-colors"
          >
            Browse Found Items
          </Link>
        </div>
      </div>

    </div>
  );
};
export default HowItWorks;
