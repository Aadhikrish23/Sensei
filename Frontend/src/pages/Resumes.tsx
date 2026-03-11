import { useEffect, useState } from "react";
import resumeApi from "../api/resume.api";

interface Resume {
  id: string;
  title: string;
  createdAt: string;
}

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      const userdata = await resumeApi.getAllResumes();
      setResumes(userdata.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to fetch resumes");
    }
  };

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

      await fetchResumes(); // refresh list
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to fetch resumes");
    }
  };

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

  useEffect(() => {
    fetchResumes();
  }, []);

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
          <ul className="space-y-2">
            {resumes.map((resume) => (
              <li key={resume.id} className="flex justify-between items-center">
                <span>{resume.title}</span>

                <button
                  onClick={() => handleDelete(resume.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <div className="p-3 rounded bg-red-100 text-red-600">{error}</div>
      )}

      {success && (
        <div className="p-3 rounded bg-green-100 text-green-600">{success}</div>
      )}
    </div>
  );
}
