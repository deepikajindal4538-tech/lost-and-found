import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  UserCheck,
  Shield,
  Flag,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Trash2,
  Edit3,
  HelpCircle,
  FileCheck,
  Info,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import ClaimModal from '../components/ClaimModal';
import ReportListingModal from '../components/ReportListingModal';
import EditItemModal from '../components/EditItemModal';
import toast from 'react-hot-toast';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/items/${id}`);
        if (data.success) {
          setItem(data.item);
          setRelatedItems(data.relatedItems || []);
        }
      } catch (err) {
        console.error('Failed to load item:', err);
        toast.error('Item not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const isOwner =
    user && item && item.postedBy && user.id === item.postedBy._id;
  const canManage = isOwner || isAdmin;
  const isFound = item?.type === 'found';
  const isReturned = item?.status === 'returned';

  const handleMarkReturned = async () => {
    if (!confirm('Mark this item as returned to its rightful owner?')) return;
    try {
      const { data } = await api.put(`/api/items/${item._id}`, {
        status: isReturned ? 'open' : 'returned',
      });
      if (data.success) {
        setItem(data.item);
        toast.success(
          isReturned
            ? 'Listing reopened.'
            : 'Item successfully marked as returned! Great job!'
        );
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteItem = async () => {
    if (!confirm('Are you sure you want to permanently delete this listing?'))
      return;
    try {
      const { data } = await api.delete(`/api/items/${item._id}`);
      if (data.success) {
        toast.success('Listing deleted.');
        navigate(item.type === 'found' ? '/found' : '/lost');
      }
    } catch (err) {
      toast.error('Failed to delete listing.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `CampusKhoj IIITA listing: ${item.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted">Loading campus listing details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-primary-900">Listing Not Found</h2>
        <p className="text-xs text-muted">
          This post may have been removed or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-500 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const placeholderImage = isFound
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=1200&q=80';

  const imageUrl = item.imageUrl || placeholderImage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button and Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-500 hover:text-primary-700 bg-white border border-slate-200 rounded-xl shadow-xs transition-colors"
            title="Share listing link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {!isOwner && (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please log in to report a listing.');
                  navigate('/login');
                  return;
                }
                setReportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Listing</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Item Card Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Large Image */}
          <div className="lg:col-span-7 bg-slate-100 flex items-center justify-center p-4 sm:p-6 relative">
            <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-200 shadow-inner relative">
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md shadow-xs ${
                    isFound
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}
                >
                  {isFound ? 'Found' : 'Lost'}
                </span>

                {isReturned && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Returned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-primary-700 bg-primary-100/70 px-2.5 py-1 rounded-lg">
                  <Tag className="w-3.5 h-3.5 text-primary-500" />
                  {item.category}
                </span>

                <span className="text-muted">
                  ID: #{item._id.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary-900 leading-tight">
                {item.title}
              </h1>

              {/* Location and Date Details */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                <div className="space-y-0.5">
                  <span className="text-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    Campus Location
                  </span>
                  <p className="font-bold text-primary-900">{item.location}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    Date {isFound ? 'Found' : 'Lost'}
                  </span>
                  <p className="font-bold text-primary-900">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-primary-800 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Additional Identifying Details */}
              {item.additionalDetails && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-primary-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary-500" />
                    Verification Notes &amp; Clues
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.additionalDetails}
                  </p>
                </div>
              )}

              {/* Posted by User Info Card */}
              <div className="p-3.5 bg-primary-50/50 border border-primary-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                    {item.postedBy?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-900">
                      {item.postedBy?.name || 'IIITA Student'}
                    </p>
                    <p className="text-[11px] text-muted">
                      Roll No: {item.postedBy?.rollNumber || 'Verified IIITA'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-primary-700 bg-white border border-primary-200 px-2 py-0.5 rounded-md">
                  {isFound ? 'Finder' : 'Reporter'}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              
              {/* If owner or admin */}
              {canManage ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkReturned}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                        isReturned
                          ? 'bg-slate-800 hover:bg-slate-900 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isReturned ? 'Reopen Listing' : 'Mark as Returned'}</span>
                    </button>

                    <button
                      onClick={() => setEditModalOpen(true)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-primary-800 rounded-xl transition-colors"
                      title="Edit listing details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleDeleteItem}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted text-center">
                    You posted this listing. You can update or mark it returned anytime.
                  </p>
                </div>
              ) : (
                /* Not owner: show Claim / Contact Finder */
                <div className="space-y-2">
                  {isFound ? (
                    <button
                      disabled={isReturned}
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error('Please log in to claim an item.');
                          navigate('/login');
                          return;
                        }
                        setClaimModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-soft transition-all active:scale-[0.98]"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{isReturned ? 'Item Already Returned' : 'Claim This Item'}</span>
                    </button>
                  ) : (
                    <button
                      disabled={isReturned}
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error('Please log in to contact the owner.');
                          navigate('/login');
                          return;
                        }
                        setClaimModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-soft transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isReturned ? 'Item Found & Returned' : 'I Found This Item!'}</span>
                    </button>
                  )}

                  <p className="text-[11px] text-muted text-center leading-relaxed">
                    Personal contact information is exchanged safely upon proof verification.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary-900">
                Related Campus Listings
              </h2>
              <p className="text-xs text-muted">
                Similar items in {item.category} or nearby {item.location}
              </p>
            </div>
            <Link
              to={isFound ? '/found' : '/lost'}
              className="text-xs font-semibold text-primary-600 hover:text-primary-800"
            >
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <ItemCard key={rel._id} item={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ClaimModal
        item={item}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaimSubmitted={() => {
          // Refresh item
        }}
      />

      <ReportListingModal
        item={item}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <EditItemModal
        item={item}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onItemUpdated={(updated) => setItem(updated)}
      />

    </div>
  );
};
export default ItemDetails;
