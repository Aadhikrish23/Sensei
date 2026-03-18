import { Request, Response } from "express";
import aiService from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 const parseJDController =asyncHandler( async (req: Request, res: Response) => {
  
    const { jdId, userId } = req.body;

    const parsedJD = await aiService.parseJobDescription(jdId, userId, req.requestId);

    res.json(parsedJD);
  
});

 const parseResumeController =asyncHandler( async (req: Request, res: Response) => {
 
    const { resumeId, userId } = req.body;

    const parsedJD = await aiService.parseResume(resumeId, userId, req.requestId);

    res.json(parsedJD);
  
});


 const matchJDResumeController = asyncHandler(async (req: Request, res: Response) => {
  
  const { resumeId, jdId } = req.body;
const userId = (req as any).user.id;
    const matchedresult = await aiService.match_jd_resume(resumeId, jdId,userId, req.requestId);

    res.json(matchedresult);
  
});

export default {parseJDController,parseResumeController,matchJDResumeController}