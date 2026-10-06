import React, {
  useEffect,
  useState
} from "react";

import {
  Upload,
  Github,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Code2,
  Target,
  FolderGit2,
  ArrowRight,
  Loader2,
  ExternalLink
} from "lucide-react";

import {
  analyzeCareerProfile,
  getLatestCareerAnalysis
} from "../services/careerAnalysisService";

import "./ResumeAnalysis.css";

const ListSection = ({
  title,
  items,
  icon
}) => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="analysis-section">
      <div className="section-heading">
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="analysis-list">
        {items.map(
          (item, index) => (
            <div
              className="analysis-list-item"
              key={`${title}-${index}`}
            >
              <CheckCircle2
                size={17}
              />

              <span>{item}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const ScoreCard = ({
  title,
  score
}) => {
  return (
    <div className="score-card">
      <div className="score-card-top">
        <span>{title}</span>

        <strong>
          {score ?? 0}
        </strong>
      </div>

      <div className="score-track">
        <div
          className="score-fill"
          style={{
            width: `${score ?? 0}%`
          }}
        />
      </div>
    </div>
  );
};

const ScoreCircle = ({
  score
}) => {
  return (
    <div className="score-circle">
      <div className="score-circle-inner">
        <strong>
          {score ?? 0}
        </strong>

        <span>/ 100</span>
      </div>
    </div>
  );
};

const ResumeAnalysis = () => {
  const [file, setFile] =
    useState(null);

  const [
    githubUsername,
    setGithubUsername
  ] = useState("");

  const [
    targetRole,
    setTargetRole
  ] = useState(localStorage.getItem("targetRole") || "");

  const [
    analysis,
    setAnalysis
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    loadingPrevious,
    setLoadingPrevious
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {
    const loadPreviousAnalysis =
      async () => {
        try {
          const response =
            await getLatestCareerAnalysis();

          if (response?.data) {
            setAnalysis(
              response.data
            );

            setGithubUsername(
              response.data.githubUsername ||
                ""
            );

            setTargetRole(
              response.data.targetRole ||
                ""
            );
          }
        } catch (error) {
          console.error(
            "Failed to load previous analysis:",
            error
          );
        } finally {
          setLoadingPrevious(
            false
          );
        }
      };

    loadPreviousAnalysis();
  }, []);

  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      setError(
        "Please select a PDF resume."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Resume must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    setError("");

    if (!file) {
      setError(
        "Please upload your resume PDF."
      );
      return;
    }

    if (
      !githubUsername.trim()
    ) {
      setError(
        "Please enter your GitHub username."
      );
      return;
    }

    

    try {
      setLoading(true);

      const response =
        await analyzeCareerProfile({
          file,
          githubUsername:
            githubUsername.trim(),
          targetRole: targetRole || localStorage.getItem("targetRole") || ""
        });

      setAnalysis(
        response.data
      );
    } catch (error) {
      console.error(
        "Combined analysis failed:",
        error
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.message ||
        "Unable to analyze your profile.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPrevious) {
    return (
      <div className="resume-analysis-page">
        <div className="analysis-loading-page">
          <Loader2
            size={32}
            className="spin"
          />

          <p>
            Loading your previous analysis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-analysis-page">

      {/* HERO */}

      <div className="analysis-hero">
        <div className="hero-badge">
          <Sparkles size={15} />
          AI CAREER ANALYSIS
        </div>

        <h1>
          Resume + GitHub
          <span>
            Combined Analysis
          </span>
        </h1>

        <p>
          Upload your resume and connect
          your GitHub profile. Gemini will
          analyze both sources together and
          create one personalized career
          report.
        </p>
      </div>


      {/* INPUT AREA */}

      <div className="input-grid">

        {/* RESUME CARD */}

        <div className="input-card">

          <div className="input-card-header">
            <div className="input-icon">
              <FileText
                size={24}
              />
            </div>

            <div>
              <h2>
                Upload Resume
              </h2>

              <p>
                PDF only • Maximum 5MB
              </p>
            </div>
          </div>

          <label
            className={`upload-box ${
              file
                ? "has-file"
                : ""
            }`}
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={
                handleFileChange
              }
            />

            {file ? (
              <>
                <CheckCircle2
                  size={38}
                />

                <strong>
                  {file.name}
                </strong>

                <span>
                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </span>
              </>
            ) : (
              <>
                <Upload
                  size={38}
                />

                <strong>
                  Click to upload
                </strong>

                <span>
                  or drag your PDF here
                </span>
              </>
            )}
          </label>

        </div>


        {/* GITHUB CARD */}

        <div className="input-card">

          <div className="input-card-header">
            <div className="input-icon github-icon">
              <Github
                size={24}
              />
            </div>

            <div>
              <h2>
                GitHub Profile
              </h2>

              <p>
                Analyze your projects
                and coding activity
              </p>
            </div>
          </div>

          <div className="github-input-wrapper">
            <Github
              size={21}
            />

            <span>
              github.com/
            </span>

            <input
              type="text"
              value={
                githubUsername
              }
              onChange={(event) =>
                setGithubUsername(
                  event.target.value
                )
              }
              placeholder="your-username"
            />
          </div>

          <div className="input-help">
            Enter your public GitHub
            username. You can also enter
            it with @.
          </div>

        </div>

      </div>


      
      {/* ERROR */}

      {error && (
        <div className="error-box">
          <AlertCircle
            size={20}
          />

          <span>
            {error}
          </span>
        </div>
      )}


      {/* ANALYZE BUTTON */}

      <button
        className="analyze-button"
        onClick={
          handleAnalyze
        }
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2
              size={21}
              className="spin"
            />

            Analyzing Resume +
            GitHub...
          </>
        ) : (
          <>
            <Sparkles
              size={21}
            />

            Analyze My Career Profile

            <ArrowRight
              size={21}
            />
          </>
        )}
      </button>


      {/* LOADING */}

      {loading && (
        <div className="analysis-processing">

          <div className="processing-spinner">
            <Sparkles
              size={28}
            />
          </div>

          <h3>
            Gemini is analyzing
            your profile
          </h3>

          <p>
            Reading your resume,
            analyzing your GitHub
            projects and comparing
            everything with your target
            role.
          </p>

          <div className="processing-steps">
            <span>
              ✓ Resume extraction
            </span>

            <span>
              ✓ GitHub analysis
            </span>

            <span>
              ◌ Career comparison
            </span>
          </div>

        </div>
      )}


      {/* RESULTS */}

      {analysis &&
        !loading && (
          <div className="results-container">

            <div className="results-header">
              <div>
                <div className="hero-badge">
                  <CheckCircle2
                    size={15}
                  />
                  ANALYSIS COMPLETE
                </div>

                <h2>
                  Your Career Profile
                </h2>

                <p>
                  Combined analysis of
                  your resume and GitHub
                  profile.
                </p>
              </div>

              <ScoreCircle
                score={
                  analysis.overallScore
                }
              />
            </div>


            {/* SCORE GRID */}

            <div className="score-grid">

              <ScoreCard
                title="Resume Score"
                score={
                  analysis.resumeScore
                }
              />

              <ScoreCard
                title="GitHub Score"
                score={
                  analysis.githubScore
                }
              />

              <ScoreCard
                title="Project Score"
                score={
                  analysis.projectScore
                }
              />

            </div>


            {/* SUMMARY */}

            {analysis.summary && (
              <div className="summary-card">

                <div className="section-heading">
                  <Sparkles
                    size={21}
                  />

                  <h3>
                    Overall Summary
                  </h3>
                </div>

                <p>
                  {analysis.summary}
                </p>

              </div>
            )}


            {/* VERIFIED SKILLS */}

            <div className="results-grid">

              <ListSection
                title="Detected Skills"
                items={
                  analysis.detectedSkills
                }
                icon={
                  <Code2
                    size={21}
                  />
                }
              />

              <ListSection
                title="Verified Skills"
                items={
                  analysis.verifiedSkills
                }
                icon={
                  <CheckCircle2
                    size={21}
                  />
                }
              />

            </div>


            

           


            {/* RESUME */}

            <div className="results-grid">

              <ListSection
                title="Resume Strengths"
                items={
                  analysis.resumeStrengths
                }
                icon={
                  <CheckCircle2
                    size={21}
                  />
                }
              />

              <ListSection
                title="Resume Weaknesses"
                items={
                  analysis.resumeWeaknesses
                }
                icon={
                  <AlertCircle
                    size={21}
                  />
                }
              />

            </div>


            {/* GITHUB */}

            <div className="results-grid">

              <ListSection
                title="GitHub Strengths"
                items={
                  analysis.githubStrengths
                }
                icon={
                  <Github
                    size={21}
                  />
                }
              />

              <ListSection
                title="GitHub Weaknesses"
                items={
                  analysis.githubWeaknesses
                }
                icon={
                  <AlertCircle
                    size={21}
                  />
                }
              />

            </div>


            {/* RECOMMENDATIONS */}

            <ListSection
              title="Recommendations"
              items={
                analysis.recommendations
              }
              icon={
                <Lightbulb
                  size={21}
                />
              }
            /> 




            {/* RESUME SUGGESTIONS */}

            <ListSection
              title="Resume Improvements"
              items={
                analysis.resumeSuggestions
              }
              icon={
                <FileText
                  size={21}
                />
              }
            />


            {/* GITHUB SUGGESTIONS */}

            <ListSection
              title="GitHub Improvements"
              items={
                analysis.githubSuggestions
              }
              icon={
                <Github
                  size={21}
                />
              }
            />


            {/* TECHNOLOGIES */}

            <ListSection
              title="Technologies Identified"
              items={
                analysis.technologies
              }
              icon={
                <Code2
                  size={21}
                />
              }
            />


            {/* GITHUB PROFILE */}

            {analysis.githubUsername && (
              <div className="github-profile-card">

                <div className="github-profile-left">

                  {analysis.githubAvatarUrl ? (
                    <img
                      src={
                        analysis.githubAvatarUrl
                      }
                      alt="GitHub avatar"
                    />
                  ) : (
                    <Github
                      size={30}
                    />
                  )}

                  <div>
                    <h3>
                      {analysis.githubName ||
                        analysis.githubUsername}
                    </h3>

                    <p>
                      @{analysis.githubUsername}
                    </p>
                  </div>

                </div>

                {analysis.githubProfileUrl && (
                  <a
                    href={
                      analysis.githubProfileUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View GitHub
                    <ExternalLink
                      size={16}
                    />
                  </a>
                )}

              </div>
            )}


            {/* REPOSITORIES */}

            {analysis.githubRepositories
              ?.length > 0 && (
              <div className="repositories-card">

                <div className="section-heading">
                  <FolderGit2
                    size={21}
                  />

                  <h3>
                    Analyzed Projects
                  </h3>
                </div>

                <div className="repository-grid">

                  {analysis.githubRepositories
                    .slice(0, 12)
                    .map(
                      (
                        repo,
                        index
                      ) => (
                        <div
                          className="repository-card"
                          key={`${repo.name}-${index}`}
                        >

                          <div className="repository-top">
                            <h4>
                              {repo.name}
                            </h4>

                            <a
                              href={
                                repo.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink
                                size={16}
                              />
                            </a>
                          </div>

                          <p>
                            {repo.description ||
                              "No description provided."}
                          </p>

                          <div className="repository-meta">

                            {repo.language && (
                              <span>
                                <Code2
                                  size={14}
                                />

                                {
                                  repo.language
                                }
                              </span>
                            )}

                            <span>
                              ⭐{" "}
                              {repo.stars ||
                                0}
                            </span>

                            <span>
                              🍴{" "}
                              {repo.forks ||
                                0}
                            </span>

                          </div>

                        </div>
                      )
                    )}

                </div>

              </div>
            )}

          </div>
        )}

    </div>
  );
};

export default ResumeAnalysis;