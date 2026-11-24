import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  PackageOpen,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import ItemCardSkeleton from '../components/ItemCardSkeleton';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';

export const FoundItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [dateRange, setDateRange] = useState(searchParams.get('dateRange') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [includeReturned, setIncludeReturned] = useState(
    searchParams.get('includeReturned') === 'true'
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync state to URL and fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = {
          type: 'found',
          page,
          limit: 12,
          sort,
          includeReturned: includeReturned ? 'true' : 'false',
        };

        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (location && location !== 'All') params.location = location;
        if (dateRange) params.dateRange = dateRange;

        const { data } = await api.get('/items', { params });
        if (data.success) {
          setItems(data.items);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch found items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search, category, location, dateRange, sort, includeReturned, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setDateRange('');
    setSort('newest');
    setIncludeReturned(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Found Belongings Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900 tracking-tight">
            Found Items on Campus
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
            Items safely turned in or held by students across IIIT Allahabad. Recognize something that belongs to you? Click to submit a verification claim!
          </p>
        </div>

        <Link
          to="/report?type=found"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.98] shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Report a Found Item</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search found items (e.g. keys, calculator, sunglasses, bottle, AirPods)..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-primary-900"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="All">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Campus Location
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="All">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Date Found
            </label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Reset & Status Toggle */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1.5">
              <input
                type="checkbox"
                id="includeReturnedFound"
                checked={includeReturned}
                onChange={(e) => setIncludeReturned(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="includeReturnedFound" className="text-xs text-muted select-none">
                Show returned items
              </label>
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-1.5 text-xs text-muted hover:text-primary-800 p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <p>
          Showing <span className="font-bold text-primary-900">{items.length}</span> of{' '}
          <span className="font-bold text-primary-900">{total}</span> found listings
        </p>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-muted">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-primary-900">
            No matching found items located
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Try adjusting your search query, or check back soon as new items are turned in daily.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-muted px-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};
export default FoundItems;
