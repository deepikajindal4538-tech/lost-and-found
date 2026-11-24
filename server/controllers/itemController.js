import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import Report from '../models/Report.js';
import { handleImageUpload } from '../middleware/upload.js';

/**
 * @desc    Get all items with filters, search, sorting and pagination
 * @route   GET /api/items
 * @access  Public
 */
export const getItems = async (req, res, next) => {
  try {
    const {
      type,
      category,
      location,
      search,
      dateRange,
      sort = 'newest',
      status,
      includeReturned = 'false',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type (lost / found)
    if (type && ['lost', 'found'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Filter by campus location
    if (location && location !== 'All' && location !== 'all') {
      query.location = location;
    }

    // Filter by status (default is active/open unless specified)
    if (status) {
      query.status = status;
    } else if (includeReturned !== 'true') {
      query.status = { $ne: 'returned' };
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      if (dateRange === 'today') {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        query.date = { $gte: startOfDay };
      } else if (dateRange === 'week') {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query.date = { $gte: oneWeekAgo };
      } else if (dateRange === 'month') {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        query.date = { $gte: oneMonthAgo };
      }
    }

    // Text search filter
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex },
        { additionalDetails: regex },
      ];
    }

    // Sorting
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('postedBy', 'name email rollNumber');

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get homepage summary (stats + recent lost + recent found)
 * @route   GET /api/items/summary
 * @access  Public
 */
export const getHomepageSummary = async (req, res, next) => {
  try {
    const [recentFound, recentLost, totalReported, returnedCount, activeListings] =
      await Promise.all([
        Item.find({ type: 'found', status: { $ne: 'returned' } })
          .sort({ createdAt: -1 })
          .limit(4)
          .populate('postedBy', 'name rollNumber'),
        Item.find({ type: 'lost', status: { $ne: 'returned' } })
          .sort({ createdAt: -1 })
          .limit(4)
          .populate('postedBy', 'name rollNumber'),
        Item.countDocuments(),
        Item.countDocuments({ status: 'returned' }),
        Item.countDocuments({ status: { $in: ['open', 'claimed'] } }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalReported,
        returnedCount,
        activeListings,
      },
      recentFound,
      recentLost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single item details
 * @route   GET /api/items/:id
 * @access  Public
 */
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'postedBy',
      'name email rollNumber phone'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Fetch 3 related items in the same category or location
    const relatedItems = await Item.find({
      _id: { $ne: item._id },
      type: item.type,
      status: { $ne: 'returned' },
      $or: [{ category: item.category }, { location: item.location }],
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('postedBy', 'name rollNumber');

    // Secure contact privacy: If the user is unauthenticated, mask contact phone/email
    const isOwner = req.user && req.user._id.toString() === item.postedBy._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    // Mask phone number for public users to avoid unsolicited calls; contact via in-app claim system
    const sanitizedItem = item.toObject();
    if (!isOwner && !isAdmin) {
      if (sanitizedItem.postedBy) {
        sanitizedItem.postedBy.phone = undefined;
      }
    }

    res.status(200).json({
      success: true,
      item: sanitizedItem,
      relatedItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lost or found item report
 * @route   POST /api/items
 * @access  Private
 */
export const createItem = async (req, res, next) => {
  try {
    const {
      title,
      type,
      category,
      description,
      location,
      date,
      additionalDetails,
      imageUrl: customImageUrl,
    } = req.body;

    if (!title || !type || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields (title, type, category, description, location).',
      });
    }

    let uploadedImageUrl = customImageUrl || '';

    // If an image was uploaded in the form
    if (req.file) {
      uploadedImageUrl = await handleImageUpload(req.file);
    }

    const item = await Item.create({
      title: title.trim(),
      type: type.toLowerCase(),
      category,
      description: description.trim(),
      location,
      date: date ? new Date(date) : new Date(),
      additionalDetails: additionalDetails ? additionalDetails.trim() : '',
      imageUrl: uploadedImageUrl,
      postedBy: req.user._id,
      status: 'open',
    });

    const populatedItem = await item.populate('postedBy', 'name email rollNumber');

    res.status(201).json({
      success: true,
      item: populatedItem,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update item (only owner or admin)
 * @route   PUT /api/items/:id
 * @access  Private
 */
export const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Check authorization: must be owner or admin
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing.',
      });
    }

    const {
      title,
      type,
      category,
      description,
      location,
      date,
      additionalDetails,
      status,
      imageUrl,
    } = req.body;

    if (title) item.title = title.trim();
    if (type) item.type = type.toLowerCase();
    if (category) item.category = category;
    if (description) item.description = description.trim();
    if (location) item.location = location;
    if (date) item.date = new Date(date);
    if (additionalDetails !== undefined) item.additionalDetails = additionalDetails.trim();
    if (status) item.status = status;

    // Handle new image upload
    if (req.file) {
      item.imageUrl = await handleImageUpload(req.file);
    } else if (imageUrl) {
      item.imageUrl = imageUrl;
    }

    await item.save();
    const updated = await item.populate('postedBy', 'name email rollNumber');

    res.status(200).json({
      success: true,
      item: updated,
      message: 'Item listing updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete item (only owner or admin)
 * @route   DELETE /api/items/:id
 * @access  Private
 */
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.',
      });
    }

    // Delete associated claims and reports
    await Promise.all([
      Claim.deleteMany({ itemId: item._id }),
      Report.deleteMany({ itemId: item._id }),
      Item.findByIdAndDelete(item._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Item and associated records removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's own reported items
 * @route   GET /api/items/user/me
 * @access  Private
 */
export const getMyItems = async (req, res, next) => {
  try {
    const [lostItems, foundItems, returnedItems] = await Promise.all([
      Item.find({ postedBy: req.user._id, type: 'lost', status: { $ne: 'returned' } }).sort({ createdAt: -1 }),
      Item.find({ postedBy: req.user._id, type: 'found', status: { $ne: 'returned' } }).sort({ createdAt: -1 }),
      Item.find({ postedBy: req.user._id, status: 'returned' }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      lostItems,
      foundItems,
      returnedItems,
    });
  } catch (error) {
    next(error);
  }
};
