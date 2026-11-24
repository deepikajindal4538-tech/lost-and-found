import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'campuskhoj_jwt_dev_secret_key_2024';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, rollNumber, password, confirmPassword } = req.body;

    if (!name || !email || !rollNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required registration fields.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Email domain restriction check (configurable via ALLOWED_EMAIL_DOMAIN)
    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'iiita.ac.in';
    const enforceDomain = process.env.ENFORCE_EMAIL_DOMAIN !== 'false';
    const emailLower = email.toLowerCase().trim();

    if (enforceDomain && !emailLower.endsWith(`@${allowedDomain}`)) {
      return res.status(400).json({
        success: false,
        message: `Registration is restricted to IIIT Allahabad students. Please use your official @${allowedDomain} email.`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: emailLower }, { rollNumber: rollNumber.toUpperCase().trim() }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address or roll number already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: emailLower,
      rollNumber: rollNumber.toUpperCase().trim(),
      password,
      role: 'student',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      message: 'Account registered successfully! Welcome to CampusKhoj.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login student or admin
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password.',
      });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      message: 'Logged in successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        phone: user.phone,
      },
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
