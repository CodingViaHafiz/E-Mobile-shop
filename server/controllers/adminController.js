import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const lowStockExpr = {
    $expr: {
      $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }],
    },
  };
  const [
    users,
    totalUsers,
    totalAdmins,
    activeUsers,
    inactiveUsers,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalOrders,
    totalMessages,
    newMessages,
    recentMessages,
  ] = await Promise.all([
    User.find({})
      .sort({ createdAt: -1 })
      .select("name email role isActive createdAt updatedAt"),
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    Product.countDocuments(),
    Product.countDocuments(lowStockExpr),
    Product.countDocuments({ stock: 0 }),
    Order.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt"),
  ]);

  const recentUsers = users.slice(0, 5);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalOrders,
      totalMessages,
      newMessages,
    },
    recentUsers,
    recentMessages,
    users,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isSelf = req.user._id.toString() === user._id.toString();

  if (isSelf && role && role !== "admin") {
    return res
      .status(400)
      .json({ message: "You cannot remove your own admin access" });
  }

  if (isSelf && isActive === false) {
    return res
      .status(400)
      .json({ message: "You cannot deactivate your own account" });
  }

  if (role !== undefined) {
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }
    user.role = role;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid active status" });
    }
    user.isActive = isActive;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: user.toJSON(),
  });
});
