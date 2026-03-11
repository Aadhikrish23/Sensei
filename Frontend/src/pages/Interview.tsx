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

  setInterviewComplete(true)

  const report = await interviewApi.endInterview(sessionId)

  navigate("/report", {
    state: { summary: report.summary }
  })

  return
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sensei AI Interview</h1>

        <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
          Question {questionNumber}
        </span>
      </div>

      <div className="p-6 rounded-lg bg-samurai-card shadow">
        <h3 className="text-lg font-semibold mb-3">Interview Question</h3>

        <p className="text-lg">{question.questionText}</p>
      </div>

      {!interviewComplete && (
        <div className="p-6 rounded-lg bg-samurai-card space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            className="w-full p-4 border rounded"
            placeholder="Explain your answer clearly..."
          />

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Processing..." : "Submit Answer"}
            </button>

            <button
              onClick={handleFinishInterview}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              End Interview
            </button>
          </div>
        </div>
      )}

      {interviewComplete && (
        <div className="p-6 rounded-lg bg-green-100">
          <h3 className="font-semibold text-green-700">Interview Completed</h3>

          <p>Your interview has ended. You can now view the report.</p>
        </div>
      )}
    </div>
  );
}
