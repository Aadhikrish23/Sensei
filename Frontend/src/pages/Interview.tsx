import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import interviewApi from "../api/interview.api";
import { InterviewQuestion } from "../types/interview.types";

export default function Interview() {
  const { sessionId } = useParams();
  const location = useLocation();

  const initialQuestion = location.state as InterviewQuestion | null;

  const [question, setQuestion] = useState<InterviewQuestion | null>(
    initialQuestion,
  );

  const [questionNumber, setQuestionNumber] = useState(
    initialQuestion?.questionNumber || 1,
  );

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const navigate = useNavigate();

  // Load session if user resumed interview (no navigation state)
  const loadSession = async () => {
    if (!sessionId) return;

    try {
      const session = await interviewApi.getSessionById(sessionId);

      if (session.question) {
        setQuestion(session.question);

        setQuestionNumber(session.question.questionNumber);
      }
    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  // This MUST be outside the function
  useEffect(() => {
    if (!initialQuestion) {
      loadSession();
    }
  }, []);

  const handleSubmit = async () => {
    if (!sessionId || !question) return;

    setLoading(true);

    const response = await interviewApi.submitAnswer({
      sessionId,
      questionNumber,
      answerText: answer,
    });

    if (response.interviewComplete) {
      setInterviewComplete(true);

      const report = await interviewApi.endInterview(sessionId);

      navigate("/report", {
        state: { summary: report.summary },
      });

      return;
    }

    if (response.nextQuestion) {
      setQuestion(response.nextQuestion);

      setQuestionNumber(response.nextQuestion.questionNumber);

      setAnswer("");
    }

    setLoading(false);
  };

  const handleFinishInterview = async () => {
    if (!sessionId) return;

    const result = await interviewApi.endInterview(sessionId);

    navigate("/reports", {
      state: {
        summary: result.summary,
      },
    });
  };

  if (!question) {
    return <div>Loading interview...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Sensei AI Interview
        </h1>

        <span
          className="
        text-sm
        px-3 py-1
        rounded-md
        bg-blue-600
        text-white
        "
        >
          Question {questionNumber}
        </span>
      </div>

      {/* QUESTION CARD */}

      <div
        className="
      p-6
      rounded-xl
      border
      border-samurai-border
      dark:border-ninja-border
      bg-white
      dark:bg-[#1e1e26]
      shadow
      "
      >
        <h3 className="text-lg font-semibold mb-3 text-samurai-text dark:text-white">
          Interview Question
        </h3>

        <p className="text-lg text-samurai-text dark:text-gray-200 leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* ANSWER SECTION */}

      {!interviewComplete && (
        <div
          className="
        p-6
        rounded-xl
        border
        border-samurai-border
        dark:border-ninja-border
        bg-white
        dark:bg-[#1e1e26]
        space-y-4
        "
        >
          <h3 className="font-semibold text-samurai-text dark:text-white">
            Your Answer
          </h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            className="
          w-full
          p-4
          rounded-lg
          border
          border-samurai-border
          dark:border-ninja-border
          bg-white
          dark:bg-[#111116]
          text-samurai-text
          dark:text-white
          focus:outline-none
          focus:ring-2
          focus:ring-samurai-primary
          "
            placeholder="Explain your answer clearly..."
          />

          {/* ACTION BUTTONS */}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
            px-6 py-2
            rounded-lg
            bg-blue-600
            hover:bg-blue-700
            text-white
            transition
            disabled:opacity-50
            "
            >
              {loading ? (
                <span className="animate-pulse">
                  Sensei is analyzing your answer...
                </span>
              ) : (
                "Submit Answer"
              )}
            </button>

            <button
              onClick={handleFinishInterview}
              className="
            px-6 py-2
            rounded-lg
            bg-red-600
            hover:bg-red-700
            text-white
            transition
            "
            >
              End Interview
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}

      {interviewComplete && (
        <div
          className="
        p-6
        rounded-lg
        bg-green-100
        dark:bg-green-900/30
        text-green-700
        dark:text-green-300
        "
        >
          <h3 className="font-semibold text-lg">Interview Completed</h3>

          <p>Your interview has ended. You can now view the report.</p>
        </div>
      )}
    </div>
  );
}
