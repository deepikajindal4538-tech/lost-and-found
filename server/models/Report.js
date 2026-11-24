import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please specify a reason for reporting'],
      enum: [
        'Inappropriate content',
        'Spam or fake listing',
        'Item already returned',
        'Offensive language',
        'Incorrect category/location',
        'Other',
      ],
    },
    additionalInfo: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Additional information cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ itemId: 1, status: 1 });
reportSchema.index({ reportedBy: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
