import { useEffect, useState } from "react";
import jdApi from "../api/jd.api";
import AIAnalysisViewer from "../components/AIAnalysisViewer";

import { JobDescription, JDAnalysis } from "../types/jd.types";

import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

import { Briefcase, Trash2, Brain } from "lucide-react";
import toast from "react-hot-toast";

export default function Jobs() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, JDAnalysis>>({});
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [rawText, setRawText] = useState("");

  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  /* ---------- FETCH ---------- */

  const fetchJobs = async () => {
    try {
      const response = await jdApi.getAllJDs();
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job descriptions");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ---------- CREATE ---------- */

  const handleCreateJD = async () => {
    if (!title || !rawText) {
      toast.error("Title and JD text are required");
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

      toast.success("Job description created");

      fetchJobs();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create JD");
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = async (id: string) => {
    try {
      await jdApi.deleteJD(id);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      toast.success("Job description deleted");
    } catch (error) {
    
    }
  };

  /* ---------- ANALYZE ---------- */

  const handleAnalyze = async (jdId: string) => {

  const toastId = toast.loading("Analyzing JD...");

  try {

    const result = await jdApi.analyzeJD(jdId);

    toast.success("Analysis completed", { id: toastId });

    setAnalysis((prev) => ({
      ...prev,
      [jdId]: result.parsedData,
    }));

    setActiveAnalysis(jdId);

  } catch (error: any) {

    toast.error(
      error?.response?.data?.message || "JD analysis failed",
      { id: toastId }
    );

  }

};

  /* ---------- UI ---------- */

  return (
    <div className="space-y-10">
      {/* PAGE TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Job Descriptions
        </h1>

        <p className="text-samurai-muted dark:text-ninja-muted">
          Manage and analyze job descriptions for interview preparation
        </p>
      </div>

      {/* CREATE JD CARD */}

      <Card>
        <h2 className="text-lg font-semibold mb-4 text-samurai-text dark:text-ninja-text">
          Create Job Description
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="JD Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
            w-full
            p-2
            rounded-md
            border
            border-samurai-border
            dark:border-ninja-border
            bg-white
            dark:bg-[#1e1e26]
            text-samurai-text
            dark:text-white
            "
          />

          <input
            type="text"
            placeholder="Role Category (optional)"
            value={roleCategory}
            onChange={(e) => setRoleCategory(e.target.value)}
            className="
            w-full
            p-2
            rounded-md
            border
            border-samurai-border
            dark:border-ninja-border
            bg-white
            dark:bg-[#1e1e26]
            text-samurai-text
            dark:text-white
            "
          />

          <textarea
            placeholder="Paste Job Description text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={6}
            className="
            w-full
            p-2
            rounded-md
            border
            border-samurai-border
            dark:border-ninja-border
            bg-white
            dark:bg-[#1e1e26]
            text-samurai-text
            dark:text-white
            "
          />

          <button
            onClick={handleCreateJD}
            className="
            px-6
            py-2
            rounded-lg
            bg-samurai-primary
            hover:bg-samurai-primaryHover
            text-white
            transition
            "
          >
            Create JD
          </button>
        </div>
      </Card>

      {/* JD LIST */}

      <Card>
        <h2 className="text-lg font-semibold mb-6 text-samurai-text dark:text-ninja-text">
          Your Job Descriptions
        </h2>

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job descriptions yet"
            description="Create your first job description to start interview preparation."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
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
                <div className="flex items-center gap-2 font-medium text-samurai-text dark:text-white mb-3">
                  <Briefcase
                    size={18}
                    className="text-samurai-primary dark:text-ninja-accent"
                  />

                  {job.title}
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => handleAnalyze(job.id)}
                    className="flex items-center gap-1 text-green-500 hover:text-green-400 transition"
                  >
                    <Brain size={16} />
                    Analyze
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* MODAL ANALYSIS */}

      <Modal
        open={activeAnalysis !== null}
        onClose={() => setActiveAnalysis(null)}
      >
        {activeAnalysis && analysis[activeAnalysis] && (
          <AIAnalysisViewer data={analysis[activeAnalysis]} />
        )}
      </Modal>

      {/* FEEDBACK */}
    </div>
  );
}
