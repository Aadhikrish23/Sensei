import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";
import jdApi from "../api/jd.api";
import interviewApi from "../api/interview.api";

import { Resume } from "../types/resumes.types";
import { JobDescription } from "../types/jd.types";
import { MatchResult, InterviewSession } from "../types/interview.types";

import { useNavigate } from "react-router-dom";

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jds, setJDs] = useState<JobDescription[]>([]);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJD, setSelectedJD] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    loadData();
    loadSessions();
  }, []);

  const loadData = async () => {
    const resumeRes = await resumeApi.getAllResumes();
    const jdRes = await jdApi.getAllJDs();

    setResumes(resumeRes.data);
    setJDs(jdRes.data);
  };

  const loadSessions = async () => {
    const data = await interviewApi.getSessions();
    setSessions(data);
  };

  const handleMatch = async () => {
    if (!selectedResume || !selectedJD) {
      alert("Select resume and JD first");
      return;
    }

    const result = await interviewApi.matchResumeJD(selectedResume, selectedJD);

    setMatchResult(result);
  };

  const handleStartInterview = async () => {
    const session = await interviewApi.startInterview({
      resumeId: selectedResume,
      jdId: selectedJD,
      difficulty: difficulty as any,
    });

    navigate(`/interview/${session.sessionId}`, {
      state: session,
    });
  };
  const handleGenerateReport = async (sessionId: string) => {
    try {
      await interviewApi.completeSession(sessionId);

      await interviewApi.generateFinalReport(sessionId);

      alert("Report generated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* Existing Sessions */}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Interview Sessions</h2>

        {sessions.length === 0 ? (
          <p>No interview sessions yet</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded bg-samurai-card flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {session.roleCategory} Interview
                </p>

                <p className="text-sm">
                  Status: {session.completed ? "Completed" : "Active"}
                </p>
              </div>

              {/* Buttons */}

              <div className="flex gap-3">
                {/* Resume interview */}

                {!session.completed && (
                  <button
                    onClick={() => navigate(`/interview/${session.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Resume Interview
                  </button>
                )}

                {/* Generate Report */}

                {session.completed && !session.reportGeneratedAt && (
                  <button
                    onClick={() => handleGenerateReport(session.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Generate Report
                  </button>
                )}

                {/* View Report */}

                {session.completed && session.reportGeneratedAt && (
                  <button
                    onClick={() => navigate(`/reports`)}
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                  >
                    View Report
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Start Interview */}

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Start Interview</h1>

        <div className="p-6 rounded-lg bg-samurai-card space-y-4">
          <select
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
          >
            <option value="">Select Resume</option>

            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <select
            value={selectedJD}
            onChange={(e) => setSelectedJD(e.target.value)}
          >
            <option value="">Select JD</option>

            {jds.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleMatch}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Match Resume & JD
          </button>
        </div>
      </div>

      {/* Match Result */}

      {matchResult && (
        <div className="p-6 rounded bg-gray-100 space-y-4">
          <h3 className="text-xl font-semibold">
            Match Score: {matchResult.matchPercentage}%
          </h3>

          <div>
            <strong>Strong Skills</strong>
            <p>{matchResult.strongSkills.join(", ")}</p>
          </div>

          <div>
            <strong>Missing Skills</strong>
            <p>{matchResult.missingSkills.join(", ")}</p>
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            onClick={handleStartInterview}
            className="px-6 py-2 bg-green-600 text-white rounded"
          >
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
}
