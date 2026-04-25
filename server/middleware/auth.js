import jwt from "jsonwebtoken";
import User from "../models/User.js";

const attachUserFromToken = async (token) => {
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    return null;
  }

  return user;
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }

    const user = await attachUserFromToken(token);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const user = await attachUserFromToken(token);

    if (user) {
      req.user = user;
      req.userId = user._id;
    }

    next();
  } catch {
    next();
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res
        .status(403)
        .json({ message: "User role not authorized to access this route" });
    }
    next();
  };
