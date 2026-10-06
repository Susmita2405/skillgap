const GITHUB_API = "https://api.github.com";

const getHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
    "User-Agent": "Student-Skill-Gap-Career-Planner"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

const githubRequest = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = new Error(
      `GitHub API request failed: ${response.status}`
    );

    error.status = response.status;

    try {
      error.details = await response.json();
    } catch {
      error.details = null;
    }

    throw error;
  }

  return response.json();
};

export const getGithubUser = async (username) => {
  return githubRequest(
    `${GITHUB_API}/users/${encodeURIComponent(username)}`
  );
};

export const getGithubRepositories = async (username) => {
  return githubRequest(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&direction=desc`
  );
};

export const getGithubEvents = async (username) => {
  return githubRequest(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/events/public?per_page=100`
  );
};

export const getRepositoryLanguages = async (owner, repo) => {
  return githubRequest(
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
  );
};

export const collectGithubData = async (username) => {
  const cleanUsername = username
    .trim()
    .replace(/^@/, "");

  if (!cleanUsername) {
    throw new Error("GitHub username is required.");
  }

  const [profile, repositories, events] =
    await Promise.all([
      getGithubUser(cleanUsername),
      getGithubRepositories(cleanUsername),
      getGithubEvents(cleanUsername)
    ]);

  const originalRepositories = repositories.filter(
    (repo) => !repo.fork
  );

  const repositoriesForLanguageAnalysis =
    originalRepositories.slice(0, 10);

  const languageResults = await Promise.all(
    repositoriesForLanguageAnalysis.map(async (repo) => {
      try {
        return await getRepositoryLanguages(
          cleanUsername,
          repo.name
        );
      } catch {
        return {};
      }
    })
  );

  const languageTotals = {};

  languageResults.forEach((languages) => {
    Object.entries(languages).forEach(
      ([language, bytes]) => {
        languageTotals[language] =
          (languageTotals[language] || 0) + bytes;
      }
    );
  });

  const languages = Object.entries(languageTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes]) => ({
      name,
      bytes
    }));

  const formattedRepositories =
    originalRepositories
      .slice(0, 30)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || "",
        topics: repo.topics || [],
        updatedAt: repo.updated_at || ""
      }));

  const recentActivity = events
    .slice(0, 30)
    .map((event) => {
      const repoName =
        event.repo?.name || "unknown repository";

      const date = event.created_at || "";

      return `${event.type} on ${repoName} at ${date}`;
    });

  return {
    username: cleanUsername,

    profile: {
      login: profile.login || cleanUsername,
      name: profile.name || "",
      bio: profile.bio || "",
      profileUrl: profile.html_url || "",
      avatarUrl: profile.avatar_url || "",
      publicRepositories:
        profile.public_repos || 0,
      followers: profile.followers || 0,
      following: profile.following || 0
    },

    repositories: formattedRepositories,

    languages,

    recentActivity
  };
};

export const analyzeGithubWithGemini = async ({ githubData, targetRole }) => {
  const languages = (githubData.languages || []).map((l) => l.name);
  const repoTech = [];

  (githubData.repositories || []).forEach((r) => {
    if (r.language) repoTech.push(r.language);
    if (Array.isArray(r.topics)) repoTech.push(...r.topics);
  });

  const allDetected = Array.from(new Set([...languages, ...repoTech]));

  return {
    githubScore: Math.min(95, Math.max(50, (allDetected.length || 1) * 12)),
    summary: `Analyzed public GitHub profile for @${githubData.username} with ${githubData.repositories?.length || 0} repositories and ${languages.length} identified languages.`,
    detectedSkills: allDetected,
    verifiedSkills: allDetected,
    githubStrengths: [
      `Active GitHub profile with ${githubData.repositories?.length || 0} repositories`,
      `Demonstrated technologies: ${languages.slice(0, 3).join(", ") || "Software development"}`
    ],
    githubWeaknesses: allDetected.length < 3 ? ["Could expand project repository portfolio"] : [],
    recommendations: [`Build hands-on projects directly aligned with ${targetRole || "your target role"}`]
  };
};