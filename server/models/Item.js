import mongoose from 'mongoose';

export const ITEM_CATEGORIES = [
  'Electronics',
  'Accessories',
  'Books & Stationery',
  'Clothing',
  'ID Cards & Documents',
  'Keys',
  'Bags',
  'Water Bottles',
  'Other',
];

export const CAMPUS_LOCATIONS = [
  'Academic Blocks',
  'Central Library',
  'CC3',
  'Auditorium',
  'Hostels',
  'Mess',
  'Sports Complex',
  'Labs',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify whether the item is Lost or Found'],
      enum: {
        values: ['lost', 'found'],
        message: '{VALUE} is not a valid item type',
      },
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ITEM_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location'],
      enum: {
        values: CAMPUS_LOCATIONS,
        message: '{VALUE} is not a valid campus location',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please provide the date lost or found'],
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    additionalDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Additional details cannot exceed 1000 characters'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'claimed', 'returned'],
      default: 'open',
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search & filtering
itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ category: 1, location: 1 });
itemSchema.index({ title: 'text', description: 'text', additionalDetails: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
