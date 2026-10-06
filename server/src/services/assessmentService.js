const assessmentQuestions = {
  javascript: [
    {
      id: "javascript-1",
      question: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "define", "variable"],
      answer: "let"
    },
    {
      id: "javascript-2",
      question: "Which method converts JSON text into a JavaScript object?",
      options: [
        "JSON.parse()",
        "JSON.convert()",
        "JSON.object()",
        "JSON.decodeObject()"
      ],
      answer: "JSON.parse()"
    },
    {
      id: "javascript-3",
      question: "Which array method creates a new array by transforming each element?",
      options: ["filter()", "map()", "push()", "find()"],
      answer: "map()"
    },
    {
      id: "javascript-4",
      question: "What does === compare?",
      options: [
        "Only value",
        "Only type",
        "Value and type",
        "Only object reference"
      ],
      answer: "Value and type"
    },
    {
      id: "javascript-5",
      question: "Which function is used to delay execution?",
      options: [
        "setTimeout()",
        "delay()",
        "wait()",
        "setDelay()"
      ],
      answer: "setTimeout()"
    }
  ],

  html: [
    {
      id: "html-1",
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyperlink Text Management Language",
        "Home Tool Markup Language"
      ],
      answer: "Hyper Text Markup Language"
    },
    {
      id: "html-2",
      question: "Which tag creates a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: "<a>"
    },
    {
      id: "html-3",
      question: "Which tag is used for the largest heading?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      answer: "<h1>"
    },
    {
      id: "html-4",
      question: "Which attribute provides alternative text for an image?",
      options: ["src", "alt", "title", "href"],
      answer: "alt"
    },
    {
      id: "html-5",
      question: "Which element represents navigation links?",
      options: ["<navigation>", "<nav>", "<links>", "<menu-links>"],
      answer: "<nav>"
    }
  ],

  css: [
    {
      id: "css-1",
      question: "Which property changes text color?",
      options: ["font-color", "text-color", "color", "foreground"],
      answer: "color"
    },
    {
      id: "css-2",
      question: "Which layout system is commonly used for one-dimensional layouts?",
      options: ["Float", "Flexbox", "Table", "Position"],
      answer: "Flexbox"
    },
    {
      id: "css-3",
      question: "Which property controls space inside an element?",
      options: ["margin", "padding", "spacing", "gap"],
      answer: "padding"
    },
    {
      id: "css-4",
      question: "Which property makes an element a flex container?",
      options: [
        "display: flex",
        "position: flex",
        "flex: display",
        "layout: flex"
      ],
      answer: "display: flex"
    },
    {
      id: "css-5",
      question: "Which unit is relative to the root font size?",
      options: ["px", "em", "rem", "%"],
      answer: "rem"
    }
  ],

  react: [
    {
      id: "react-1",
      question: "What is React primarily used for?",
      options: [
        "Building user interfaces",
        "Managing databases",
        "Operating systems",
        "Writing SQL queries"
      ],
      answer: "Building user interfaces"
    },
    {
      id: "react-2",
      question: "Which hook is commonly used for state?",
      options: ["useState", "useData", "useValue", "useStoreOnly"],
      answer: "useState"
    },
    {
      id: "react-3",
      question: "What syntax is commonly used to write HTML-like elements in React?",
      options: ["XML", "JSX", "HTMLX", "ReactML"],
      answer: "JSX"
    },
    {
      id: "react-4",
      question: "Which hook is used for side effects?",
      options: ["useEffect", "useSideEffect", "useAction", "useAsync"],
      answer: "useEffect"
    },
    {
      id: "react-5",
      question: "Props are primarily used to:",
      options: [
        "Pass data between components",
        "Create databases",
        "Style CSS",
        "Start the server"
      ],
      answer: "Pass data between components"
    }
  ],

  nodejs: [
    {
      id: "nodejs-1",
      question: "Node.js allows JavaScript to run primarily:",
      options: [
        "On the server",
        "Only inside CSS",
        "Only inside databases",
        "Inside HTML comments"
      ],
      answer: "On the server"
    },
    {
      id: "nodejs-2",
      question: "Which package manager is commonly used with Node.js?",
      options: ["npm", "pip", "composer", "gem"],
      answer: "npm"
    },
    {
      id: "nodejs-3",
      question: "Which module system is commonly used with modern Node.js ES modules?",
      options: [
        "import/export",
        "include/require-only",
        "using/namespace",
        "load/package"
      ],
      answer: "import/export"
    },
    {
      id: "nodejs-4",
      question: "Which object represents information about the current process?",
      options: ["process", "server", "runtime", "node"],
      answer: "process"
    },
    {
      id: "nodejs-5",
      question: "Node.js is built on which JavaScript engine?",
      options: ["V8", "SpiderMonkey", "Chakra", "WebKit"],
      answer: "V8"
    }
  ],

  sql: [
    {
      id: "sql-1",
      question: "Which statement retrieves data?",
      options: ["SELECT", "GET", "FETCH", "READ"],
      answer: "SELECT"
    },
    {
      id: "sql-2",
      question: "Which clause filters rows?",
      options: ["WHERE", "FILTER", "HAVING_ONLY", "MATCH"],
      answer: "WHERE"
    },
    {
      id: "sql-3",
      question: "Which keyword sorts query results?",
      options: ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE"],
      answer: "ORDER BY"
    },
    {
      id: "sql-4",
      question: "Which command adds a new row?",
      options: ["INSERT", "ADD", "CREATE ROW", "PUSH"],
      answer: "INSERT"
    },
    {
      id: "sql-5",
      question: "Which command modifies existing rows?",
      options: ["UPDATE", "CHANGE", "MODIFY ROW", "ALTER ROW"],
      answer: "UPDATE"
    }
  ],

  mongodb: [
    {
      id: "mongodb-1",
      question: "MongoDB is primarily a:",
      options: [
        "Document database",
        "Spreadsheet",
        "Programming language",
        "CSS framework"
      ],
      answer: "Document database"
    },
    {
      id: "mongodb-2",
      question: "MongoDB documents are stored in a format based on:",
      options: ["BSON", "CSV", "HTML", "XML only"],
      answer: "BSON"
    },
    {
      id: "mongodb-3",
      question: "A MongoDB collection is similar to a relational database:",
      options: ["Table", "Column", "Row", "Index"],
      answer: "Table"
    },
    {
      id: "mongodb-4",
      question: "Which method inserts one document?",
      options: [
        "insertOne()",
        "addOne()",
        "createRow()",
        "pushOne()"
      ],
      answer: "insertOne()"
    },
    {
      id: "mongodb-5",
      question: "Which field commonly identifies a MongoDB document?",
      options: ["_id", "id_only", "primary", "documentIdOnly"],
      answer: "_id"
    }
  ],

  git: [
    {
      id: "git-1",
      question: "Which command creates a Git repository?",
      options: [
        "git init",
        "git create",
        "git start",
        "git repository"
      ],
      answer: "git init"
    },
    {
      id: "git-2",
      question: "Which command stages files?",
      options: [
        "git add",
        "git stage-only",
        "git prepare",
        "git include"
      ],
      answer: "git add"
    },
    {
      id: "git-3",
      question: "Which command creates a commit?",
      options: [
        "git commit",
        "git save",
        "git snapshot",
        "git store"
      ],
      answer: "git commit"
    },
    {
      id: "git-4",
      question: "Which command sends local commits to a remote repository?",
      options: [
        "git push",
        "git send",
        "git upload",
        "git remote-send"
      ],
      answer: "git push"
    },
    {
      id: "git-5",
      question: "Which command downloads changes from a remote repository?",
      options: [
        "git pull",
        "git download",
        "git fetch-only-local",
        "git receive"
      ],
      answer: "git pull"
    }
  ],

  python: [
    {
      id: "python-1",
      question: "Which keyword defines a function in Python?",
      options: ["def", "function", "func", "define"],
      answer: "def"
    },
    {
      id: "python-2",
      question: "Which data type stores key-value pairs?",
      options: ["dict", "list", "tuple", "set"],
      answer: "dict"
    },
    {
      id: "python-3",
      question: "Which symbol starts a Python comment?",
      options: ["#", "//", "/*", "--"],
      answer: "#"
    },
    {
      id: "python-4",
      question: "Which function outputs text?",
      options: ["print()", "console()", "write()", "output()"],
      answer: "print()"
    },
    {
      id: "python-5",
      question: "Which collection is ordered and mutable?",
      options: ["list", "tuple", "set", "frozenset"],
      answer: "list"
    }
  ],

  programming: [
    {
      id: "programming-1",
      question: "What is a variable?",
      options: [
        "A named storage location",
        "A database",
        "A compiler",
        "A network protocol"
      ],
      answer: "A named storage location"
    },
    {
      id: "programming-2",
      question: "What does a loop do?",
      options: [
        "Repeats instructions",
        "Deletes a program",
        "Creates hardware",
        "Compiles CSS"
      ],
      answer: "Repeats instructions"
    },
    {
      id: "programming-3",
      question: "Which structure is commonly used for a condition?",
      options: ["if", "loop", "array", "class-only"],
      answer: "if"
    },
    {
      id: "programming-4",
      question: "What is a function?",
      options: [
        "Reusable block of code",
        "Database table",
        "Operating system",
        "HTML tag"
      ],
      answer: "Reusable block of code"
    },
    {
      id: "programming-5",
      question: "What is an algorithm?",
      options: [
        "Step-by-step procedure",
        "Programming language",
        "Database",
        "Text editor"
      ],
      answer: "Step-by-step procedure"
    }
  ],

  "data-structures": [
    {
      id: "data-structures-1",
      question: "Which data structure follows FIFO?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      answer: "Queue"
    },
    {
      id: "data-structures-2",
      question: "Which data structure follows LIFO?",
      options: ["Stack", "Queue", "Graph", "Heap only"],
      answer: "Stack"
    },
    {
      id: "data-structures-3",
      question: "Which structure stores elements in sequential positions?",
      options: ["Array", "Graph", "Tree", "Hash only"],
      answer: "Array"
    },
    {
      id: "data-structures-4",
      question: "A tree is generally a:",
      options: [
        "Hierarchical data structure",
        "Linear queue",
        "SQL command",
        "Network protocol"
      ],
      answer: "Hierarchical data structure"
    },
    {
      id: "data-structures-5",
      question: "A graph consists primarily of:",
      options: [
        "Vertices and edges",
        "Rows and columns",
        "Keys and passwords",
        "Classes and methods only"
      ],
      answer: "Vertices and edges"
    }
  ],

  algorithms: [
    {
      id: "algorithms-1",
      question: "Binary search requires the data to generally be:",
      options: ["Sorted", "Encrypted", "Random", "Duplicated"],
      answer: "Sorted"
    },
    {
      id: "algorithms-2",
      question: "What does algorithm complexity describe?",
      options: [
        "Resource usage as input grows",
        "Code color",
        "Variable names",
        "Database schema"
      ],
      answer: "Resource usage as input grows"
    },
    {
      id: "algorithms-3",
      question: "Which notation is commonly used for upper-bound complexity?",
      options: ["Big O", "Big X", "Big S", "Big R"],
      answer: "Big O"
    },
    {
      id: "algorithms-4",
      question: "Which algorithm repeatedly divides a sorted search space?",
      options: [
        "Binary Search",
        "Bubble Sort",
        "Linear Search",
        "DFS"
      ],
      answer: "Binary Search"
    },
    {
      id: "algorithms-5",
      question: "What is recursion?",
      options: [
        "A function calling itself",
        "A database query",
        "A CSS property",
        "A network request"
      ],
      answer: "A function calling itself"
    }
  ],

  oop: [
    {
      id: "oop-1",
      question: "What does OOP stand for?",
      options: [
        "Object-Oriented Programming",
        "Object Operating Process",
        "Ordered Object Programming",
        "Open Object Protocol"
      ],
      answer: "Object-Oriented Programming"
    },
    {
      id: "oop-2",
      question: "Which concept hides internal implementation details?",
      options: [
        "Encapsulation",
        "Inheritance",
        "Polymorphism",
        "Compilation"
      ],
      answer: "Encapsulation"
    },
    {
      id: "oop-3",
      question: "Which concept allows a class to derive from another class?",
      options: [
        "Inheritance",
        "Encapsulation",
        "Iteration",
        "Aggregation only"
      ],
      answer: "Inheritance"
    },
    {
      id: "oop-4",
      question: "Which concept allows the same interface to have different implementations?",
      options: [
        "Polymorphism",
        "Inheritance only",
        "Encapsulation",
        "Iteration"
      ],
      answer: "Polymorphism"
    },
    {
      id: "oop-5",
      question: "An object is generally an instance of a:",
      options: ["Class", "Database", "Function only", "Package"],
      answer: "Class"
    }
  ]
};

export const getQuestionsForSkills = (skillSlugs) => {
  const questions = [];

  for (const skillSlug of skillSlugs) {
    const skillQuestions = assessmentQuestions[skillSlug] || [];

    questions.push(
      ...skillQuestions.map((question) => {
        const qId = question.questionId || question.id;
        return {
          ...question,
          id: qId,
          questionId: qId,
          skillSlug
        };
      })
    );
  }

  return questions;
};

export const calculateSkillResult = (
  skillSlug,
  answers
) => {
  const questions = assessmentQuestions[skillSlug] || [];

  if (questions.length === 0) {
    return {
      skillSlug,
      score: 0,
      level: "Beginner",
      correctAnswers: 0,
      totalQuestions: 0
    };
  }

  let correctAnswers = 0;

  for (const question of questions) {
    const qId = question.questionId || question.id;
    const submittedAnswer = answers.find(
      (answer) => (answer.questionId || answer.id) === qId
    );

    if (
      submittedAnswer &&
      submittedAnswer.answer &&
      submittedAnswer.answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
    ) {
      correctAnswers++;
    }
  }

  const score = Math.round(
    (correctAnswers / questions.length) * 100
  );

  let level = "Beginner";

  if (score >= 80) {
    level = "Advanced";
  } else if (score >= 50) {
    level = "Intermediate";
  }

  return {
    skillSlug,
    score,
    level,
    correctAnswers,
    totalQuestions: questions.length
  };
};

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
   * Unknown custom career.
   *
   * We still provide a basic assessment
   * instead of crashing.
   */

  return [
    "programming",
    "git"
  ];
};