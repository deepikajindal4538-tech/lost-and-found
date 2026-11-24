import Report from '../models/Report.js';
import Item from '../models/Item.js';

/**
 * @desc    Submit a moderation report for a listing
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res, next) => {
  try {
    const { itemId, reason, additionalInfo } = req.body;

    if (!itemId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the item ID and reason for reporting.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'The reported item does not exist.',
      });
    }

    // Check if user already reported this item
    const existing = await Report.findOne({
      itemId,
      reportedBy: req.user._id,
      status: { $in: ['pending', 'reviewed'] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a moderation report for this listing.',
      });
    }

    const report = await Report.create({
      itemId,
      reportedBy: req.user._id,
      reason,
      additionalInfo: additionalInfo ? additionalInfo.trim() : '',
    });

    // Increment item report count
    await Item.findByIdAndUpdate(itemId, { $inc: { reportCount: 1 } });

    res.status(201).json({
      success: true,
      report,
      message: 'Listing reported to campus moderators for review. Thank you for keeping our community safe.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reports (Admin only)
 * @route   GET /api/reports
 * @access  Private/Admin
 */
export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate('itemId', 'title type category location imageUrl status postedBy')
      .populate('reportedBy', 'name email rollNumber');

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};
