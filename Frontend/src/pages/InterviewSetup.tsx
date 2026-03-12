import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";
import jdApi from "../api/jd.api";
import interviewApi from "../api/interview.api";

import { Resume } from "../types/resumes.types";
import { JobDescription } from "../types/jd.types";
import { MatchResult, InterviewSession } from "../types/interview.types";

import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

import { FileText, Briefcase, Brain } from "lucide-react";
import toast from "react-hot-toast";

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
      // alert("Select resume and JD first");
      toast.error("Select resume and JD first");
      return;
    }

    const toastId = toast.loading("Analyzing...");

    const result = await interviewApi.matchResumeJD(selectedResume, selectedJD);

    toast.success("Analysis completed", { id: toastId });

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

      // alert("Report generated successfully");
      toast.success("Report generated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* PAGE TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Interview Setup
        </h1>

        <p className="text-samurai-muted dark:text-ninja-muted">
          Start new interviews or continue previous sessions
        </p>
      </div>

      {/* EXISTING SESSIONS */}

      <Card>
        <h2 className="text-lg font-semibold mb-6 text-samurai-text dark:text-ninja-text">
          Existing Interview Sessions
        </h2>

        {sessions.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No interview sessions yet"
            description="Start your first AI interview practice."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="
                p-5
                rounded-lg
                border
                border-samurai-border
                dark:border-ninja-border
                bg-white
                dark:bg-[#1e1e26]
                hover:border-samurai-primary
                hover:shadow-lg
                transition
                "
              >
                <div className="font-semibold text-samurai-text dark:text-white">
                  {session.roleCategory} Interview
                </div>

                <p className="text-sm text-samurai-muted dark:text-ninja-muted mb-4">
                  Status: {session.completed ? "Completed" : "Active"}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {!session.completed && (
                    <button
                      onClick={() => navigate(`/interview/${session.id}`)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
                    >
                      Resume
                    </button>
                  )}

                  {session.completed && !session.reportGeneratedAt && (
                    <button
                      onClick={() => handleGenerateReport(session.id)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded"
                    >
                      Generate Report
                    </button>
                  )}

                  {session.completed && session.reportGeneratedAt && (
                    <button
                      onClick={() => navigate(`/reports`)}
                      className="px-4 py-2 text-sm bg-purple-600 text-white rounded"
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* START INTERVIEW */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-samurai-text dark:text-ninja-text">
            Start New Interview
          </h2>

          <div className="space-y-4">
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full p-2 rounded-md border text-samurai-text dark:text-ninja-text border-samurai-border dark:border-ninja-border bg-white dark:bg-[#1e1e26]"
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
              className="w-full p-2 rounded-md border text-samurai-text dark:text-ninja-text border-samurai-border dark:border-ninja-border bg-white dark:bg-[#1e1e26]"
            >
              <option value="">Select Job Description</option>

              {jds.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleMatch}
              className="
        w-full
        px-6 py-2
        rounded-lg
        bg-blue-600
        hover:bg-blue-700
        text-white
        transition
        "
            >
              Match Resume & JD
            </button>
          </div>
        </Card>

        {/* RIGHT PANEL ALWAYS VISIBLE */}

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-samurai-text dark:text-ninja-text">
            Match Result
          </h2>

          {/* SCORE */}

          <div className="text-4xl font-bold text-green-500 mb-6">
            {matchResult?.matchPercentage ?? 0}%
          </div>

          {/* STRONG SKILLS */}

          <div className="mb-4">
            <p className="font-semibold mb-2 text-samurai-text dark:text-ninja-text">
              Strong Skills
            </p>

            {matchResult?.strongSkills?.length ? (
              <div className="flex flex-wrap gap-2">
                {matchResult.strongSkills.map((skill) => (
                  <span
                    key={skill}
                    className="
              px-3 py-1
              text-xs
              rounded-md
              bg-green-600/20
              text-green-400
              "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-samurai-muted dark:text-ninja-muted ">
                No strong skills detected yet
              </p>
            )}
          </div>

          {/* MISSING SKILLS */}

          <div className="mb-6">
            <p className="font-semibold mb-2c text-samurai-text dark:text-ninja-text">
              Missing Skills
            </p>

            {matchResult?.missingSkills?.length ? (
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="
              px-3 py-1
              text-xs
              rounded-md
              bg-red-600/20
              text-red-400
              "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-samurai-muted dark:text-ninja-muted">
                No missing skills detected
              </p>
            )}
          </div>

          {/* DIFFICULTY */}

          <select
            value={difficulty}
            disabled={!matchResult}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 mb-4 rounded-md border text-samurai-text dark:text-ninja-text border-samurai-border dark:border-ninja-border bg-white dark:bg-[#1e1e26]"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* START BUTTON */}

          <button
            disabled={!matchResult}
            onClick={handleStartInterview}
            className={`
        w-full px-6 py-2 rounded-lg text-white transition
        ${
          matchResult
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-500 cursor-not-allowed"
        }
      `}
          >
            Start Interview
          </button>
        </Card>
      </div>
    </div>
  );
}
