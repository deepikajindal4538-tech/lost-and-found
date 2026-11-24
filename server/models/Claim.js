import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide proof of ownership or identifying details'],
      trim: true,
      maxlength: [1000, 'Claim message cannot exceed 1000 characters'],
    },
    contactDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Contact details cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    responseNote: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

claimSchema.index({ itemId: 1, claimantId: 1 });
claimSchema.index({ ownerId: 1, status: 1 });
claimSchema.index({ claimantId: 1, status: 1 });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
