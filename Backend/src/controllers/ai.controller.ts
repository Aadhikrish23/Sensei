import { Request, Response } from "express";
import aiService from "../services/ai.service.js";
 const parseJDController = async (req: Request, res: Response) => {
  try {
    const { jdId, userId } = req.body;

    const parsedJD = await aiService.parseJobDescription(jdId, userId);

    res.json(parsedJD);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "JD parsing failed" });
  }
};

 const parseResumeController = async (req: Request, res: Response) => {
  try {
    const { resumeId, userId } = req.body;

    const parsedJD = await aiService.parseResume(resumeId, userId);

    res.json(parsedJD);
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


 const matchJDResumeController = async (req: Request, res: Response) => {
  try {
  const { resumeId, jdId } = req.body;
const userId = (req as any).user.id;
    const matchedresult = await aiService.match_jd_resume(resumeId, jdId,userId);

    res.json(matchedresult);
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default {parseJDController,parseResumeController,matchJDResumeController}