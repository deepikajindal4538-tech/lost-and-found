import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import Report from '../models/Report.js';

/**
 * @desc    Get comprehensive platform moderation statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalItems,
      lostItems,
      foundItems,
      returnedItems,
      activeItems,
      totalClaims,
      pendingClaims,
      acceptedClaims,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'returned' }),
      Item.countDocuments({ status: { $in: ['open', 'claimed'] } }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'pending' }),
      Claim.countDocuments({ status: 'accepted' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        lostItems,
        foundItems,
        returnedItems,
        activeItems,
        totalClaims,
        pendingClaims,
        acceptedClaims,
        totalReports,
        pendingReports,
        recoveryRate: totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all items for admin with search & filtering
 * @route   GET /api/admin/items
 * @access  Private/Admin
 */
export const getAdminItems = async (req, res, next) => {
  try {
    const { type, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { location: regex }, { category: regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('postedBy', 'name email rollNumber');

    res.status(200).json({
      success: true,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin delete item
 * @route   DELETE /api/admin/items/:id
 * @access  Private/Admin
 */
export const deleteAdminItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    await Promise.all([
      Claim.deleteMany({ itemId: item._id }),
      Report.deleteMany({ itemId: item._id }),
      Item.findByIdAndDelete(item._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Item listing and associated data removed by admin.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports with populated items and reporters
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
export const getAdminReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'itemId',
        select: 'title type category location imageUrl status postedBy',
        populate: { path: 'postedBy', select: 'name email rollNumber' },
      })
      .populate('reportedBy', 'name email rollNumber');

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status and admin notes
 * @route   PUT /api/admin/reports/:id
 * @access  Private/Admin
 */
export const updateAdminReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    res.status(200).json({
      success: true,
      report,
      message: `Report status updated to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users for administration
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role (promote/demote admin)
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'student' or 'admin'.",
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: `User role updated to ${role}.`,
    });
  } catch (error) {
    next(error);
  }
};
