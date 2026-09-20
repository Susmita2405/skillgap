const assessmentQuestions = [

  // ====================================================
  // FULL STACK DEVELOPER
  // ====================================================

  {
    questionId: "fs-js-001",
    roleSlug: "full-stack-developer",
    skillSlug: "javascript",
    question:
      "Which keyword is used to declare a variable that cannot be reassigned?",
    options: [
      "var",
      "let",
      "const",
      "static"
    ],
    correctAnswer: "const",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fs-react-001",
    roleSlug: "full-stack-developer",
    skillSlug: "react",
    question:
      "Which React feature is commonly used to manage state inside a functional component?",
    options: [
      "useState",
      "useRoute",
      "useServer",
      "useDatabase"
    ],
    correctAnswer: "useState",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fs-node-001",
    roleSlug: "full-stack-developer",
    skillSlug: "nodejs",
    question:
      "What is Node.js primarily used for?",
    options: [
      "Running JavaScript outside the browser",
      "Designing images",
      "Writing SQL only",
      "Creating CSS animations"
    ],
    correctAnswer:
      "Running JavaScript outside the browser",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fs-express-001",
    roleSlug: "full-stack-developer",
    skillSlug: "express",
    question:
      "What is Express.js?",
    options: [
      "A Node.js web framework",
      "A database",
      "A CSS framework",
      "A programming language"
    ],
    correctAnswer:
      "A Node.js web framework",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fs-mongodb-001",
    roleSlug: "full-stack-developer",
    skillSlug: "mongodb",
    question:
      "MongoDB stores data primarily in which format?",
    options: [
      "JSON-like documents",
      "CSV files",
      "Plain text files",
      "HTML documents"
    ],
    correctAnswer:
      "JSON-like documents",
    points: 1,
    difficulty: "Beginner"
  },


  // ====================================================
  // BACKEND DEVELOPER
  // ====================================================

  {
    questionId: "be-node-001",
    roleSlug: "backend-developer",
    skillSlug: "nodejs",
    question:
      "Which environment allows JavaScript to run on the server?",
    options: [
      "Node.js",
      "Photoshop",
      "Figma",
      "MongoDB"
    ],
    correctAnswer: "Node.js",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "be-api-001",
    roleSlug: "backend-developer",
    skillSlug: "rest-api",
    question:
      "Which HTTP method is commonly used to retrieve data?",
    options: [
      "GET",
      "POST",
      "PUT",
      "PATCH"
    ],
    correctAnswer: "GET",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "be-express-001",
    roleSlug: "backend-developer",
    skillSlug: "express",
    question:
      "Which function is commonly used to define a GET route in Express?",
    options: [
      "app.get()",
      "app.fetch()",
      "server.read()",
      "route.load()"
    ],
    correctAnswer: "app.get()",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "be-mongodb-001",
    roleSlug: "backend-developer",
    skillSlug: "mongodb",
    question:
      "Which database type is MongoDB?",
    options: [
      "Document database",
      "Graph database",
      "Spreadsheet",
      "Operating system"
    ],
    correctAnswer:
      "Document database",
    points: 1,
    difficulty: "Beginner"
  },


  // ====================================================
  // FRONTEND DEVELOPER
  // ====================================================

  {
    questionId: "fe-html-001",
    roleSlug: "frontend-developer",
    skillSlug: "html",
    question:
      "What does HTML primarily define?",
    options: [
      "Webpage structure",
      "Database queries",
      "Server configuration",
      "Image editing"
    ],
    correctAnswer:
      "Webpage structure",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fe-css-001",
    roleSlug: "frontend-developer",
    skillSlug: "css",
    question:
      "What is CSS primarily used for?",
    options: [
      "Styling web pages",
      "Creating databases",
      "Running servers",
      "Writing API requests"
    ],
    correctAnswer:
      "Styling web pages",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fe-js-001",
    roleSlug: "frontend-developer",
    skillSlug: "javascript",
    question:
      "Which language is commonly used to add interactivity to web pages?",
    options: [
      "JavaScript",
      "SQL",
      "MongoDB",
      "XML"
    ],
    correctAnswer:
      "JavaScript",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "fe-react-001",
    roleSlug: "frontend-developer",
    skillSlug: "react",
    question:
      "React is primarily used to build what?",
    options: [
      "User interfaces",
      "Operating systems",
      "Databases",
      "Network routers"
    ],
    correctAnswer:
      "User interfaces",
    points: 1,
    difficulty: "Beginner"
  },


  // ====================================================
  // UI/UX DESIGNER
  // ====================================================

  {
    questionId: "ux-research-001",
    roleSlug: "ui-ux-designer",
    skillSlug: "ux-research",
    question:
      "What is the main purpose of UX research?",
    options: [
      "Understand users and their needs",
      "Write backend APIs",
      "Configure databases",
      "Deploy servers"
    ],
    correctAnswer:
      "Understand users and their needs",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "ux-wireframe-001",
    roleSlug: "ui-ux-designer",
    skillSlug: "wireframing",
    question:
      "What is a wireframe?",
    options: [
      "A basic representation of a screen layout",
      "A database schema",
      "A programming language",
      "A server configuration"
    ],
    correctAnswer:
      "A basic representation of a screen layout",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "ux-figma-001",
    roleSlug: "ui-ux-designer",
    skillSlug: "figma",
    question:
      "Figma is commonly used for what?",
    options: [
      "Interface design and prototyping",
      "Database administration",
      "Backend hosting",
      "Writing SQL queries"
    ],
    correctAnswer:
      "Interface design and prototyping",
    points: 1,
    difficulty: "Beginner"
  },

  {
    questionId: "ux-typography-001",
    roleSlug: "ui-ux-designer",
    skillSlug: "typography",
    question:
      "Typography primarily deals with what?",
    options: [
      "The arrangement and appearance of text",
      "Database indexing",
      "Server routing",
      "Network security"
    ],
    correctAnswer:
      "The arrangement and appearance of text",
    points: 1,
    difficulty: "Beginner"
  }

];

export default assessmentQuestions;