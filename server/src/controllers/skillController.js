import UserSkill from "../models/UserSkill.js";

const normalizeSkill = (skill) => {
  return String(skill)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

export const getMySkills = async (req, res) => {
  try {
    const skills = await UserSkill.find({
      user: req.user._id
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error("Get my skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your skills"
    });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { name, proficiency = "beginner" } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required"
      });
    }

    const cleanName = String(name).trim();
    const normalizedName = normalizeSkill(cleanName);

    const existingSkill = await UserSkill.findOne({
      user: req.user._id,
      normalizedName
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "You already added this skill"
      });
    }

    const skill = await UserSkill.create({
      user: req.user._id,
      name: cleanName,
      normalizedName,
      proficiency
    });

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: skill
    });
  } catch (error) {
    console.error("Add skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add skill"
    });
  }
};

export const addMultipleSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array"
      });
    }

    const cleanedSkills = skills
      .map((skill) => {
        if (typeof skill === "string") {
          return {
            name: skill,
            proficiency: "beginner"
          };
        }

        return {
          name: skill.name,
          proficiency: skill.proficiency || "beginner"
        };
      })
      .filter((skill) => skill.name && String(skill.name).trim());

    const results = [];

    for (const skill of cleanedSkills) {
      const name = String(skill.name).trim();
      const normalizedName = normalizeSkill(name);

      const existing = await UserSkill.findOne({
        user: req.user._id,
        normalizedName
      });

      if (existing) {
        results.push(existing);
        continue;
      }

      const created = await UserSkill.create({
        user: req.user._id,
        name,
        normalizedName,
        proficiency: skill.proficiency
      });

      results.push(created);
    }

    return res.status(201).json({
      success: true,
      message: "Skills saved successfully",
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error("Add multiple skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save skills"
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await UserSkill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill removed successfully"
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove skill"
    });
  }
};