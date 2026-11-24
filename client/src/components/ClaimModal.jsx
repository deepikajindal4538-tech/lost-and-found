import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Send, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ClaimModal = ({ item, isOpen, onClose, onClaimSubmitted }) => {
  const [message, setMessage] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please describe identifying features or proof of ownership.');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/api/claims', {
        itemId: item._id,
        message,
        contactDetails,
      });

      if (data.success) {
        toast.success(data.message || 'Claim submitted successfully!');
        setMessage('');
        setContactDetails('');
        if (onClaimSubmitted) onClaimSubmitted(data.claim);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-900">Claim This Item</h3>
            <p className="text-xs text-muted truncate max-w-xs">{item.title}</p>
          </div>
        </div>

        <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-xs text-amber-800 mb-5 leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            To protect student belongings, the person who found this item will review your description before sharing handover location or contact information.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary-900 uppercase tracking-wider mb-1.5">
              Proof of Ownership / Identifying Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Describe markings, lock screen wallpaper, stickers, inside contents, serial number, or exact time you misplaced it..."
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-900 uppercase tracking-wider mb-1.5">
              Your Campus Contact / Room Info (Visible only upon acceptance)
            </label>
            <input
              type="text"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              placeholder="e.g. BH-2 Room 310, or Telegram @yourhandle / Phone number"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-soft transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Claim...' : 'Send Claim Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ClaimModal;
