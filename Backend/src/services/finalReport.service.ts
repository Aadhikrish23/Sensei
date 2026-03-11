import aiClient from "../lib/aiClient.js";
import prisma from "../lib/prisma.js";

const generateFinalReport = async (sessionId: string) => {
  // 1️⃣ Get interview session
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      resume: true,
      jobDescription: true,
      sessionSummary: true,
      
    },
  });

  if (!session) {
    throw new Error("Interview session not found");
  }
  if(session.finalReport){
    return  session.finalReport;
  }
  // 2️⃣ Extract required data
  const payload = {
    sessionSummary: session.sessionSummary,
    resumeSkills: (session.resume?.parsedData as any)?.skills || [],
    jdSkills: (session.jobDescription?.parsedData as any)?.skills || [],
  };

  const response = await aiClient.post("/final-report", payload);

  // 3️⃣ Call AI service
  const aiReport = response.data;

  // 4️⃣ Save report
  const updatedSession = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      finalReport: aiReport,
      reportGeneratedAt: new Date(),
    },
  });

  return aiReport;
};


export default {generateFinalReport}