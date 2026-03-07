import { QuestionLogModel } from "../models/QuestionLog.js";

type CreateQuestionInput ={
    sessionId: string;
  questionNumber: number;
  questionText: string;
  questionType: "THEORY" | "APPLIED";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  skillTags: string[];
  roleCategory: string;
  
}


async function createQuestion(data:CreateQuestionInput){

    const createquestion = await QuestionLogModel.create(data);

    return createquestion;

}



export default {createQuestion}