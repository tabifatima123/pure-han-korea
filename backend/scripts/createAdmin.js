import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@heraura.com";
    const password = "Admin@12345"; // set your desired password here

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.role = "admin";
      await user.save();
      console.log("✅ Admin password RESET");
      console.log("Email:", email);
      console.log("Password:", password);
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);

  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
};

run();
