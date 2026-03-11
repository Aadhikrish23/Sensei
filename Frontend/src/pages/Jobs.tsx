import { useEffect, useState } from "react";
import jdApi from "../api/jd.api";

interface JobDescription {
  id: string;
  title: string;
  createdAt: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [title, setTitle] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [rawText, setRawText] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await jdApi.getAllJDs();
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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

      // reset form
      setTitle("");
      setRoleCategory("");
      setRawText("");

      await fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await jdApi.deleteJD(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
        Job Descriptions
      </h1>

      {/* Create JD */}
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

      {/* JD List */}
      <div className="p-6 rounded-lg bg-samurai-card dark:bg-ninja-card">
        <h2 className="text-lg font-semibold mb-4">
          Job Descriptions
        </h2>

        {jobs.length === 0 ? (
          <p className="text-samurai-muted dark:text-ninja-muted">
            No job descriptions created yet
          </p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex justify-between items-center"
              >
                <span>{job.title}</span>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}