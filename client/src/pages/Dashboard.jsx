import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  FileCheck,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EditItemModal from '../components/EditItemModal';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost', 'found', 'myClaims', 'receivedClaims', 'returned'
  const [loading, setLoading] = useState(true);

  // Data states
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);

  // Selected item for edit modal
  const [editingItem, setEditingItem] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Response note state for handling received claims
  const [claimResponseNote, setClaimResponseNote] = useState({});
  const [processingClaimId, setProcessingClaimId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, myClaimsRes, receivedClaimsRes] = await Promise.all([
        api.get('/items/user/me'),
        api.get('/claims/my'),
        api.get('/claims/received'),
      ]);

      if (itemsRes.data.success) {
        setLostItems(itemsRes.data.lostItems || []);
        setFoundItems(itemsRes.data.foundItems || []);
        setReturnedItems(itemsRes.data.returnedItems || []);
      }

      if (myClaimsRes.data.success) {
        setMyClaims(myClaimsRes.data.claims || []);
      }

      if (receivedClaimsRes.data.success) {
        setReceivedClaims(receivedClaimsRes.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
      toast.error('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to permanently delete this listing?'))
      return;
    try {
      const { data } = await api.delete(`/items/${itemId}`);
      if (data.success) {
        toast.success('Listing deleted.');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete item.');
    }
  };

  const handleToggleReturned = async (item) => {
    const isReturned = item.status === 'returned';
    try {
      const { data } = await api.put(`/items/${item._id}`, {
        status: isReturned ? 'open' : 'returned',
      });
      if (data.success) {
        toast.success(
          isReturned ? 'Listing reopened.' : 'Marked as returned to owner!'
        );
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleClaimAction = async (claimId, status) => {
    try {
      setProcessingClaimId(claimId);
      const note = claimResponseNote[claimId] || '';
      const { data } = await api.put(`/claims/${claimId}`, {
        status,
        responseNote: note,
        markItemReturned: status === 'accepted',
      });

      if (data.success) {
        toast.success(
          status === 'accepted'
            ? 'Claim accepted! Handover details revealed to student.'
            : 'Claim rejected.'
        );
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to process claim.');
    } finally {
      setProcessingClaimId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center font-bold text-xl shadow-soft">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary-900">
                {user?.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-muted">
              {user?.email} • Roll No: <span className="font-semibold text-primary-800">{user?.rollNumber}</span>
            </p>
          </div>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.98] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Item</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('lost')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'lost'
              ? 'bg-rose-500 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>My Lost Items</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {lostItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('found')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'found'
              ? 'bg-emerald-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>My Found Items</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {foundItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('receivedClaims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'receivedClaims'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Incoming Claims</span>
          {receivedClaims.filter((c) => c.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          )}
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {receivedClaims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('myClaims')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'myClaims'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>My Sent Claims</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {myClaims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('returned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'returned'
              ? 'bg-slate-800 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Items Returned</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {returnedItems.length}
          </span>
        </button>
      </div>

      {/* Tab Content Display */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted">Refreshing your campus records...</p>
        </div>
      ) : (
        <div>
          {/* TAB: MY LOST ITEMS */}
          {activeTab === 'lost' && (
            <div className="space-y-4">
              {lostItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Lost
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-primary-900 line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="text-xs text-muted flex items-center justify-between pt-1">
                          <span>{item.location}</span>
                          <span className="font-semibold text-primary-700">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                        <Link
                          to={`/items/${item._id}`}
                          className="p-2 text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
                          title="View public details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setEditModalOpen(true);
                            }}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleReturned(item)}
                            className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
                          >
                            Mark Found
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <Package className="w-10 h-10 text-muted mx-auto opacity-40" />
                  <p className="text-sm font-bold text-primary-900">
                    No active lost listings
                  </p>
                  <p className="text-xs text-muted">
                    Misplaced something? Report it to alert students across IIITA.
                  </p>
                  <Link
                    to="/report?type=lost"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-xl"
                  >
                    Report Lost Item
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: MY FOUND ITEMS */}
          {activeTab === 'found' && (
            <div className="space-y-4">
              {foundItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Found
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-primary-900 line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="text-xs text-muted flex items-center justify-between pt-1">
                          <span>{item.location}</span>
                          <span className="font-semibold text-primary-700">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                        <Link
                          to={`/items/${item._id}`}
                          className="p-2 text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
                          title="View public details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setEditModalOpen(true);
                            }}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleReturned(item)}
                            className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors"
                          >
                            Mark Returned
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <Package className="w-10 h-10 text-muted mx-auto opacity-40" />
                  <p className="text-sm font-bold text-primary-900">
                    No found items reported by you
                  </p>
                  <p className="text-xs text-muted">
                    Found an unattended bag, ID card, or keys? Help return it!
                  </p>
                  <Link
                    to="/report?type=found"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
                  >
                    Report Found Item
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: INCOMING CLAIMS ON MY POSTS */}
          {activeTab === 'receivedClaims' && (
            <div className="space-y-4">
              {receivedClaims.length > 0 ? (
                <div className="space-y-4">
                  {receivedClaims.map((claim) => (
                    <div
                      key={claim._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-xs text-muted">
                            Claim for your found item:
                          </span>
                          <h3 className="font-bold text-base text-primary-900">
                            {claim.itemId?.title || 'Campus Belonging'}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              claim.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : claim.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {claim.status}
                          </span>
                        </div>
                      </div>

                      {/* Claimant Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                        <div>
                          <p className="font-bold text-primary-900 mb-1">
                            Claimant Information:
                          </p>
                          <p className="text-primary-800 font-medium">
                            {claim.claimantId?.name} ({claim.claimantId?.rollNumber})
                          </p>
                          <p className="text-muted">{claim.claimantId?.email}</p>
                          {claim.contactDetails && (
                            <p className="text-primary-700 mt-1 font-medium">
                              Handover Note: {claim.contactDetails}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-primary-900 mb-1">
                            Their Proof of Ownership:
                          </p>
                          <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200">
                            "{claim.message}"
                          </p>
                        </div>
                      </div>

                      {/* Action buttons if pending */}
                      {claim.status === 'pending' ? (
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Optional note to claimant (e.g. meet me at CC3 Lab 2 at 4 PM)..."
                            value={claimResponseNote[claim._id] || ''}
                            onChange={(e) =>
                              setClaimResponseNote({
                                ...claimResponseNote,
                                [claim._id]: e.target.value,
                              })
                            }
                            className="w-full sm:max-w-md text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
                          />

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              disabled={processingClaimId === claim._id}
                              onClick={() => handleClaimAction(claim._id, 'rejected')}
                              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50"
                            >
                              Reject Claim
                            </button>
                            <button
                              disabled={processingClaimId === claim._id}
                              onClick={() => handleClaimAction(claim._id, 'accepted')}
                              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-soft transition-all disabled:opacity-50"
                            >
                              Accept &amp; Return
                            </button>
                          </div>
                        </div>
                      ) : (
                        claim.responseNote && (
                          <p className="text-xs text-muted">
                            Your response note: <span className="font-medium text-slate-800">{claim.responseNote}</span>
                          </p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <FileCheck className="w-10 h-10 text-muted mx-auto opacity-40" />
                  <p className="text-sm font-bold text-primary-900">
                    No incoming claims yet
                  </p>
                  <p className="text-xs text-muted">
                    When someone claims an item you found, you will review their ownership proof here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: MY SENT CLAIMS */}
          {activeTab === 'myClaims' && (
            <div className="space-y-4">
              {myClaims.length > 0 ? (
                <div className="space-y-4">
                  {myClaims.map((claim) => (
                    <div
                      key={claim._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs text-muted">
                            You claimed item:
                          </span>
                          <h3 className="font-bold text-base text-primary-900">
                            {claim.itemId?.title || 'Campus Item'}
                          </h3>
                        </div>

                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start ${
                            claim.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {claim.status === 'accepted'
                            ? 'Claim Accepted!'
                            : claim.status === 'rejected'
                            ? 'Claim Declined'
                            : 'Pending Finder Review'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-primary-900">
                          Your Proof Provided:
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          "{claim.message}"
                        </p>
                      </div>

                      {claim.status === 'accepted' && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Finder Verified Your Claim!
                          </p>
                          <p>
                            Finder Name: <span className="font-bold">{claim.ownerId?.name}</span> ({claim.ownerId?.email})
                          </p>
                          {claim.responseNote && (
                            <p className="pt-1 text-emerald-800">
                              Handover Instructions: "{claim.responseNote}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <FileCheck className="w-10 h-10 text-muted mx-auto opacity-40" />
                  <p className="text-sm font-bold text-primary-900">
                    No claims sent yet
                  </p>
                  <p className="text-xs text-muted">
                    If you see your lost belonging listed under Found Items, submit a claim to connect!
                  </p>
                  <Link
                    to="/found"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-xs font-semibold rounded-xl"
                  >
                    Browse Found Items
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: ITEMS RETURNED */}
          {activeTab === 'returned' && (
            <div className="space-y-4">
              {returnedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {returnedItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 flex flex-col justify-between space-y-4 opacity-90"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Successfully Returned
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-primary-900 line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-muted">{item.location}</span>
                        <button
                          onClick={() => handleToggleReturned(item)}
                          className="text-xs font-semibold text-primary-700 hover:text-primary-900"
                        >
                          Reopen Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-40" />
                  <p className="text-sm font-bold text-primary-900">
                    No returned items yet
                  </p>
                  <p className="text-xs text-muted">
                    When you return or recover items, they will be archived here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
          onItemUpdated={() => {
            fetchData();
          }}
        />
      )}

    </div>
  );
};
export default Dashboard;
