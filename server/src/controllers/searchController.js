import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import LearningResource from "../models/LearningResource.js";

import asyncHandler from "../utils/asyncHandler.js";

export const globalSearch =
  asyncHandler(async (req, res) => {
    const {
      q = "",
      limit = 10
    } = req.query;

    const search = q.trim();

    if (!search) {
      return res.json({
        success: true,
        data: {
          roles: [],
          skills: [],
          projects: [],
          resources: []
        }
      });
    }

    const regex = {
      $regex: search,
      $options: "i"
    };

    const safeLimit = Math.min(
      Number(limit) || 10,
      20
    );

    const [
      roles,
      skills,
      projects,
      resources
    ] = await Promise.all([
      Role.find({
        isActive: true,
        $or: [
          { name: regex },
          { description: regex }
        ]
      })
        .select("name slug description category")
        .limit(safeLimit),

      Skill.find({
        isActive: true,
        $or: [
          { name: regex },
          { description: regex }
        ]
      })
        .select("name slug description category")
        .limit(safeLimit),

      Project.find({
        isActive: true,
        $or: [
          { title: regex },
          { description: regex }
        ]
      })
        .select(
          "title slug description difficulty"
        )
        .limit(safeLimit),

      LearningResource.find({
        isActive: true,
        $or: [
          { title: regex },
          { description: regex },
          { provider: regex }
        ]
      })
        .select(
          "title description url type provider skillSlug"
        )
        .limit(safeLimit)
    ]);

    res.json({
      success: true,
      data: {
        roles,
        skills,
        projects,
        resources
      }
    });
  });