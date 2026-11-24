import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  UploadCloud,
  X,
  PlusCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';

export const ReportItem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const [title, setTitle] = useState('');
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(ITEM_CATEGORIES[0]);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Image Upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('Please provide an item title and description.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('description', description.trim());
      formData.append('additionalDetails', additionalDetails.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const { data } = await api.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success(data.message || 'Item reported successfully!');
        navigate(`/items/${data.item._id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to submit report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900 tracking-tight">
          Report an Item
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
          Help return a lost belonging or alert the campus community to find your missing item.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Selector (Lost vs Found) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-900">
              What are you reporting? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all ${
                  type === 'lost'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-rose-500" />
                <span>I Lost Something</span>
              </button>

              <button
                type="button"
                onClick={() => setType('found')}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all ${
                  type === 'found'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>I Found Something</span>
              </button>
            </div>
          </div>

          {/* Title & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
                Item Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dell XPS Charger, Casio FX-991CW, Wildcraft Bag..."
                required
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {ITEM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
                Campus Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
                Date {type === 'found' ? 'Found' : 'Lost'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clear description of the item: color, brand, model, where exactly it was seen or lost, specific room or landmark..."
              required
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          {/* Additional Identifying Details */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900">
                Additional Identifying Details (Optional)
              </label>
              <span className="text-[11px] text-muted">
                Keeps ownership verification fair &amp; secure
              </span>
            </div>
            <textarea
              rows={2}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Scratches, keychains, stickers, partial roll number, lockscreen image, contents inside..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          {/* Drag & Drop Photo Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-900">
              Upload Item Photo
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 max-w-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-slate-300 hover:border-primary-400 bg-slate-50/50'
                }`}
                onClick={() => document.getElementById('photo-upload-input').click()}
              >
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 mx-auto shadow-xs mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-primary-900">
                  Click to upload or drag &amp; drop an image
                </p>
                <p className="text-xs text-muted mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted">
              By submitting, your listing will be immediately visible to verified IIITA students.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/"
                className="w-full sm:w-auto text-center px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing Report...' : 'Publish Listing'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
};
export default ReportItem;
