import Role from "../models/Role.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import LearningResource from "../models/LearningResource.js";


// Get all roles
export const getRoles = async (req, res) => {
  const roles = await Role.find({
    isActive: true
  }).sort({
    name: 1
  });

  res.status(200).json({
    success: true,
    data: roles
  });
};


// Get role by slug
export const getRoleBySlug = async (req, res) => {
  const role = await Role.findOne({
    slug: req.params.slug,
    isActive: true
  });

  if (!role) {
    return res.status(404).json({
      success: false,
      message: "Role not found"
    });
  }

  res.status(200).json({
    success: true,
    data: role
  });
};


// Get all skills
export const getSkills = async (req, res) => {
  const skills = await Skill.find({
    isActive: true
  }).sort({
    category: 1,
    name: 1
  });

  res.status(200).json({
    success: true,
    data: skills
  });
};


// Get projects
export const getProjects = async (req, res) => {
  const projects = await Project.find({
    isActive: true
  }).sort({
    difficulty: 1,
    title: 1
  });

  res.status(200).json({
    success: true,
    data: projects
  });
};


// Get learning resources
export const getLearningResources = async (req, res) => {
  const resources = await LearningResource.find({
    isActive: true
  }).sort({
    title: 1
  });

  res.status(200).json({
    success: true,
    data: resources
  });
};


// Get careers
export const getCareers = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      limit = 50
    } = req.query;

    const query = {
      isActive: true
    };

    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    if (category.trim()) {
      query.category = category.trim();
    }

    const roles = await Role.find(query)
      .sort({
        name: 1
      })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });

  } catch (error) {
    console.error("Get careers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch careers"
    });
  }
};


// Get career by ID
export const getCareerById = async (req, res) => {
  try {
    const role = await Role.findById(
      req.params.id
    );

    if (!role || role.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Career role not found"
      });
    }

    let skills = [];

    if (role.skills?.length) {
      skills = await Skill.find({
        slug: {
          $in: role.skills
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        role,
        skills
      }
    });

  } catch (error) {
    console.error("Get career by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch career"
    });
  }
};


// Get career categories
export const getCareerCategories = async (req, res) => {
  try {
    const categories = await Role.distinct(
      "category",
      {
        isActive: true,
        category: {
          $exists: true,
          $ne: ""
        }
      }
    );

    res.status(200).json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    console.error(
      "Get career categories error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch career categories"
    });
  }
};