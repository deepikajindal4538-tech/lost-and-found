import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  MapPin,
  Sparkles,
  SearchCode,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemCardSkeleton from '../components/ItemCardSkeleton';
import { ITEM_CATEGORIES } from '../utils/constants';

export const Home = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/items/summary');
        if (data.success) {
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to load homepage summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lost?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-linear-to-b from-primary-100/40 via-white to-offwhite border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary-200/70 shadow-xs text-xs font-semibold text-primary-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>IIIT Allahabad Official Lost &amp; Found</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary-900 tracking-tight leading-tight">
                Lost something <br className="hidden sm:inline" />
                <span className="text-primary-500 underline decoration-primary-200 underline-offset-8">
                  on campus?
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Your belongings deserve a way back home. Connect with the IIITA community and find what you've lost.
              </p>

              {/* Integrated Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 relative flex items-center bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-soft-lg transition-shadow focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500"
              >
                <div className="pl-3.5 pr-2 text-primary-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by item name, library, hostel, or category..."
                  className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-hidden text-primary-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/report?type=lost"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost Item</span>
                </Link>

                <Link
                  to="/report?type=found"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Report Found Item</span>
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200 transition-colors"
                >
                  <span>How It Works</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Right Column: Editorial Hero Graphic */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Background decorative blob */}
                <div className="absolute -inset-4 bg-linear-to-tr from-primary-200/50 to-accent/40 rounded-3xl filter blur-2xl opacity-70 -z-10" />

                {/* Floating Preview Card 1 */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-soft-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary-900">Found on Campus</p>
                        <p className="text-[11px] text-muted">Central Library, 2nd Floor</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=200&q=80"
                      alt="AirPods"
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-primary-900 truncate">
                        AirPods Pro (2nd Gen)
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        White case with silicon plug
                      </p>
                      <p className="text-[10px] text-primary-600 font-medium mt-0.5">
                        Claimed &amp; Safely Handed Over
                      </p>
                    </div>
                  </div>

                  {/* Trust indicator */}
                  <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      In-App ID Verification
                    </span>
                    <span>100% Student Protected</span>
                  </div>
                </div>

                {/* Micro floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl py-2 px-3.5 border border-slate-200 shadow-soft-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-semibold text-primary-900">
                    Active IIITA Community
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1 p-3">
              <div className="inline-flex p-2.5 rounded-xl bg-primary-50 text-primary-600 mb-1">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary-900">
                {loading ? '...' : summary?.stats?.totalReported || 10}
              </p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Total Items Reported
              </p>
            </div>

            <div className="space-y-1 p-3">
              <div className="inline-flex p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {loading ? '...' : summary?.stats?.returnedCount || 2}
              </p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Successfully Returned
              </p>
            </div>

            <div className="space-y-1 p-3">
              <div className="inline-flex p-2.5 rounded-xl bg-amber-50 text-amber-600 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                {loading ? '...' : summary?.stats?.activeListings || 8}
              </p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Active Listings
              </p>
            </div>

            <div className="space-y-1 p-3">
              <div className="inline-flex p-2.5 rounded-xl bg-sky-50 text-sky-600 mb-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-700">
                {loading
                  ? '...'
                  : `${Math.round(
                      ((summary?.stats?.returnedCount || 2) /
                        (summary?.stats?.totalReported || 10)) *
                        100
                    )}%`}
              </p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Campus Recovery Rate
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Recently Found Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Available for Claim</span>
            </div>
            <h2 className="text-2xl font-bold text-primary-900 tracking-tight">
              Recently Found Items
            </h2>
            <p className="text-xs text-muted">
              Belongings discovered across CC3, Central Library, Mess, and hostels.
            </p>
          </div>

          <Link
            to="/found"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            <span>View All Found Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : summary?.recentFound?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.recentFound.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Package className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-primary-900">No found items reported yet.</p>
            <p className="text-xs text-muted mt-1">Found something? Be a good Samaritan and report it.</p>
          </div>
        )}
      </section>

      {/* Recently Lost Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Students Looking For</span>
            </div>
            <h2 className="text-2xl font-bold text-primary-900 tracking-tight">
              Recently Lost Belongings
            </h2>
            <p className="text-xs text-muted">
              Have you spotted any of these items around the IIITA campus?
            </p>
          </div>

          <Link
            to="/lost"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            <span>View All Lost Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : summary?.recentLost?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.recentLost.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Package className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-primary-900">No lost items currently listed.</p>
            <p className="text-xs text-muted mt-1">All campus belongings seem to be safe right now!</p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-b from-primary-50/50 to-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-900 tracking-tight">
              How CampusKhoj Works
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              A transparent, safe, and privacy-first way to reunite IIITA students with their missing belongings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-primary-900">
                Report your lost or found item
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Fill in the item category, campus location (CC3, Library, Mess), description, and upload a clear picture.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-primary-900">
                Browse listings &amp; connect safely
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Search with instant category and campus location filters. Send a secure claim request without public phone numbers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-primary-900">
                Verify ownership &amp; get it back
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                The finder reviews your unique proof of ownership and arranges a convenient handover point on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <h2 className="text-xl font-bold text-primary-900">Explore by Category</h2>
          <p className="text-xs text-muted">Quick access to commonly misplaced student items</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/lost?category=${encodeURIComponent(cat)}`}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-primary-400 shadow-soft text-center text-xs font-semibold text-primary-900 hover:text-primary-600 hover:bg-primary-50/50 transition-all card-hover"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
export default Home;
