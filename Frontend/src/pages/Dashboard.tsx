import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";
import jdApi from "../api/jd.api";
import interviewApi from "../api/interview.api";

import { useNavigate } from "react-router-dom";

import { FileText, Briefcase, Mic } from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const resumes = await resumeApi.getAllResumes();
      const jobs = await jdApi.getAllJDs();
      const sessions = await interviewApi.getSessions();

      setResumeCount(resumes.data.length);
      setJobCount(jobs.data.length);
      setInterviewCount(sessions.length);

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Welcome to Sensei
        </h1>

        <p className="text-samurai-muted dark:text-ninja-muted">
          Your AI interview training platform
        </p>

      </div>


      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* RESUMES */}

        <div
          className="
          p-6
          rounded-xl
          border
          border-samurai-border
          dark:border-ninja-border
          bg-white
          dark:bg-[#1e1e26]
          flex items-center gap-4
          "
        >

          <div className="p-3 rounded-lg bg-red-600/20">
            <FileText className="text-red-500" size={20} />
          </div>

          <div>
            <p className="text-sm text-samurai-muted dark:text-ninja-muted">
              Resumes
            </p>

            <p className="text-2xl font-bold text-samurai-text dark:text-ninja-text">
              {resumeCount}
            </p>
          </div>

        </div>


        {/* JOBS */}

        <div
          className="
          p-6
          rounded-xl
          border
          border-samurai-border
          dark:border-ninja-border
          bg-white
          dark:bg-[#1e1e26]
          flex items-center gap-4
          "
        >

          <div className="p-3 rounded-lg bg-indigo-600/20">
            <Briefcase className="text-indigo-400" size={20} />
          </div>

          <div>
            <p className="text-sm text-samurai-muted dark:text-ninja-muted">
              Jobs
            </p>

            <p className="text-2xl font-bold  text-samurai-text dark:text-ninja-text">
              {jobCount}
            </p>
          </div>

        </div>


        {/* INTERVIEWS */}

        <div
          className="
          p-6
          rounded-xl
          border
          border-samurai-border
          dark:border-ninja-border
          bg-white
          dark:bg-[#1e1e26]
          flex items-center gap-4
          "
        >

          <div className="p-3 rounded-lg bg-cyan-600/20">
            <Mic className="text-cyan-400" size={20} />
          </div>

          <div>
            <p className="text-sm text-samurai-muted dark:text-ninja-muted">
              Interviews
            </p>

            <p className="text-2xl font-bold  text-samurai-text dark:text-ninja-text">
              {interviewCount}
            </p>
          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="space-y-4">

        <h2 className="text-xl font-semibold  text-samurai-text dark:text-ninja-text">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/resumes")}
            className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
          >
            Upload Resume
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
          >
            Add Job Description
          </button>

          <button
            onClick={() => navigate("/interviews")}
            className="px-6 py-3 rounded-lg bg-samurai-primary text-white"
          >
            Start Interview
          </button>

        </div>

      </div>

    </div>
  );
}