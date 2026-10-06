import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Assessment.css";

const Assessment = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [role, setRole] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submittedAssessment, setSubmittedAssessment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError("");

      const userResponse = await api.get("/auth/me");

      const user =
        userResponse.data?.user ||
        userResponse.data?.data ||
        userResponse.data;

      const targetRole = user?.targetRole;

      if (!targetRole) {
        setError(
          "Please select your target role before starting the assessment."
        );
        setLoading(false);
        return;
      }

      const roleSlug = targetRole.slug || targetRole;

      const response = await api.get(`/assessment/questions/${roleSlug}`);

      const data = response.data?.data || response.data;

      const loadedQuestions = data?.questions || [];
      setRole(data?.role || null);
      setQuestions(loadedQuestions);

      setAnswers(
        loadedQuestions.map((q) => {
          const qId = q.questionId || q.id;
          return {
            questionId: qId,
            id: qId,
            skillSlug: q.skillSlug,
            answer: "",
            status: "unanswered" // "answered" | "skipped" | "unanswered"
          };
        })
      );
    } catch (err) {
      console.error("Assessment loading error:", err);
      setError(
        err.response?.data?.message || "Unable to load your assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    if (!question) return;
    const qId = question.questionId || question.id;

    setAnswers((previous) =>
      previous.map((item) =>
        (item.questionId || item.id) === qId
          ? {
              ...item,
              answer,
              status: "answered"
            }
          : item
      )
    );
  };

  const handleSkip = () => {
    const question = questions[currentQuestion];
    if (!question) return;
    const qId = question.questionId || question.id;

    setAnswers((previous) =>
      previous.map((item) =>
        (item.questionId || item.id) === qId
          ? {
              ...item,
              status: item.answer ? "answered" : "skipped"
            }
          : item
      )
    );

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Find any question that has neither an answer nor was explicitly skipped
      const untouchedIndices = answers
        .map((item, idx) => (!item.answer && item.status !== "skipped" ? idx + 1 : null))
        .filter(Boolean);

      if (untouchedIndices.length > 0) {
        setError(
          `Question(s) ${untouchedIndices.join(", ")} are still unanswered. Please answer or review them before submitting.`
        );
        setSubmitting(false);
        return;
      }

      const res = await api.post("/assessment/submit", {
        targetRole: role?.slug || "",
        answers: answers.map((a) => ({
          questionId: a.questionId || a.id,
          skillSlug: a.skillSlug,
          answer: a.answer || ""
        }))
      });

      const assessmentResult = res.data?.data || res.data;
      setSubmittedAssessment(assessmentResult);
    } catch (err) {
      console.error("Assessment submission error:", err);
      setError(
        err.response?.data?.message || "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assessment-page">
        <div className="assessment-state">
          <div className="assessment-loader"></div>
          <h2>Preparing your assessment...</h2>
          <p>Loading questions based on your target career.</p>
        </div>
      </div>
    );
  }

  if (submittedAssessment) {
    const overallScore = submittedAssessment.overallScore ?? 0;
    const skillResults = Array.isArray(submittedAssessment.results) ? submittedAssessment.results : [];
    const answeredCount = answers.filter((a) => a.answer).length;
    const skippedCount = answers.filter((a) => a.status === "skipped" && !a.answer).length;

    return (
      <div className="assessment-page">
        <div className="assessment-background">
          <div className="assessment-orb assessment-orb-one"></div>
          <div className="assessment-orb assessment-orb-two"></div>
          <div className="assessment-grid"></div>
        </div>

        <main className="assessment-container">
          <header className="assessment-header">
            <button
              className="assessment-back"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>
            <div className="assessment-role">
              <span className="assessment-role-label">TARGET ROLE</span>
              <strong>{role?.name || submittedAssessment.targetRole || "Career Role"}</strong>
            </div>
          </header>

          <section className="assessment-intro" style={{ marginTop: "24px" }}>
            <span className="assessment-kicker">ASSESSMENT COMPLETED</span>
            <h1>Your Skill Assessment Results</h1>
            <p>
              Great work! Your responses have been analyzed and your skill profile has been updated.
            </p>
          </section>

          <div className="assessment-scorecard-card">
            <div className="scorecard-top">
              <div className="scorecard-circle">
                <span className="scorecard-value">{overallScore}%</span>
                <span className="scorecard-label">Overall Score</span>
              </div>
              <div className="scorecard-summary">
                <h3>
                  {overallScore >= 70
                    ? "Ready to Excel! 🚀"
                    : overallScore >= 45
                    ? "Solid Foundation! 📈"
                    : "Learning Journey Ahead! 🎯"}
                </h3>
                <p>
                  You answered {answeredCount} out of {questions.length} questions
                  {skippedCount > 0 && ` (${skippedCount} skipped)`}.
                </p>
                <div className="scorecard-badges">
                  <span className="badge-answered">
                    ✓ {answeredCount} Answered
                  </span>
                  {skippedCount > 0 && (
                    <span className="badge-skipped">
                      ↷ {skippedCount} Skipped
                    </span>
                  )}
                </div>
              </div>
            </div>

            {skillResults.length > 0 && (
              <div className="scorecard-breakdown">
                <h4>Skill-by-Skill Performance</h4>
                <div className="scorecard-skills-grid">
                  {skillResults.map((s) => (
                    <div key={s.skillSlug} className="scorecard-skill-item">
                      <div className="skill-item-header">
                        <span className="skill-item-name">{s.skillSlug.replace(/-/g, " ")}</span>
                        <span className="skill-item-score">{s.score}%</span>
                      </div>
                      <div className="skill-progress-bar">
                        <div
                          className="skill-progress-fill"
                          style={{
                            width: `${s.score}%`,
                            backgroundColor:
                              s.score >= 70
                                ? "#34d399"
                                : s.score >= 45
                                ? "#fbbf24"
                                : "#f87171"
                          }}
                        />
                      </div>
                      <span className="skill-item-detail">
                        {s.correctAnswers} / {s.totalQuestions} correct
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="scorecard-actions">
              <button
                className="assessment-button"
                onClick={() => navigate("/career-roadmap")}
              >
                Generate Personalized Roadmap →
              </button>
              <button
                className="assessment-secondary-button"
                onClick={() => navigate("/projects")}
              >
                Recommended Projects
              </button>
              <button
                className="assessment-secondary-button"
                onClick={() => navigate("/progress")}
              >
                Track Progress
              </button>
              <button
                className="assessment-secondary-button"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="assessment-page">
        <div className="assessment-state">
          <div className="assessment-error-icon">!</div>
          <h2>Assessment unavailable</h2>
          <p>{error}</p>
          <button
            className="assessment-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="assessment-page">
        <div className="assessment-state">
          <h2>No assessment available</h2>
          <p>There are currently no questions available for this career.</p>
          <button
            className="assessment-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const qId = question?.questionId || question?.id;

  const currentAnswerItem = answers.find(
    (item) => (item.questionId || item.id) === qId
  );
  const currentAnswer = currentAnswerItem?.answer || "";
  const currentStatus = currentAnswerItem?.status || (currentAnswer ? "answered" : "unanswered");

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = answers.filter((item) => item.answer).length;
  const skippedCount = answers.filter((item) => item.status === "skipped" && !item.answer).length;

  const isLast = currentQuestion === questions.length - 1;

  return (
    <div className="assessment-page">
      <div className="assessment-background">
        <div className="assessment-orb assessment-orb-one"></div>
        <div className="assessment-orb assessment-orb-two"></div>
        <div className="assessment-grid"></div>
      </div>

      <main className="assessment-container">
        {/* HEADER */}
        <header className="assessment-header">
          <button
            className="assessment-back"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="assessment-role">
            <span className="assessment-role-label">TARGET ROLE</span>
            <strong>{role?.name || "Career Assessment"}</strong>
          </div>
        </header>

        {/* INTRO */}
        <section className="assessment-intro">
          <span className="assessment-kicker">CAREER SKILL ASSESSMENT</span>
          <h1>Let's measure your skills.</h1>
          <p>
            Answer honestly. Your answers will help identify strengths and skill
            gaps for your target role.
          </p>
        </section>

        {/* PROGRESS & STATUS */}
        <section className="assessment-progress-section">
          <div className="assessment-progress-top">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div style={{ display: "flex", gap: "14px", fontSize: "13px" }}>
              <span style={{ color: "#34d399" }}>
                ✓ {answeredCount} Answered
              </span>
              {skippedCount > 0 && (
                <span style={{ color: "#fbbf24" }}>
                  ↷ {skippedCount} Skipped
                </span>
              )}
            </div>
          </div>

          <div className="assessment-progress-track">
            <div
              className="assessment-progress-fill"
              style={{
                width: `${progress}%`
              }}
            />
          </div>

          {/* QUESTION PALETTE / QUICK NAVIGATOR */}
          <div className="question-palette">
            {questions.map((q, idx) => {
              const item = answers.find(
                (a) => (a.questionId || a.id) === (q.questionId || q.id)
              );
              const isAnswered = Boolean(item?.answer);
              const isSkipped = item?.status === "skipped" && !item?.answer;
              const isCurrent = idx === currentQuestion;

              let badgeClass = "palette-badge";
              if (isCurrent) badgeClass += " palette-badge-current";
              if (isAnswered) badgeClass += " palette-badge-answered";
              else if (isSkipped) badgeClass += " palette-badge-skipped";

              return (
                <button
                  key={q.questionId || q.id || idx}
                  type="button"
                  className={badgeClass}
                  onClick={() => setCurrentQuestion(idx)}
                  title={`Question ${idx + 1}: ${isAnswered ? "Answered" : isSkipped ? "Skipped" : "Unanswered"}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </section>

        {/* QUESTION CARD */}
        <section className="question-card">
          <div className="question-meta">
            <span className="question-number">
              {String(currentQuestion + 1).padStart(2, "0")}
            </span>
            <span className="question-skill">{question.skillSlug}</span>
            <span className="question-difficulty">
              {question.difficulty || "Assessment"}
            </span>
            {currentStatus === "skipped" && !currentAnswer && (
              <span className="question-status-pill skipped">Skipped</span>
            )}
            {currentAnswer && (
              <span className="question-status-pill answered">Answered</span>
            )}
          </div>

          <h2 className="question-text">{question.question}</h2>

          <div className="question-options">
            {question.options?.map((option, index) => {
              const selected = currentAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  className={`question-option ${
                    selected ? "question-option-selected" : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  <span className="option-check">{selected ? "✓" : ""}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* INLINE ERROR */}
        {error && (
          <div className="assessment-inline-error">
            {error}
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="assessment-navigation">
          <button
            type="button"
            className="assessment-secondary-button"
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
          >
            ← Previous
          </button>

          <button
            type="button"
            className="assessment-secondary-button"
            style={{
              borderColor: "rgba(251, 191, 36, 0.4)",
              color: "#fbbf24"
            }}
            onClick={handleSkip}
          >
            Skip Question ↷
          </button>

          {!isLast ? (
            <button
              type="button"
              className="assessment-button"
              onClick={handleNext}
            >
              Next Question →
            </button>
          ) : (
            <button
              type="button"
              className="assessment-button"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Assessment ✓"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assessment;