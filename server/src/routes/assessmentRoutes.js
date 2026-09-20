import express from "express";

import {
  getAssessmentQuestions,
  submitAssessment,
  getMyAssessments,
  getLatestAssessment
} from "../controllers/assessmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/questions/:roleSlug",
  protect,
  getAssessmentQuestions
);

router.post(
  "/submit",
  protect,
  submitAssessment
);

router.get(
  "/mine",
  protect,
  getMyAssessments
);

router.get(
  "/latest",
  protect,
  getLatestAssessment
);

const normalizeRoleText = (value = "") => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};


const customRoleMappings = [
  {
    keywords: [
      "frontend",
      "front end",
      "frontend developer",
      "web developer"
    ],
    skills: [
      "html",
      "css",
      "javascript",
      "react"
    ]
  },

  {
    keywords: [
      "backend",
      "back end",
      "backend developer",
      "server developer",
      "api developer"
    ],
    skills: [
      "javascript",
      "nodejs",
      "sql",
      "mongodb",
      "git"
    ]
  },

  {
    keywords: [
      "full stack",
      "fullstack",
      "full stack developer"
    ],
    skills: [
      "html",
      "css",
      "javascript",
      "react",
      "nodejs",
      "sql",
      "mongodb",
      "git"
    ]
  },

  {
    keywords: [
      "data analyst",
      "data analytics",
      "business analyst"
    ],
    skills: [
      "python",
      "sql"
    ]
  },

  {
    keywords: [
      "data scientist",
      "data science",
      "machine learning",
      "ml engineer",
      "ai engineer"
    ],
    skills: [
      "python",
      "sql",
      "data-structures",
      "algorithms"
    ]
  },

  {
    keywords: [
      "devops",
      "devops engineer",
      "cloud engineer",
      "site reliability",
      "sre"
    ],
    skills: [
      "programming",
      "git"
    ]
  },

  {
    keywords: [
      "ui ux",
      "ui/ux",
      "ux designer",
      "ui designer"
    ],
    skills: [
      "html",
      "css"
    ]
  },

  {
    keywords: [
      "cybersecurity",
      "cyber security",
      "security analyst",
      "cybersecurity analyst",
      "ethical hacker"
    ],
    skills: [
      "programming",
      "git"
    ]
  },

  {
    keywords: [
      "software engineer",
      "software developer",
      "software development"
    ],
    skills: [
      "programming",
      "data-structures",
      "algorithms",
      "oop",
      "git"
    ]
  }
];


export const getAssessmentSkillsForCustomRole = (roleName) => {
  const normalizedRole = normalizeRoleText(roleName);

  /*
   * Direct skill matching
   */

  const directSkillMap = {
    javascript: "javascript",
    js: "javascript",

    html: "html",

    css: "css",

    react: "react",
    reactjs: "react",

    node: "nodejs",
    nodejs: "nodejs",

    sql: "sql",
    mysql: "sql",

    mongodb: "mongodb",
    mongo: "mongodb",

    git: "git",
    github: "git",

    python: "python",

    programming: "programming",
    coding: "programming",

    dsa: "data-structures",
    "data structures": "data-structures",

    algorithms: "algorithms",

    oop: "oop",
    "object oriented": "oop"
  };

  if (directSkillMap[normalizedRole]) {
    return [directSkillMap[normalizedRole]];
  }

  /*
   * Career-role matching
   */

  for (const mapping of customRoleMappings) {
    const matched = mapping.keywords.some((keyword) =>
      normalizedRole.includes(keyword)
    );

    if (matched) {
      return mapping.skills;
    }
  }

  /*
   * Unknown custom career
   *
   * We still generate an assessment instead
   * of breaking the application.
   */

  return [
    "programming",
    "git"
  ];
};

export default router;