export const roles = [
  {
    name: "Frontend Developer",
    slug: "frontend-developer",
    description:
      "Build responsive and interactive user interfaces for web applications.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [
      { slug: "html", importance: "required", priority: 1 },
      { slug: "css", importance: "required", priority: 1 },
      { slug: "javascript", importance: "required", priority: 1 },
      { slug: "react", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "rest-api", importance: "important", priority: 2 },
      { slug: "responsive-design", importance: "required", priority: 1 },
      { slug: "typescript", importance: "important", priority: 3 }
    ]
  },

  {
    name: "Backend Developer",
    slug: "backend-developer",
    description:
      "Design and develop server-side applications, APIs, databases and backend systems.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [
      { slug: "javascript", importance: "required", priority: 1 },
      { slug: "nodejs", importance: "required", priority: 1 },
      { slug: "expressjs", importance: "required", priority: 1 },
      { slug: "mongodb", importance: "important", priority: 2 },
      { slug: "sql", importance: "required", priority: 1 },
      { slug: "rest-api", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "authentication", importance: "important", priority: 2 }
    ]
  },

  {
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    description:
      "Develop complete web applications across frontend, backend and database layers.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 8,
    skills: [
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
    ]
  },

  {
    name: "Data Analyst",
    slug: "data-analyst",
    description:
      "Analyze data and create insights that support business and technical decisions.",
    category: "Data",
    level: "Entry Level",
    averagePreparationMonths: 6,
    skills: [
      { slug: "sql", importance: "required", priority: 1 },
      { slug: "excel", importance: "required", priority: 1 },
      { slug: "python", importance: "important", priority: 1 },
      { slug: "statistics", importance: "required", priority: 1 },
      { slug: "data-visualization", importance: "required", priority: 2 },
      { slug: "power-bi", importance: "important", priority: 2 }
    ]
  },

    {
    name: "Data Scientist",
    slug: "data-scientist",
    description:
      "Use programming, statistics, data analysis and machine learning techniques to extract insights and build predictive solutions.",
    category: "Data",
    level: "Entry Level",
    averagePreparationMonths: 8,
    skills: [
      { slug: "python", importance: "required", priority: 1 },
      { slug: "sql", importance: "important", priority: 2 },
      { slug: "statistics", importance: "required", priority: 1 },
      { slug: "data-visualization", importance: "important", priority: 2 },
      { slug: "programming", importance: "required", priority: 1 },
      { slug: "data-structures", importance: "important", priority: 2 },
      { slug: "algorithms", importance: "important", priority: 2 }
    ]
  },

  {
    name: "DevOps Engineer",
    slug: "devops-engineer",
    description:
      "Build and maintain reliable development, deployment and infrastructure workflows using automation and modern DevOps practices.",
    category: "Cloud & DevOps",
    level: "Entry Level",
    averagePreparationMonths: 7,
    skills: [
      { slug: "linux", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 1 },
      { slug: "docker", importance: "required", priority: 1 },
      { slug: "kubernetes", importance: "required", priority: 2 },
      { slug: "aws", importance: "required", priority: 2 },
      { slug: "terraform", importance: "required", priority: 2 },
      { slug: "ci-cd", importance: "required", priority: 1 }
    ]
  },


   {
    name: "UI/UX Designer",
    slug: "ui-ux-designer",
    description:
      "Design intuitive, accessible and visually engaging digital experiences by combining user research, interaction design and visual design.",
    category: "Design",
    level: "Entry Level",
    averagePreparationMonths: 5,
    skills: [
      { slug: "ui-design", importance: "required", priority: 1 },
      { slug: "ux-design", importance: "required", priority: 1 },
      { slug: "figma", importance: "required", priority: 1 },
      { slug: "user-research", importance: "important", priority: 2 },
      { slug: "responsive-design", importance: "important", priority: 2 }
    ]
  },

  {
    name: "Software Engineer",
    slug: "software-engineer",
    description:
      "Design, develop, test and maintain software applications and systems.",
    category: "Software Development",
    level: "Entry Level",
    averagePreparationMonths: 8,
    skills: [
      { slug: "programming", importance: "required", priority: 1 },
      { slug: "data-structures", importance: "required", priority: 1 },
      { slug: "algorithms", importance: "required", priority: 1 },
      { slug: "oop", importance: "required", priority: 1 },
      { slug: "git", importance: "required", priority: 2 },
      { slug: "sql", importance: "important", priority: 2 },
      { slug: "rest-api", importance: "important", priority: 2 }
    ]
  }
];

export const skills = [
  {
    name: "HTML",
    slug: "html",
    category: "Frontend",
    description: "Structure web pages using semantic HTML.",
    difficulty: "Beginner"
  },

  {
    name: "CSS",
    slug: "css",
    category: "Frontend",
    description: "Style and layout responsive web applications.",
    difficulty: "Beginner"
  },

  {
    name: "JavaScript",
    slug: "javascript",
    category: "Programming",
    description: "Programming language used for modern web development.",
    difficulty: "Intermediate"
  },

  {
    name: "React",
    slug: "react",
    category: "Frontend",
    description: "JavaScript library for building component-based user interfaces.",
    difficulty: "Intermediate"
  },

  {
    name: "TypeScript",
    slug: "typescript",
    category: "Programming",
    description: "Typed superset of JavaScript.",
    difficulty: "Intermediate"
  },

  {
    name: "Node.js",
    slug: "nodejs",
    category: "Backend",
    description: "JavaScript runtime for server-side development.",
    difficulty: "Intermediate"
  },

  {
    name: "Express.js",
    slug: "expressjs",
    category: "Backend",
    description: "Node.js framework for building web servers and APIs.",
    difficulty: "Intermediate"
  },

  {
    name: "MongoDB",
    slug: "mongodb",
    category: "Database",
    description: "NoSQL document database.",
    difficulty: "Intermediate"
  },

  {
    name: "SQL",
    slug: "sql",
    category: "Database",
    description: "Language for querying and managing relational databases.",
    difficulty: "Beginner"
  },

  {
    name: "Git",
    slug: "git",
    category: "Tools",
    description: "Distributed version control system.",
    difficulty: "Beginner"
  },

  {
    name: "REST API",
    slug: "rest-api",
    category: "Backend",
    description: "Architecture and conventions for HTTP APIs.",
    difficulty: "Intermediate"
  },

  {
    name: "Authentication",
    slug: "authentication",
    category: "Backend",
    description: "User authentication, authorization and secure access control.",
    difficulty: "Intermediate"
  },

  {
    name: "Responsive Design",
    slug: "responsive-design",
    category: "Frontend",
    description: "Create interfaces that work across different screen sizes.",
    difficulty: "Beginner"
  },

  {
    name: "Python",
    slug: "python",
    category: "Programming",
    description: "General-purpose programming language widely used in data and software development.",
    difficulty: "Beginner"
  },

  {
    name: "Statistics",
    slug: "statistics",
    category: "Data",
    description: "Statistical concepts required for analyzing data.",
    difficulty: "Intermediate"
  },

  {
    name: "Excel",
    slug: "excel",
    category: "Data",
    description: "Spreadsheet tool used for analysis and reporting.",
    difficulty: "Beginner"
  },

  {
    name: "Power BI",
    slug: "power-bi",
    category: "Data",
    description: "Business intelligence and data visualization platform.",
    difficulty: "Intermediate"
  },

  {
    name: "Data Visualization",
    slug: "data-visualization",
    category: "Data",
    description: "Present data using meaningful visual representations.",
    difficulty: "Intermediate"
  },

  {
    name: "Programming",
    slug: "programming",
    category: "Programming",
    description: "Fundamental programming concepts and problem solving.",
    difficulty: "Beginner"
  },

  {
    name: "Data Structures",
    slug: "data-structures",
    category: "Computer Science",
    description: "Arrays, linked lists, stacks, queues, trees, graphs and other structures.",
    difficulty: "Intermediate"
  },

  {
    name: "Algorithms",
    slug: "algorithms",
    category: "Computer Science",
    description: "Algorithms and computational problem-solving techniques.",
    difficulty: "Intermediate"
  },

  {
  name: "Linux",
  slug: "linux",
  category: "DevOps",
  description: "Linux operating system and command-line fundamentals.",
  isActive: true
},
{
  name: "Docker",
  slug: "docker",
  category: "DevOps",
  description: "Containerization and Docker fundamentals.",
  isActive: true
},
{
  name: "CI/CD",
  slug: "ci-cd",
  category: "DevOps",
  description: "Continuous integration and continuous deployment practices.",
  isActive: true
},
{
  name: "Cloud",
  slug: "cloud",
  category: "DevOps",
  description: "Cloud computing and infrastructure fundamentals.",
  isActive: true
},
{
  name: "Kubernetes",
  slug: "kubernetes",
  category: "DevOps",
  description: "Container orchestration with Kubernetes.",
  isActive: true
},
{
  name: "AWS",
  slug: "aws",
  category: "DevOps",
  description: "Amazon Web Services cloud infrastructure and services.",
  isActive: true
},
{
  name: "Terraform",
  slug: "terraform",
  category: "DevOps",
  description: "Infrastructure as Code tool for automating cloud resources.",
  isActive: true
},
{
  name: "UI Design",
  slug: "ui-design",
  category: "Design",
  description: "Visual interface and user interface design principles.",
  isActive: true
},
{
  name: "UX Design",
  slug: "ux-design",
  category: "Design",
  description: "User experience and interaction design principles.",
  isActive: true
},
{
  name: "Figma",
  slug: "figma",
  category: "Design",
  description: "UI/UX design and prototyping using Figma.",
  isActive: true
},
{
  name: "User Research",
  slug: "user-research",
  category: "Design",
  description: "User research, interviews and usability analysis.",
  isActive: true
},

  {
    name: "OOP",
    slug: "oop",
    category: "Computer Science",
    description: "Object-oriented programming concepts.",
    difficulty: "Intermediate"
  }
];

export const projects = [
  {
    title: "Responsive Portfolio Website",
    slug: "responsive-portfolio",
    description:
      "Build a responsive personal portfolio with projects, skills and contact information.",
    difficulty: "Beginner",
    estimatedWeeks: 2,
    skills: ["html", "css", "javascript", "responsive-design", "git"]
  },

  {
    title: "React Task Manager",
    slug: "react-task-manager",
    description:
      "Build a task management application using React.",
    difficulty: "Intermediate",
    estimatedWeeks: 3,
    skills: ["javascript", "react", "html", "css", "git"]
  },

  {
    title: "REST API with Node.js",
    slug: "node-rest-api",
    description:
      "Create a production-style REST API with authentication and database integration.",
    difficulty: "Intermediate",
    estimatedWeeks: 4,
    skills: [
      "javascript",
      "nodejs",
      "expressjs",
      "mongodb",
      "rest-api",
      "authentication",
      "git"
    ]
  },

  {
    title: "Full Stack Job Tracker",
    slug: "full-stack-job-tracker",
    description:
      "Create a full-stack application for tracking job applications.",
    difficulty: "Intermediate",
    estimatedWeeks: 5,
    skills: [
      "react",
      "javascript",
      "nodejs",
      "expressjs",
      "mongodb",
      "rest-api",
      "authentication"
    ]
  },

  {
    title: "Sales Data Dashboard",
    slug: "sales-data-dashboard",
    description:
      "Analyze a sales dataset and create an interactive dashboard.",
    difficulty: "Intermediate",
    estimatedWeeks: 3,
    skills: [
      "excel",
      "sql",
      "statistics",
      "data-visualization",
      "power-bi"
    ]
  }
];

export const learningResources = [
  {
    title: "MDN Web Docs",
    slug: "mdn-web-docs",
    type: "Documentation",
    provider: "MDN",
    url: "https://developer.mozilla.org/",
    skills: ["html", "css", "javascript"]
  },

  {
    title: "React Documentation",
    slug: "react-documentation",
    type: "Documentation",
    provider: "React",
    url: "https://react.dev/",
    skills: ["react"]
  },

  {
    title: "Node.js Documentation",
    slug: "nodejs-documentation",
    type: "Documentation",
    provider: "Node.js",
    url: "https://nodejs.org/docs/latest/api/",
    skills: ["nodejs"]
  },

  {
    title: "Express.js Documentation",
    slug: "express-documentation",
    type: "Documentation",
    provider: "Express",
    url: "https://expressjs.com/",
    skills: ["expressjs"]
  },

  {
    title: "MongoDB Documentation",
    slug: "mongodb-documentation",
    type: "Documentation",
    provider: "MongoDB",
    url: "https://www.mongodb.com/docs/",
    skills: ["mongodb"]
  },

  {
    title: "SQL Tutorial",
    slug: "sql-tutorial",
    type: "Tutorial",
    provider: "W3Schools",
    url: "https://www.w3schools.com/sql/",
    skills: ["sql"]
  },

  {
    title: "Python Documentation",
    slug: "python-documentation",
    type: "Documentation",
    provider: "Python",
    url: "https://docs.python.org/3/",
    skills: ["python"]
  },

  {
    title: "Power BI Documentation",
    slug: "power-bi-documentation",
    type: "Documentation",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/power-bi/",
    skills: ["power-bi", "data-visualization"]
  }
];