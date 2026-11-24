import Claim from '../models/Claim.js';
import Item from '../models/Item.js';

/**
 * @desc    Submit a claim for a found item
 * @route   POST /api/claims
 * @access  Private
 */
export const createClaim = async (req, res, next) => {
  try {
    const { itemId, message, contactDetails } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the item ID and your proof of ownership or identifying details.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'The item you are claiming does not exist.',
      });
    }

    // Cannot claim own post
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot file a claim on an item that you posted.',
      });
    }

    // Check if item is already returned
    if (item.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been marked as returned to its owner.',
      });
    }

    // Check if user already has an active pending claim for this item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user._id,
      status: 'pending',
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending claim for this item. Please wait for the finder to respond.',
      });
    }

    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      ownerId: item.postedBy,
      message: message.trim(),
      contactDetails: contactDetails ? contactDetails.trim() : '',
      status: 'pending',
    });

    const populatedClaim = await claim.populate([
      { path: 'itemId', select: 'title type category location imageUrl status' },
      { path: 'ownerId', select: 'name email rollNumber' },
    ]);

    res.status(201).json({
      success: true,
      claim: populatedClaim,
      message: 'Claim request submitted successfully! The finder has been notified.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all claims submitted by the current user
 * @route   GET /api/claims/my
 * @access  Private
 */
export const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimantId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('itemId', 'title type category location imageUrl status date')
      .populate('ownerId', 'name email rollNumber phone');

    res.status(200).json({
      success: true,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all claims received for items posted by the current user
 * @route   GET /api/claims/received
 * @access  Private
 */
export const getReceivedClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('itemId', 'title type category location imageUrl status date')
      .populate('claimantId', 'name email rollNumber phone');

    res.status(200).json({
      success: true,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update claim status (Accept or Reject)
 * @route   PUT /api/claims/:id
 * @access  Private
 */
export const updateClaimStatus = async (req, res, next) => {
  try {
    const { status, responseNote, markItemReturned } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'accepted' or 'rejected'.",
      });
    }

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim request not found.',
      });
    }

    // Only the person who posted the item (ownerId) or admin can respond
    const isOwner = claim.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to respond to this claim request.',
      });
    }

    claim.status = status;
    if (responseNote !== undefined) {
      claim.responseNote = responseNote.trim();
    }

    await claim.save();

    // If claim was accepted and user chose to mark item as claimed/returned
    if (status === 'accepted') {
      const item = await Item.findById(claim.itemId);
      if (item) {
        if (markItemReturned) {
          item.status = 'returned';
        } else {
          item.status = 'claimed';
        }
        await item.save();
      }
    }

    const updatedClaim = await claim.populate([
      { path: 'itemId', select: 'title type category location status' },
      { path: 'claimantId', select: 'name email rollNumber phone' },
    ]);

    res.status(200).json({
      success: true,
      claim: updatedClaim,
      message: `Claim request has been ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};
