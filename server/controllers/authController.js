import User from "../models/User.js";
import PasswordResetRequest from "../models/PasswordResetRequest.js";
import generateToken from "../utils/generateToken.js";

const toTrimmedString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

// Register user
export const register = async (req, res, next) => {
  try {
    const {
      name: rawName = "",
      email: rawEmail = "",
      password,
      confirmPassword,
    } = req.body;
    const name = rawName.trim();
    const email = rawEmail.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email: rawEmail = "", password } = req.body;
    const email = rawEmail.trim().toLowerCase();

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Your account has been deactivated" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const createPasswordResetRequest = async (req, res, next) => {
  try {
    const name = toTrimmedString(req.body.name);
    const email = toTrimmedString(req.body.email).toLowerCase();
    const phone = toTrimmedString(req.body.phone);
    const note = toTrimmedString(req.body.note);

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email, and phone are required",
      });
    }

    const user = await User.findOne({ email });
    const existingPendingRequest = await PasswordResetRequest.findOne({
      email,
      status: "pending",
    });

    if (existingPendingRequest) {
      return res.status(400).json({
        message: "A pending reset request already exists for this email",
      });
    }

    await PasswordResetRequest.create({
      user: user?._id ?? null,
      name,
      email,
      phone,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Password reset request sent to admin",
    });
  } catch (error) {
    next(error);
  }
};

export const getPasswordResetRequests = async (req, res, next) => {
  try {
    const status = toTrimmedString(req.query.status, "all");
    const filter = status && status !== "all" ? { status } : {};

    const requests = await PasswordResetRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name email role isActive")
      .populate("handledBy", "name email role");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePasswordResetRequest = async (req, res, next) => {
  try {
    const resetRequest = await PasswordResetRequest.findById(req.params.id).populate(
      "user",
      "name email role isActive password",
    );

    if (!resetRequest) {
      return res.status(404).json({ message: "Password reset request not found" });
    }

    const status = toTrimmedString(req.body.status).toLowerCase();
    const adminNote = toTrimmedString(req.body.adminNote);
    const temporaryPassword = toTrimmedString(req.body.temporaryPassword);

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid reset request status" });
    }

    if (status === "approved") {
      if (!resetRequest.user) {
        return res.status(404).json({
          message: "No user account exists for this reset request email",
        });
      }

      if (temporaryPassword.length < 6) {
        return res.status(400).json({
          message: "Temporary password must be at least 6 characters",
        });
      }

      resetRequest.user.password = temporaryPassword;
      await resetRequest.user.save();
    }

    resetRequest.status = status;
    resetRequest.adminNote = adminNote;
    resetRequest.handledBy = req.user._id;
    resetRequest.handledAt = new Date();
    await resetRequest.save();
    await resetRequest.populate("handledBy", "name email role");

    res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Temporary password set successfully"
          : "Password reset request rejected",
      request: resetRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
