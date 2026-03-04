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

export default {parseJDController}