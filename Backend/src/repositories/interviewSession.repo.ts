import prisma from "../lib/prisma.js";

 async function updateSkillGraph(sessionId: string, skillGraph: any) {
    return prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        skillGraph
      }
    });
  }

  async function incrementQuestionCount(sessionId: string) {
    return prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        totalQuestions: {
          increment: 1
        }
      }
    });
  }

  async function completeInterview(sessionId: string, decision: string) {
    return prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        decision
      }
    });
  }

  export default {updateSkillGraph,incrementQuestionCount,completeInterview  }