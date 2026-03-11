import { ResumeAnalysis } from "../types/resumes.types";

interface AIAnalysisViewerProps {
  data: ResumeAnalysis;
}

export default function AIAnalysisViewer({ data }: AIAnalysisViewerProps) {
  return (
    <div className="mt-3 p-4 rounded bg-gray-100 dark:bg-gray-800 space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="font-semibold mb-2 capitalize">{key}</h4>

          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item: any, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm rounded bg-samurai-primary text-white"
                >
                  {typeof item === "object"
                    ? Object.values(item).join(" - ")
                    : item}
                </span>
              ))}
            </div>
          ) : (
            <p>{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}