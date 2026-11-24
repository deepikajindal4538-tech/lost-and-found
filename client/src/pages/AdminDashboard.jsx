import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Users,
  Trash2,
  Flag,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items', 'reports', 'users'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Items state
  const [items, setItems] = useState([]);
  const [itemsSearch, setItemsSearch] = useState('');

  // Reports state
  const [reports, setReports] = useState([]);

  // Users state
  const [users, setUsers] = useState([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, itemsRes, reportsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/items'),
        api.get('/admin/reports'),
        api.get('/admin/users'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (itemsRes.data.success) setItems(itemsRes.data.items || []);
      if (reportsRes.data.success) setReports(reportsRes.data.reports || []);
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to load admin console:', err);
      toast.error('Could not load administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!confirm('ADMIN ACTION: Permanently remove this listing and all associated reports/claims?'))
      return;
    try {
      const { data } = await api.delete(`/admin/items/${itemId}`);
      if (data.success) {
        toast.success('Listing permanently deleted by admin.');
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete item.');
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      const { data } = await api.put(`/admin/reports/${reportId}`, {
        status,
        adminNotes: `Resolved by admin on ${new Date().toLocaleDateString()}`,
      });
      if (data.success) {
        toast.success(`Report marked as ${status}.`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update report.');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      if (data.success) {
        toast.success(`User role changed to ${newRole}.`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update role.');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(itemsSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(itemsSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(itemsSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Console Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-soft">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary-900">
                IIITA Campus Moderation Console
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Admin
              </span>
            </div>
            <p className="text-xs text-muted">
              Oversee campus lost &amp; found listings, process student dispute reports, and manage verified users.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Admin Statistics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-xs text-muted font-medium">Total Listings</p>
            <p className="text-2xl font-extrabold text-primary-900 mt-1">
              {stats.totalItems}
            </p>
            <p className="text-[11px] text-muted mt-0.5">
              {stats.lostItems} Lost • {stats.foundItems} Found
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-xs text-muted font-medium">Items Returned</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {stats.returnedItems}
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              {stats.recoveryRate}% Campus Recovery
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-xs text-muted font-medium">Claim Requests</p>
            <p className="text-2xl font-extrabold text-primary-900 mt-1">
              {stats.totalClaims}
            </p>
            <p className="text-[11px] text-muted mt-0.5">
              {stats.pendingClaims} Pending • {stats.acceptedClaims} Verified
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-xs text-muted font-medium">Flagged Reports</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">
              {stats.totalReports}
            </p>
            <p className="text-[11px] text-rose-500 mt-0.5 font-medium">
              {stats.pendingReports} Unresolved
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft col-span-2 lg:col-span-1">
            <p className="text-xs text-muted font-medium">Verified Students</p>
            <p className="text-2xl font-extrabold text-primary-900 mt-1">
              {stats.totalUsers}
            </p>
            <p className="text-[11px] text-muted mt-0.5">@iiita.ac.in accounts</p>
          </div>
        </div>
      )}

      {/* Admin Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'items'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Listings ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Reported Listings ({reports.length})</span>
          {reports.filter((r) => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-primary-600 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students &amp; Users ({users.length})</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted">Loading administrative records...</p>
        </div>
      ) : (
        <div>
          {/* TAB: ALL ITEMS MODERATION */}
          {activeTab === 'items' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={itemsSearch}
                    onChange={(e) => setItemsSearch(e.target.value)}
                    placeholder="Search by title, location, category..."
                    className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <span className="text-xs text-muted">
                  Showing {filteredItems.length} listings
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-muted uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Item</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Posted By</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-primary-900 max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.type === 'found'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted">{item.category}</td>
                        <td className="py-3 px-3 text-slate-700">{item.location}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              item.status === 'returned'
                                ? 'bg-slate-800 text-white'
                                : item.status === 'claimed'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-primary-50 text-primary-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {item.postedBy?.name} ({item.postedBy?.rollNumber})
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <Link
                            to={`/items/${item._id}`}
                            className="inline-flex p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="inline-flex p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MODERATION REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-primary-900">
                Flagged Listing Reports
              </h3>

              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">
                            Report Reason: {report.reason}
                          </span>
                          <h4 className="text-sm font-bold text-primary-900">
                            Listing: {report.itemId?.title || 'Unknown / Deleted item'}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              report.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : report.status === 'dismissed'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <p className="text-muted">
                          Reported by:{' '}
                          <span className="font-semibold text-primary-900">
                            {report.reportedBy?.name} ({report.reportedBy?.rollNumber} - {report.reportedBy?.email})
                          </span>
                        </p>
                        {report.additionalInfo && (
                          <p className="italic text-slate-600">
                            Additional info: "{report.additionalInfo}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {report.itemId && (
                          <Link
                            to={`/items/${report.itemId._id}`}
                            className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Inspect Listing</span>
                          </Link>
                        )}

                        <div className="flex items-center gap-2">
                          {report.itemId && (
                            <button
                              onClick={() => handleDeleteItem(report.itemId._id)}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              Delete Listing
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateReport(report._id, 'dismissed')}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                          >
                            Dismiss Report
                          </button>
                          <button
                            onClick={() => handleUpdateReport(report._id, 'resolved')}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted text-xs">
                  No active reports from students. Everything looks good!
                </div>
              )}
            </div>
          )}

          {/* TAB: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-primary-900">
                Registered Students &amp; Admins
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-muted uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Roll Number</th>
                      <th className="py-3 px-3">College Email</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Registered On</th>
                      <th className="py-3 px-3 text-right">Role Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-primary-900">
                          {u.name}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-700">
                          {u.rollNumber}
                        </td>
                        <td className="py-3 px-3 text-muted">{u.email}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              u.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleToggleUserRole(u._id, u.role)}
                            className="text-[11px] font-semibold text-primary-700 hover:text-primary-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            Make {u.role === 'admin' ? 'Student' : 'Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;
