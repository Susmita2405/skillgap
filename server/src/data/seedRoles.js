import mongoose from "mongoose";
import "dotenv/config";
import Role from "../models/Role.js";

const roles = [
  {
    name: "Frontend Developer",
    slug: "frontend-developer",
    description: "Builds user interfaces and interactive web applications.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [],
    isActive: true
  },
  {
    name: "Backend Developer",
    slug: "backend-developer",
    description: "Builds server-side applications, APIs, databases, and backend systems.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [],
    isActive: true
  },
  {
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "Develops both frontend and backend parts of web applications.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 8,
    skills: [],
    isActive: true
  },
  {
    name: "Data Analyst",
    slug: "data-analyst",
    description: "Analyzes data to discover insights and support business decisions.",
    category: "Data",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [],
    isActive: true
  },
  {
    name: "Data Scientist",
    slug: "data-scientist",
    description: "Uses statistics, programming, and machine learning to analyze complex data.",
    category: "Data",
    level: "Entry Level",
    averagePreparationMonths: 9,
    skills: [],
    isActive: true
  },
  {
    name: "DevOps Engineer",
    slug: "devops-engineer",
    description: "Automates deployment, infrastructure, monitoring, and software delivery.",
    category: "Cloud & Infrastructure",
    level: "Entry Level",
    averagePreparationMonths: 8,
    skills: [],
    isActive: true
  },
  {
    name: "UI/UX Designer",
    slug: "ui-ux-designer",
    description: "Designs intuitive user interfaces and user experiences for digital products.",
    category: "Design",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [],
    isActive: true
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const role of roles) {
      await Role.findOneAndUpdate(
        { slug: role.slug },
        role,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
    }

    console.log("Roles seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Role seeding failed:", error);
    process.exit(1);
  }
};

seedRoles();