import Role from "../models/Role.js";
import User from "../models/User.js";
import UserSkill from "../models/UserSkill.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import GithubAnalysis from "../models/GithubAnalysis.js";
import CareerAnalysis from "../models/CareerAnalysis.js";
import SkillGapAnalysis from "../models/SkillGapAnalysis.js";
import Progress from "../models/Progress.js";

/*
|--------------------------------------------------------------------------
| NORMALIZE SKILL
|--------------------------------------------------------------------------
*/

export const normalizeSkill = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

/*
|--------------------------------------------------------------------------
| GET ANY SKILL NAME
|--------------------------------------------------------------------------
*/

export const getSkillName = (skill) => {
  if (typeof skill === "string") {
    return skill;
  }

  return (
    skill?.name ||
    skill?.skillName ||
    skill?.title ||
    skill?.slug ||
    skill?.normalizedName ||
    skill?.skill ||
    ""
  );
};

/*
|--------------------------------------------------------------------------
| GET MANUAL SKILL LEVEL
|--------------------------------------------------------------------------
*/

export const getSkillLevel = (skill) => {
  return (
    skill?.proficiency ||
    skill?.level ||
    skill?.proficiencyLevel ||
    skill?.skillLevel ||
    ""
  );
};

/*
|--------------------------------------------------------------------------
| FORMAT HUMAN-READABLE SKILL NAME
|--------------------------------------------------------------------------
*/

export const formatSkillTitle = (slugOrName) => {
  if (!slugOrName) return "";
  const map = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    reactjs: "React",
    nodejs: "Node.js",
    node: "Node.js",
    express: "Express.js",
    expressjs: "Express.js",
    mongodb: "MongoDB",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    nosql: "NoSQL",
    python: "Python",
    git: "Git",
    github: "GitHub",
    restapi: "REST API",
    "rest-api": "REST API",
    docker: "Docker",
    aws: "AWS",
    kubernetes: "Kubernetes",
    terraform: "Terraform",
    linux: "Linux",
    cicd: "CI/CD",
    "ci-cd": "CI/CD",
    cloud: "Cloud",
    figma: "Figma",
    oop: "OOP",
    powerbi: "Power BI",
    "power-bi": "Power BI",
    responsivedesign: "Responsive Design",
    "responsive-design": "Responsive Design",
    datastructures: "Data Structures",
    "data-structures": "Data Structures",
    algorithms: "Algorithms",
    statistics: "Statistics",
    excel: "Excel",
    datavisualization: "Data Visualization",
    "data-visualization": "Data Visualization",
    uidesign: "UI Design",
    "ui-design": "UI Design",
    uxdesign: "UX Design",
    "ux-design": "UX Design",
    userresearch: "User Research",
    "user-research": "User Research",
    programming: "Programming"
  };

  const norm = normalizeSkill(slugOrName);
  if (map[norm]) return map[norm];

  return String(slugOrName)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/*
|--------------------------------------------------------------------------
| IS SKILL MATCH
|--------------------------------------------------------------------------
*/

export const isSkillMatch = (skillA, skillB) => {
  const nameA = getSkillName(skillA);
  const nameB = getSkillName(skillB);
  if (!nameA || !nameB) return false;

  const normA = normalizeSkill(nameA);
  const normB = normalizeSkill(nameB);
  if (normA === normB) return true;

  const aliasMap = {
    react: ["reactjs", "react.js"],
    reactjs: ["react", "react.js"],
    node: ["nodejs", "node.js"],
    nodejs: ["node", "node.js"],
    express: ["expressjs", "express.js"],
    expressjs: ["express", "express.js"],
    mongo: ["mongodb"],
    mongodb: ["mongo"],
    sql: ["mysql", "postgresql", "postgres", "sqlite", "relationaldatabase"],
    postgres: ["postgresql", "sql"],
    postgresql: ["postgres", "sql"],
    rest: ["restapi", "restful", "restfulapi"],
    restapi: ["rest", "restful", "restfulapi"],
    cicd: ["ci/cd", "continuousintegration", "continuousdeployment", "ci-cd"],
    "ci-cd": ["cicd", "ci/cd", "continuousintegration"],
    cloud: ["aws", "azure", "gcp", "googlecloud", "cloudcomputing"],
    aws: ["cloud", "amazonwebservices"],
    golang: ["go"],
    go: ["golang"],
    javascript: ["js"],
    js: ["javascript"],
    typescript: ["ts"],
    ts: ["typescript"],
    tailwind: ["tailwindcss"],
    tailwindcss: ["tailwind"],
    k8s: ["kubernetes"],
    kubernetes: ["k8s"]
  };

  const aliasesA = aliasMap[normA] || [];
  if (aliasesA.includes(normB)) return true;

  const aliasesB = aliasMap[normB] || [];
  if (aliasesB.includes(normA)) return true;

  if (normA.length >= 4 && normB.length >= 4) {
    if (normA.includes(normB) || normB.includes(normA)) {
      return true;
    }
  }

  return false;
};

/*
|--------------------------------------------------------------------------
| FIND MANUAL SKILL
|--------------------------------------------------------------------------
*/

const findManualSkill = (skillName, userSkills) => {
  if (!Array.isArray(userSkills)) return null;
  return userSkills.find((skill) => isSkillMatch(skill, skillName)) || null;
};

/*
|--------------------------------------------------------------------------
| CHECK COLLECTION FOR SKILL
|--------------------------------------------------------------------------
*/

const containsSkill = (collection, skillName) => {
  if (!Array.isArray(collection)) return false;
  return collection.some((skill) => isSkillMatch(skill, skillName));
};

/*
|--------------------------------------------------------------------------
| GET RESUME SKILLS
|--------------------------------------------------------------------------
*/

const getResumeSkills = (resumeAnalysis, careerAnalysis) => {
  const skills = [];

  const extractFromObject = (obj) => {
    if (!obj) return;

    if (Array.isArray(obj.detectedSkills)) {
      skills.push(...obj.detectedSkills);
    }
    if (Array.isArray(obj.verifiedSkills)) {
      skills.push(...obj.verifiedSkills);
    }
    if (Array.isArray(obj.keywords)) {
      skills.push(...obj.keywords);
    }
    if (Array.isArray(obj.technologies)) {
      skills.push(...obj.technologies);
    }
    if (Array.isArray(obj.resumeStrengths)) {
      skills.push(...obj.resumeStrengths);
    }
    if (Array.isArray(obj.projects)) {
      obj.projects.forEach((proj) => {
        if (Array.isArray(proj?.technologies)) {
          skills.push(...proj.technologies);
        }
      });
    }
  };

  extractFromObject(resumeAnalysis);
  extractFromObject(careerAnalysis);

  return skills;
};

/*
|--------------------------------------------------------------------------
| GET GITHUB SKILLS
|--------------------------------------------------------------------------
*/

const getGithubSkills = (githubAnalysis, careerAnalysis) => {
  const skills = [];

  const extractFromObject = (obj) => {
    if (!obj) return;

    const possibleArrays = [
      obj.verifiedSkills,
      obj.detectedSkills,
      obj.skills,
      obj.technologies,
      obj.techStack,
      obj.languages
    ];

    possibleArrays.forEach((items) => {
      if (Array.isArray(items)) {
        skills.push(...items);
      }
    });

    if (Array.isArray(obj.repositories)) {
      obj.repositories.forEach((repo) => {
        if (Array.isArray(repo?.languages)) skills.push(...repo.languages);
        if (Array.isArray(repo?.technologies)) skills.push(...repo.technologies);
        if (Array.isArray(repo?.skills)) skills.push(...repo.skills);
        if (repo?.language) skills.push(repo.language);
      });
    }

    if (Array.isArray(obj.githubRepositories)) {
      obj.githubRepositories.forEach((repo) => {
        if (Array.isArray(repo?.languages)) skills.push(...repo.languages);
        if (Array.isArray(repo?.technologies)) skills.push(...repo.technologies);
        if (Array.isArray(repo?.skills)) skills.push(...repo.skills);
        if (repo?.language) skills.push(repo.language);
      });
    }

    if (
      obj.languages &&
      typeof obj.languages === "object" &&
      !Array.isArray(obj.languages)
    ) {
      skills.push(...Object.keys(obj.languages));
    }
  };

  extractFromObject(githubAnalysis);
  extractFromObject(careerAnalysis);

  return skills;
};

/*
|--------------------------------------------------------------------------
| DEFAULT ROLE SKILLS FALLBACK
|--------------------------------------------------------------------------
*/

const getDefaultRoleSkills = (slugOrName) => {
  const norm = normalizeSkill(slugOrName);

  if (norm.includes("devops")) {
    return [
      { slug: "linux", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 1 },
      { slug: "docker", importance: "required", priority: 1 },
      { slug: "kubernetes", importance: "required", priority: 2 },
      { slug: "aws", importance: "required", priority: 2 },
      { slug: "terraform", importance: "required", priority: 2 },
      { slug: "ci-cd", importance: "required", priority: 1 }
    ];
  }

  if (norm.includes("frontend")) {
    return [
      { slug: "html", importance: "required", priority: 1 },
      { slug: "css", importance: "required", priority: 1 },
      { slug: "javascript", importance: "required", priority: 1 },
      { slug: "react", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "rest-api", importance: "important", priority: 2 },
      { slug: "responsive-design", importance: "required", priority: 1 },
      { slug: "typescript", importance: "important", priority: 3 }
    ];
  }

  if (norm.includes("backend")) {
    return [
      { slug: "javascript", importance: "required", priority: 1 },
      { slug: "nodejs", importance: "required", priority: 1 },
      { slug: "expressjs", importance: "required", priority: 1 },
      { slug: "mongodb", importance: "important", priority: 2 },
      { slug: "sql", importance: "required", priority: 1 },
      { slug: "rest-api", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "authentication", importance: "important", priority: 2 }
    ];
  }

  if (norm.includes("fullstack") || norm.includes("full")) {
    return [
      { slug: "html", importance: "required", priority: 1 },
      { slug: "css", importance: "required", priority: 1 },
      { slug: "javascript", importance: "required", priority: 1 },
      { slug: "react", importance: "required", priority: 1 },
      { slug: "nodejs", importance: "required", priority: 1 },
      { slug: "expressjs", importance: "required", priority: 1 },
      { slug: "mongodb", importance: "important", priority: 2 },
      { slug: "sql", importance: "important", priority: 2 },
      { slug: "rest-api", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "authentication", importance: "important", priority: 2 }
    ];
  }

  if (norm.includes("dataanalyst")) {
    return [
      { slug: "sql", importance: "required", priority: 1 },
      { slug: "excel", importance: "required", priority: 1 },
      { slug: "python", importance: "important", priority: 1 },
      { slug: "statistics", importance: "required", priority: 1 },
      { slug: "data-visualization", importance: "required", priority: 2 },
      { slug: "power-bi", importance: "important", priority: 2 }
    ];
  }

  if (norm.includes("datascientist") || norm.includes("data")) {
    return [
      { slug: "python", importance: "required", priority: 1 },
      { slug: "sql", importance: "important", priority: 2 },
      { slug: "statistics", importance: "required", priority: 1 },
      { slug: "data-visualization", importance: "important", priority: 2 },
      { slug: "programming", importance: "required", priority: 1 },
      { slug: "data-structures", importance: "important", priority: 2 },
      { slug: "algorithms", importance: "important", priority: 2 }
    ];
  }

  if (norm.includes("ui") || norm.includes("ux") || norm.includes("design")) {
    return [
      { slug: "ui-design", importance: "required", priority: 1 },
      { slug: "ux-design", importance: "required", priority: 1 },
      { slug: "figma", importance: "required", priority: 1 },
      { slug: "user-research", importance: "important", priority: 2 },
      { slug: "responsive-design", importance: "important", priority: 2 }
    ];
  }

  return [
    { slug: "programming", importance: "required", priority: 1 },
    { slug: "git", importance: "required", priority: 1 },
    { slug: "data-structures", importance: "required", priority: 2 },
    { slug: "algorithms", importance: "important", priority: 2 },
    { slug: "sql", importance: "important", priority: 2 },
    { slug: "rest-api", importance: "important", priority: 2 }
  ];
};

/*
|--------------------------------------------------------------------------
| MAIN SKILL GAP ANALYSIS
|--------------------------------------------------------------------------
*/

export const analyzeSkillGap = async (userId, targetRole) => {
  const cleanRole = String(targetRole || "").trim();

  if (!cleanRole) {
    throw new Error("Target role is required");
  }

  const normalizedRole = cleanRole
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  /*
  | FIND ROLE OR FALLBACK
  */

  let role = await Role.findOne({
    $or: [
      { slug: normalizedRole },
      { name: cleanRole },
      { name: new RegExp(`^${cleanRole}$`, "i") }
    ],
    isActive: true
  }).lean();

  let roleSkills = role?.skills || [];

  if (!role || !roleSkills.length) {
    const fallbackSkills = getDefaultRoleSkills(cleanRole);

    if (role && !roleSkills.length) {
      await Role.findByIdAndUpdate(role._id, { skills: fallbackSkills });
      role.skills = fallbackSkills;
      roleSkills = fallbackSkills;
    } else if (!role) {
      role = {
        name: formatSkillTitle(cleanRole),
        slug: normalizedRole,
        description: `Target career path for ${cleanRole}`,
        skills: fallbackSkills
      };
      roleSkills = fallbackSkills;
    }
  }

  /*
  | 2. USER MANUAL SKILLS
  */

  const userDoc = await User.findById(userId).lean();
  const dbUserSkills = await UserSkill.find({ user: userId }).lean();

  const userSkills = [...dbUserSkills];
  if (Array.isArray(userDoc?.currentSkills)) {
    userDoc.currentSkills.forEach((s) => {
      if (s && !userSkills.some((item) => isSkillMatch(item, s))) {
        userSkills.push({ name: s, proficiency: "beginner" });
      }
    });
  }

  /*
  | 3. RESUME ANALYSIS
  */

  const resumeAnalysis = await ResumeAnalysis.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  /*
  | 4. GITHUB ANALYSIS
  */

  const githubAnalysis = await GithubAnalysis.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  /*
  | 5. CAREER PROFILE ANALYSIS (Combined)
  */

  const careerAnalysis = await CareerAnalysis.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  /*
  | 6. EXTRACT EVIDENCE SKILLS
  */

  const resumeSkills = getResumeSkills(resumeAnalysis, careerAnalysis);
  const githubSkills = getGithubSkills(githubAnalysis, careerAnalysis);

  /*
  | 7. CALCULATE ROLE SKILLS
  */

  const skillResults = roleSkills.map((roleSkill) => {
    const skillSlug = roleSkill.slug;
    const skillDisplayName = formatSkillTitle(skillSlug);

    const manualSkill = findManualSkill(skillSlug, userSkills);
    const resumeEvidence = containsSkill(resumeSkills, skillSlug);
    const githubEvidence = containsSkill(githubSkills, skillSlug);

    let studentScore = 0;

    if (manualSkill) {
      const level = getSkillLevel(manualSkill).toLowerCase();
      let base = 85;
      if (level === "advanced" || level === "expert") base = 95;
      else if (level === "intermediate" || level === "medium") base = 85;
      else base = 85; // Beginner still demonstrates explicit knowledge

      if (resumeEvidence) base = Math.min(100, base + 5);
      if (githubEvidence) base = Math.min(100, base + 5);

      studentScore = base;
    } else {
      if (resumeEvidence && githubEvidence) {
        studentScore = 80;
      } else if (resumeEvidence) {
        studentScore = 65;
      } else if (githubEvidence) {
        studentScore = 50;
      } else {
        studentScore = 0;
      }
    }

    let status = "Missing";
    if (studentScore >= 75) {
      status = "Strong";
    } else if (studentScore >= 40) {
      status = "Moderate";
    }

    const gap = Math.max(0, 100 - studentScore);

    return {
      skillSlug: roleSkill.slug,
      skillName: skillDisplayName,
      required: roleSkill.importance === "required",
      priority: roleSkill.priority || 2,
      studentScore,
      status,
      gap,
      evidence: {
        mySkills: Boolean(manualSkill),
        resume: Boolean(resumeEvidence),
        github: Boolean(githubEvidence)
      }
    };
  });

  /*
  | 8. READINESS SCORE
  | Exact formula: Strong counts for 100%, Moderate for 50%, Missing for 0%
  */

  const totalSkills = skillResults.length;

  const readinessScore =
    totalSkills === 0
      ? 0
      : Math.round(
          skillResults.reduce((acc, s) => {
            if (s.status === "Strong") return acc + 100;
            if (s.status === "Moderate") return acc + 50;
            return acc;
          }, 0) / totalSkills
        );

  const overallProgress = readinessScore;

  const strongSkills = skillResults
    .filter((s) => s.status === "Strong")
    .map((s) => s.skillName);

  const moderateSkills = skillResults
    .filter((s) => s.status === "Moderate")
    .map((s) => s.skillName);

  const missingSkills = skillResults
    .filter((s) => s.status === "Missing")
    .map((s) => s.skillName);

  return {
    targetRole: role.slug,
    targetRoleName: role.name,
    readinessScore,
    overallProgress,
    strongSkills,
    moderateSkills,
    missingSkills,
    skillCounts: {
      strong: strongSkills.length,
      moderate: moderateSkills.length,
      missing: missingSkills.length
    },
    skills: skillResults
  };
};

/*
|--------------------------------------------------------------------------
| RECALCULATE AND SAVE SKILL GAP TO MONGODB
|--------------------------------------------------------------------------
*/

export const recalculateAndSaveSkillGap = async (
  userId,
  optionalTargetRole
) => {
  try {
    let roleToUse = optionalTargetRole ? String(optionalTargetRole).trim() : "";

    if (!roleToUse) {
      const user = await User.findById(userId).populate("targetRole").lean();
      roleToUse =
        user?.targetRole?.slug ||
        user?.targetRole?.name ||
        user?.customTargetRole ||
        "";
    }

    if (!roleToUse) {
      const existing = await SkillGapAnalysis.findOne({ user: userId })
        .sort({ updatedAt: -1 })
        .lean();
      roleToUse = existing?.targetRole || "";
    }

    if (!roleToUse) {
      console.log(`No target role found for user ${userId}, skipping skill-gap calculation`);
      return null;
    }

    console.log(`Recalculating skill-gap for user ${userId} with target role: ${roleToUse}`);

    const analysis = await analyzeSkillGap(userId, roleToUse);

    const overallProgress = Math.max(
      analysis.overallProgress || 0,
      analysis.readinessScore || 0
    );

    const savedAnalysis = await SkillGapAnalysis.findOneAndUpdate(
      {
        user: userId,
        targetRole: analysis.targetRole
      },
      {
        user: userId,
        targetRole: analysis.targetRole,
        targetRoleName: analysis.targetRoleName,
        readinessScore: analysis.readinessScore,
        overallProgress,
        strongSkills: analysis.strongSkills,
        moderateSkills: analysis.moderateSkills,
        missingSkills: analysis.missingSkills,
        skillCounts: analysis.skillCounts,
        skills: analysis.skills
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    await Progress.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          overallProgress
        }
      },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(userId, {
      readinessScoreScore: analysis.readinessScore,
      readinessScore: analysis.readinessScore
    });

    console.log(
      `Skill gap updated successfully for user ${userId}: Readiness=${analysis.readinessScore}%, OverallProgress=${overallProgress}%, Strong=${analysis.strongSkills.length}, Moderate=${analysis.moderateSkills.length}, Missing=${analysis.missingSkills.length}`
    );

    return savedAnalysis;
  } catch (error) {
    console.error("Failed to recalculate and save skill gap:", error);
    return null;
  }
};