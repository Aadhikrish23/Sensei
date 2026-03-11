import { useEffect, useState } from "react";
import interviewApi from "../api/interview.api";
import { InterviewSession } from "../types/interview.types";

export default function Reports() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [openReport, setOpenReport] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, any>>({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await interviewApi.getSessions();

    const completed = data.filter((s) => s.completed);

    setSessions(completed);
  };

  const toggleReport = async (sessionId: string) => {
    if (openReport === sessionId) {
      setOpenReport(null);
      return;
    }

    // load report if not already loaded
    if (!reports[sessionId]) {
      const report = await interviewApi.generateFinalReport(sessionId);

      setReports((prev) => ({
        ...prev,
        [sessionId]: report.data,
      }));
    }

    setOpenReport(sessionId);
  };

  const handleDownload = async (sessionId: string) => {
    const blob = await interviewApi.downloadReportPDF(sessionId);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `sensei-report-${sessionId}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Interview Reports</h1>

      {sessions.length === 0 ? (
        <p>No reports available</p>
      ) : (
        sessions.map((session) => {
          const report = reports[session.id];

          return (
            <div
              key={session.id}
              className="p-6 bg-samurai-card rounded space-y-4"
            >
              {/* Header */}

              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className=" font-semibold ">
                    {session.roleCategory} Interview
                  </p>

                  <p className="text-sm">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDownload(session.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded gap-2"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => toggleReport(session.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded gap-2"
                  >
                    {openReport === session.id
                      ? "Hide Report ▲"
                      : "View Report ▼"}
                  </button>
                </div>
              </div>

              {/* Collapsible Report */}

              {openReport === session.id && report && (
                <div className="p-4 bg-gray-100 rounded space-y-4">
                  <div>
                    <strong>Summary</strong>

                    <p>{report.summary}</p>
                  </div>

                  <div>
                    <strong>Strengths</strong>

                    {report.strengths?.map((s: string, i: number) => (
                      <p key={i}>• {s}</p>
                    ))}
                  </div>

                  <div>
                    <strong>Weaknesses</strong>

                    {report.weaknesses?.map((w: string, i: number) => (
                      <p key={i}>• {w}</p>
                    ))}
                  </div>

                  <div>
                    <strong>Recommendations</strong>

                    {report.recommendations?.map((r: string, i: number) => (
                      <p key={i}>• {r}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
