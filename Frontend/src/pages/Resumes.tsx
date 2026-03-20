import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";
import { Resume, ResumeAnalysis } from "../types/resumes.types";

import { FileText, Trash2, Brain, UploadCloud } from "lucide-react";

import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import AIAnalysisViewer from "../components/AIAnalysisViewer";
import toast from "react-hot-toast";

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, ResumeAnalysis>>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */

  const fetchResumes = async () => {
    try {
      const res = await resumeApi.getAllResumes();
      setResumes(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch resumes");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  /* ---------------- UPLOAD ---------------- */

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Resume", file);

      await resumeApi.uploadResume(formData);

      setFile(null);
      toast.success("Resume uploaded");

      fetchResumes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id: string) => {
    try {
      await resumeApi.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {}
  };

  /* ---------------- ANALYZE ---------------- */

  const handleAnalyze = async (resumeId: string) => {
    const toastId = toast.loading("Analyzing resume...");

    try {
      const result = await resumeApi.analyzeResume(resumeId);

      toast.success("Analysis completed", { id: toastId });

      setAnalysis((prev) => ({
        ...prev,
        [resumeId]: result.parsedData,
      }));

      setActiveAnalysis(resumeId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Resume analysis failed", {
        id: toastId,
      });
      if (err.message.includes("Invalid resume")) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      }
    }
  };
  /* ---------------- DRAG DROP ---------------- */

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-10">
      {/* TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Resumes
        </h1>

        <p className="text-samurai-muted dark:text-ninja-muted">
          Upload and analyze your resumes for interview preparation
        </p>
      </div>

      {/* UPLOAD AREA */}

      <Card>
        <div
          className={`
          border-2
          border-dashed
          rounded-xl
          p-10
          flex flex-col items-center justify-center
          text-center
          cursor-pointer
          transition
          ${
            dragging
              ? "border-samurai-primary bg-samurai-primary/10"
              : "border-samurai-border dark:border-ninja-border"
          }
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud size={36} className="mb-4 text-samurai-primary" />

          <p className="font-medium text-samurai-text dark:text-ninja-text">
            Drag your resume here
          </p>

          <p className="text-sm text-samurai-muted dark:text-ninja-muted">or</p>

          <label className="mt-3 cursor-pointer text-samurai-primary dark:text-ninja-accent font-medium">
            Browse File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {file && (
            <p className="mt-3 text-sm text-green-500">Selected: {file.name}</p>
          )}
          {file && (
            <button
              onClick={handleUpload}
              className="
            mt-5
            px-6
            py-2
            rounded-lg
            bg-samurai-primary
            hover:bg-samurai-primaryHover
            text-white
            transition
            "
            >
              Upload Resume
            </button>
          )}
        </div>
      </Card>

      {/* RESUME LIST */}

      <Card>
        <h2 className="text-lg font-semibold mb-6 text-samurai-text dark:text-ninja-text">
          Your Resumes
        </h2>

        {resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No resumes uploaded"
            description="Upload your first resume to start analysis."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="
                p-5
                rounded-lg
                border
                border-samurai-border dark:border-ninja-border
                bg-white dark:bg-[#1e1e26]
                hover:border-samurai-primary
                hover:shadow-lg
                transition
                "
              >
                {!resume.parsedData ? (
                  <div className="text-xs px-3 py-2 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    ⚠️ Resume not analyzed yet. Click "Analyze" to continue.
                  </div>
                ) : (
                  <div className="text-xs px-3 py-2 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                    ✅ Resume analysis completed. Next: Upload JD & start
                    interview.
                  </div>
                )}
                <div className="flex items-center gap-2 font-medium text-samurai-text dark:text-white mb-3">
                  <FileText
                    size={18}
                    className="text-samurai-primary dark:text-ninja-accent"
                  />
                  {resume.title}
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => handleAnalyze(resume.id)}
                    className="flex items-center gap-1 text-green-500 hover:text-green-400 transition"
                  >
                    <Brain size={16} />
                    Analyze
                  </button>

                  <button
                    onClick={() => handleDelete(resume.id)}
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

      {/* MODAL */}

      <Modal
        open={activeAnalysis !== null}
        onClose={() => setActiveAnalysis(null)}
      >
        {activeAnalysis && analysis[activeAnalysis] && (
          <AIAnalysisViewer data={analysis[activeAnalysis]} />
        )}
      </Modal>
    </div>
  );
}
