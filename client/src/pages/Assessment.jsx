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

      /*
        Get current user first.
        This tells us which target role
        the student selected.
      */

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

      const roleSlug =
        targetRole.slug ||
        targetRole;

      /*
        Get questions specifically
        for this role.
      */

      const response = await api.get(
        `/assessment/questions/${roleSlug}`
      );

      const data =
        response.data?.data ||
        response.data;

      setRole(data?.role || null);
      setQuestions(data?.questions || []);

      /*
        Create empty answer array.
      */

      setAnswers(
        (data?.questions || []).map((question) => ({
          questionId: question.questionId,
          skillSlug: question.skillSlug,
          answer: ""
        }))
      );

    } catch (err) {
      console.error(
        "Assessment loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load your assessment."
      );
    } finally {
      setLoading(false);
    }
  };


  /*
    Select an answer
  */

  const handleAnswer = (answer) => {
    const question =
      questions[currentQuestion];

    setAnswers((previous) =>
      previous.map((item) =>
        item.questionId === question.questionId
          ? {
              ...item,
              answer
            }
          : item
      )
    );
  };


  /*
    Next question
  */

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };


  /*
    Previous question
  */

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };


  /*
    Submit assessment
  */

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const unanswered =
        answers.some(
          (item) => !item.answer
        );

      if (unanswered) {
        setError(
          "Please answer every question before submitting."
        );

        setSubmitting(false);
        return;
      }

      await api.post(
        "/assessment/submit",
        {
          targetRole: role.slug,
          answers
        }
      );

      navigate("/progress");

    } catch (err) {
      console.error(
        "Assessment submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return (
      <div className="assessment-page">

        <div className="assessment-state">

          <div className="assessment-loader"></div>

          <h2>
            Preparing your assessment...
          </h2>

          <p>
            Loading questions based on your
            target career.
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
     ========================= */

  if (error && !questions.length) {
    return (
      <div className="assessment-page">

        <div className="assessment-state">

          <div className="assessment-error-icon">
            !
          </div>

          <h2>
            Assessment unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            className="assessment-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  /* =========================
     NO QUESTIONS
     ========================= */

  if (!questions.length) {
    return (
      <div className="assessment-page">

        <div className="assessment-state">

          <h2>
            No assessment available
          </h2>

          <p>
            There are currently no questions
            available for this career.
          </p>

          <button
            className="assessment-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  const question =
    questions[currentQuestion];

  const currentAnswer =
    answers.find(
      (item) =>
        item.questionId ===
        question.questionId
    )?.answer || "";

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  const answeredCount =
    answers.filter(
      (item) => item.answer
    ).length;

  const isLast =
    currentQuestion ===
    questions.length - 1;


  return (
    <div className="assessment-page">

      {/* BACKGROUND */}

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
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>


          <div className="assessment-role">

            <span>
              TARGET ROLE
            </span>

            <strong>
              {role?.name}
            </strong>

          </div>

        </header>


        {/* INTRO */}

        <section className="assessment-intro">

          <span className="assessment-kicker">
            CAREER SKILL ASSESSMENT
          </span>

          <h1>
            Let's measure your skills.
          </h1>

          <p>
            Answer honestly. Your answers will
            help us identify your strengths and
            skill gaps for your chosen career.
          </p>

        </section>


        {/* PROGRESS */}

        <section className="assessment-progress-section">

          <div className="assessment-progress-top">

            <span>
              Question {currentQuestion + 1}
              {" "}
              of{" "}
              {questions.length}
            </span>

            <span>
              {answeredCount} answered
            </span>

          </div>


          <div className="assessment-progress-track">

            <div
              className="assessment-progress-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

        </section>


        {/* QUESTION */}

        <section className="question-card">

          <div className="question-meta">

            <span className="question-number">
              {String(
                currentQuestion + 1
              ).padStart(2, "0")}
            </span>

            <span className="question-skill">
              {question.skillSlug}
            </span>

            <span className="question-difficulty">
              {question.difficulty ||
                "Assessment"}
            </span>

          </div>


          <h2 className="question-text">
            {question.question}
          </h2>


          <div className="question-options">

            {question.options?.map(
              (option, index) => {

                const selected =
                  currentAnswer === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`question-option ${
                      selected
                        ? "question-option-selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleAnswer(option)
                    }
                  >

                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="option-text">
                      {option}
                    </span>

                    <span className="option-check">
                      {selected
                        ? "✓"
                        : ""}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="assessment-inline-error">
            {error}
          </div>
        )}


        {/* NAVIGATION */}

        <div className="assessment-navigation">

          <button
            type="button"
            className="assessment-secondary-button"
            disabled={
              currentQuestion === 0
            }
            onClick={handlePrevious}
          >
            ← Previous
          </button>


          {!isLast ? (

            <button
              type="button"
              className="assessment-button"
              disabled={!currentAnswer}
              onClick={handleNext}
            >
              Next Question →
            </button>

          ) : (

            <button
              type="button"
              className="assessment-button"
              disabled={
                !currentAnswer ||
                submitting
              }
              onClick={handleSubmit}
            >
              {submitting
                ? "Submitting..."
                : "Submit Assessment ✓"}
            </button>

          )}

        </div>

      </main>

    </div>
  );
};

export default Assessment;