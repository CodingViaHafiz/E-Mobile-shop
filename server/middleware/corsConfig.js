import cors from "cors";

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5174",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
