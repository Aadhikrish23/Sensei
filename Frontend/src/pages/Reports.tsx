import { useEffect, useState } from "react";
import interviewApi from "../api/interview.api";
import { InterviewSession } from "../types/interview.types";

import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

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

    if (!reports[sessionId]) {
      const toastId = toast.loading("Generating Report...");

      const report = await interviewApi.generateFinalReport(sessionId);
      toast.success("Analysis completed", { id: toastId });

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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-samurai-text dark:text-ninja-text">
          Interview Reports
        </h1>

        <p className="text-samurai-muted dark:text-ninja-muted">
          Review your AI interview performance
        </p>
      </div>

      {/* EMPTY STATE */}

      {sessions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No interview reports yet"
          description="Complete an interview session to generate your first report."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const report = reports[session.id];

            return (
              <Card key={session.id}>
                {/* HEADER */}

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold text-samurai-text dark:text-white">
                      {session.roleCategory} Interview
                    </p>

                    <p className="text-sm text-samurai-muted dark:text-ninja-muted">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(session.id)}
                      className="
                      flex items-center gap-1
                      px-3 py-1
                      text-sm
                      bg-indigo-600
                      hover:bg-indigo-700
                      text-white
                      rounded
                      "
                    >
                      <Download size={14} />
                      PDF
                    </button>

                    <button
                      onClick={() => toggleReport(session.id)}
                      className="
                      flex items-center gap-1
                      px-3 py-1
                      text-sm
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      rounded
                      "
                    >
                      {openReport === session.id ? (
                        <>
                          <ChevronUp size={14} />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          View
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* REPORT CONTENT */}

                {openReport === session.id && report && (
                  <div className="space-y-4">
                    {/* SUMMARY */}

                    <div>
                      <p className="font-semibold mb-1">Summary</p>

                      <p className="text-sm text-samurai-muted dark:text-ninja-muted">
                        {report.summary}
                      </p>
                    </div>

                    {/* STRENGTHS */}

                    <div>
                      <p className="font-semibold mb-2">Strengths</p>

                      <div className="flex flex-wrap gap-2">
                        {report.strengths?.map((s: string, i: number) => (
                          <span
                            key={i}
                            className="
                            px-3 py-1
                            text-xs
                            rounded
                            bg-green-600/20
                            text-green-400
                            "
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* WEAKNESSES */}

                    <div>
                      <p className="font-semibold mb-2">Weaknesses</p>

                      <div className="flex flex-wrap gap-2">
                        {report.weaknesses?.map((w: string, i: number) => (
                          <span
                            key={i}
                            className="
                            px-3 py-1
                            text-xs
                            rounded
                            bg-red-600/20
                            text-red-400
                            "
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RECOMMENDATIONS */}

                    <div>
                      <p className="font-semibold mb-2">Recommendations</p>

                      <ul className="text-sm text-samurai-muted dark:text-ninja-muted space-y-1">
                        {report.recommendations?.map((r: string, i: number) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
