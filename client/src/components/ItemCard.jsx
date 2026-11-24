import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ItemCard = ({ item }) => {
  const isFound = item.type === 'found';
  const isReturned = item.status === 'returned';
  const isClaimed = item.status === 'claimed';

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Default fallback image if none provided
  const placeholderImage = isFound
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=800&q=80';

  const imageUrl = item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : placeholderImage;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden card-hover flex flex-col h-full">
      {/* Image & Type / Status Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isFound
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {isFound ? 'Found' : 'Lost'}
          </span>

          {isReturned && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/85 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Returned
            </span>
          )}

          {isClaimed && !isReturned && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
              Claim in Progress
            </span>
          )}
        </div>

        {/* Category Pill on Image Bottom */}
        <div className="absolute bottom-2.5 left-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/95 text-primary-800 backdrop-blur-xs shadow-xs">
            <Tag className="w-3 h-3 text-primary-500" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-primary-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1.5">
            {item.title}
          </h3>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Meta details */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5 truncate max-w-[170px]" title={item.location}>
              <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="truncate font-medium text-slate-700">{item.location}</span>
            </span>

            <span className="flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>{formatDate(item.date)}</span>
            </span>
          </div>

          {/* Action Button */}
          <Link
            to={`/items/${item._id}`}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-white bg-primary-50 hover:bg-primary-500 py-2 px-3 rounded-xl transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ItemCard;
