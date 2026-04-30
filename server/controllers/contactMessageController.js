import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const toTrimmedString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10));

  return { page, limit, skip: (page - 1) * limit };
};

const buildMessageFilter = (query = {}) => {
  const filter = {};

  if (query.status && query.status !== "all") {
    filter.status = query.status;
  }

  if (query.search) {
    const search = new RegExp(
      toTrimmedString(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$or = [
      { name: search },
      { email: search },
      { phone: search },
      { subject: search },
      { message: search },
    ];
  }

  return filter;
};

export const createContactMessage = asyncHandler(async (req, res) => {
  const payload = {
    name: toTrimmedString(req.body.name),
    email: toTrimmedString(req.body.email).toLowerCase(),
    phone: toTrimmedString(req.body.phone),
    subject: toTrimmedString(req.body.subject),
    message: toTrimmedString(req.body.message),
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.subject || !payload.message) {
    throw new ApiError(400, "Please complete all contact fields");
  }

  const contactMessage = await ContactMessage.create(payload);

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    contactMessage,
  });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildMessageFilter(req.query);

  const [messages, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("handledBy", "name email role"),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ status: "new" }),
  ]);

  res.status(200).json({
    success: true,
    messages,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + messages.length < total,
      hasPreviousPage: page > 1,
    },
  });
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findById(req.params.id);

  if (!contactMessage) {
    throw new ApiError(404, "Contact message not found");
  }

  const nextStatus = toTrimmedString(req.body.status).toLowerCase();

  if (nextStatus) {
    if (!["new", "read", "replied", "closed"].includes(nextStatus)) {
      throw new ApiError(400, "Invalid message status");
    }

    contactMessage.status = nextStatus;
    contactMessage.handledBy = req.user._id;
    contactMessage.handledAt = new Date();
  }

  if (req.body.adminNote !== undefined) {
    contactMessage.adminNote = toTrimmedString(req.body.adminNote);
    contactMessage.handledBy = req.user._id;
    contactMessage.handledAt = new Date();
  }

  await contactMessage.save();
  await contactMessage.populate("handledBy", "name email role");

  res.status(200).json({
    success: true,
    message: "Contact message updated successfully",
    contactMessage,
  });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findById(req.params.id);

  if (!contactMessage) {
    throw new ApiError(404, "Contact message not found");
  }

  await contactMessage.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
});
