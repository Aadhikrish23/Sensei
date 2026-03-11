import { QuestionLogModel } from "../models/QuestionLog.js";

type CreateQuestionInput ={
    sessionId: string;
  questionNumber: number;
  questionText: string;
  questionType: "THEORY" | "APPLIED";
  difficulty: "easy"| "medium"|"hard";
  skillTags: string[];
  roleCategory: string;
  
}
type GetQuestionInput = {
sessionId:string;
questionNumber:number;
}


async function createQuestion(data:CreateQuestionInput){

    const createquestion = await QuestionLogModel.create(data);

    return createquestion;

}

async function getQuestion(data:GetQuestionInput) {
  
  const getquestion = await QuestionLogModel.findOne({
    sessionId:data.sessionId,
    questionNumber:data.questionNumber
  });
  return getquestion;
}

async function getSessionQuestions(sessionId: string) {

  const questions = await QuestionLogModel.find({
    sessionId
  }).sort({ questionNumber: 1 });

  return questions.map((q) => ({
    questionText: q.questionText,
    skillTags: q.skillTags,
    difficulty: q.difficulty
  }));

}
async function getLatestQuestion(sessionId: string) {

  const question = await QuestionLogModel
    .findOne({ sessionId })
    .sort({ questionNumber: -1 });

  return question;

}

export default {createQuestion,getQuestion,getSessionQuestions,getLatestQuestion}