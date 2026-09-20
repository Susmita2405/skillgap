import "dotenv/config";

import { connectDatabase } from "./config/db.js";

import Role from "./models/Role.js";
import Skill from "./models/Skill.js";
import Project from "./models/Project.js";
import LearningResource from "./models/LearningResource.js";

import {
  roles,
  skills,
  projects,
  learningResources
} from "./data/seedData.js";

const seedDatabase = async () => {
  try {
    await connectDatabase();

    console.log("Connected to MongoDB");

    await Role.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await LearningResource.deleteMany({});

    console.log("Old career data removed");

    await Skill.insertMany(skills);

    console.log(`${skills.length} skills inserted`);

    await Role.insertMany(roles);

    console.log(`${roles.length} roles inserted`);

    await Project.insertMany(projects);

    console.log(`${projects.length} projects inserted`);

    await LearningResource.insertMany(learningResources);

    console.log(
      `${learningResources.length} learning resources inserted`
    );

    console.log("Database seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed");
    console.error(error);

    process.exit(1);
  }
};

seedDatabase();