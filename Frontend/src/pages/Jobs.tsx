import { useEffect, useState } from "react";
import jdApi from "../api/jd.api";
import AIAnalysisViewer from "../components/AIAnalysisViewer";
import { JobDescription, JDAnalysis } from "../types/jd.types";

export default function Jobs() {

  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, JDAnalysis>>({});
  const [openAnalysis, setOpenAnalysis] = useState<Record<string, boolean>>({});

  const [title, setTitle] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [rawText, setRawText] = useState("");

  /* ---------- FETCH ---------- */

  const fetchJobs = async () => {
    try {
      const response = await jdApi.getAllJDs();
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------- CREATE ---------- */

  const handleCreateJD = async () => {
    if (!title || !rawText) {
      alert("Title and JD text are required");
      return;
    }

    try {
      await jdApi.createJD({
        title,
        rawText,
        roleCategory,
      });

      setTitle("");
      setRoleCategory("");
      setRawText("");

      await fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = async (id: string) => {
    try {
      await jdApi.deleteJD(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------- ANALYZE ---------- */

  const handleAnalyze = async (jdId: string) => {
    try {

      const result = await jdApi.analyzeJD(jdId);

      setAnalysis((prev) => ({
        ...prev,
        [jdId]: result.parsedData,
      }));

      setOpenAnalysis((prev) => ({
        ...prev,
        [jdId]: true,
      }));

    } catch (error) {
      console.error(error);
    }
  };

  const toggleAnalysis = (jdId: string) => {
    setOpenAnalysis((prev) => ({
      ...prev,
      [jdId]: !prev[jdId],
    }));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ---------- UI ---------- */

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
        Job Descriptions
      </h1>

      {/* CREATE JD */}

      <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card space-y-4">

        <h2 className="text-lg font-semibold">Create Job Description</h2>

        <input
          type="text"
          placeholder="JD Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Role Category (optional)"
          value={roleCategory}
          onChange={(e) => setRoleCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Paste Job Description text here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={6}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleCreateJD}
          className="px-6 py-2 rounded-lg bg-samurai-primary text-white"
        >
          Create JD
        </button>

      </div>

      {/* JD LIST */}

      <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">

        <h2 className="text-lg font-semibold mb-4">
          Job Descriptions
        </h2>

        {jobs.length === 0 ? (
          <p className="text-samurai-muted dark:text-ninja-muted">
            No job descriptions created yet
          </p>
        ) : (
          <ul className="space-y-4">

            {jobs.map((job) => (

              <li key={job.id} className="border-b pb-4 space-y-3">

                <div className="flex justify-between items-center">

                  <span>{job.title}</span>

                  <div className="flex gap-3">

                    <button
                      onClick={() => handleAnalyze(job.id)}
                      className="text-blue-500"
                    >
                      Analyze
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* COLLAPSIBLE ANALYSIS */}

                {analysis[job.id] && (
                  <div>

                    <button
                      onClick={() => toggleAnalysis(job.id)}
                      className="text-sm text-blue-500"
                    >
                      {openAnalysis[job.id]
                        ? "Hide Analysis ▲"
                        : "View Analysis ▼"}
                    </button>

                    {openAnalysis[job.id] && (
                      <AIAnalysisViewer data={analysis[job.id]} />
                    )}

                  </div>
                )}

              </li>

            ))}

          </ul>
        )}

      </div>

    </div>
  );
}