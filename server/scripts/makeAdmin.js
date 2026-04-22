import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const [, , emailArg, passwordArg, nameArg] = process.argv;

if (!emailArg) {
  console.error("Usage: npm run make-admin -- <email> <password> [name]");
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const password = passwordArg?.trim();
const name = nameArg?.trim() || "Admin User";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      user.role = "admin";
      user.isActive = true;

      if (password) {
        user.password = password;
      }

      await user.save();
      console.log(`Updated ${email} to admin successfully.`);
    } else {
      if (!password) {
        throw new Error("Password is required when creating a new admin account.");
      }

      user = await User.create({
        name,
        email,
        password,
        role: "admin",
        isActive: true,
      });

      console.log(`Created admin account for ${user.email}.`);
    }
  } catch (error) {
    console.error(`Failed to create admin: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
