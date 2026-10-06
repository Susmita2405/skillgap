import "dotenv/config";
import mongoose from "mongoose";
import Role from "../models/Role.js";
import { roles } from "../data/seedData.js";

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const r of roles) {
      const res = await Role.findOneAndUpdate(
        { slug: r.slug },
        { 
          skills: r.skills, 
          description: r.description, 
          category: r.category,
          name: r.name,
          isActive: true
        },
        { upsert: true, new: true }
      );
      console.log(`Updated ${r.name}: ${res.skills.length} skills`);
    }

    console.log("All roles successfully updated!");
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
};

update();
