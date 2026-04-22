import User from "../models/User.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const [users, totalUsers, totalAdmins, activeUsers, inactiveUsers] =
      await Promise.all([
        User.find({})
          .sort({ createdAt: -1 })
          .select("name email role isActive createdAt updatedAt"),
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
      ]);

    const recentUsers = users.slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        activeUsers,
        inactiveUsers,
      },
      recentUsers,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
