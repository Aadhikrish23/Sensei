import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";
import { Resume, ResumeAnalysis } from "../types/resumes.types";
import AIAnalysisViewer from "../components/AIAnalysisViewer";
export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, ResumeAnalysis>>({});
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAnalysis, setOpenAnalysis] = useState<Record<string, boolean>>({});

  /* ---------- FETCH RESUMES ---------- */

  const fetchResumes = async () => {
    try {
      const userdata = await resumeApi.getAllResumes();
      setResumes(userdata.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to fetch resumes");
    }
  };

  /* ---------- UPLOAD ---------- */

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("Resume", file);

      await resumeApi.uploadResume(formData);

      setSuccess("Resume uploaded successfully");
      setFile(null);

      await fetchResumes();
    } catch (error: any) {
      setError(error?.response?.data?.message || "Upload failed");
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      setSuccess(null);

      await resumeApi.deleteResume(id);

      setResumes((prev) => prev.filter((resume) => resume.id !== id));

      setSuccess("Resume deleted successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete resume");
    }
  };

  /* ---------- ANALYZE ---------- */

  const handleAnalyze = async (resumeId: string) => {
    try {
      setError(null);

      const result = await resumeApi.analyzeResume(resumeId);

      setAnalysis((prev) => ({
        ...prev,
        [resumeId]: result.parsedData,
      }));

      setOpenAnalysis((prev) => ({
        ...prev,
        [resumeId]: true,
      }));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Resume analysis failed");
    }
  };

  const toggleAnalysis = (resumeId: string) => {
    setOpenAnalysis((prev) => ({
      ...prev,
      [resumeId]: !prev[resumeId],
    }));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  /* ---------- RENDER ---------- */

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
        Resumes
      </h1>

      {/* Upload Section */}

      <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
        <label className="block mb-2 font-medium">Upload Resume</label>

        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            setFile(selectedFile);
          }}
        />

        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 rounded-lg bg-samurai-primary text-white"
        >
          Upload
        </button>
      </div>

      {/* Resume List */}

      <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
        <h2 className="text-lg font-semibold mb-4">Uploaded Resumes</h2>

        {resumes.length === 0 ? (
          <p className="text-samurai-muted dark:text-ninja-muted">
            No resumes uploaded yet
          </p>
        ) : (
          <ul className="space-y-4">
            {resumes.map((resume) => (
              <li key={resume.id} className="border-b pb-4 space-y-3">
                {/* Header */}

                <div className="flex justify-between items-center">
                  <span>{resume.title}</span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAnalyze(resume.id)}
                      className="text-blue-500"
                    >
                      Analyze
                    </button>

                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Collapsible Analysis */}

                {analysis[resume.id] && (
                  <div>
                    <button
                      onClick={() => toggleAnalysis(resume.id)}
                      className="text-sm text-blue-500"
                    >
                      {openAnalysis[resume.id]
                        ? "Hide Analysis ▲"
                        : "View Analysis ▼"}
                    </button>

                    {openAnalysis[resume.id] && (
                      <AIAnalysisViewer data={analysis[resume.id]} />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error */}

      {error && (
        <div className="p-3 rounded bg-red-100 text-red-600">{error}</div>
      )}

      {/* Success */}

      {success && (
        <div className="p-3 rounded bg-green-100 text-green-600">{success}</div>
      )}
    </div>
  );
}
