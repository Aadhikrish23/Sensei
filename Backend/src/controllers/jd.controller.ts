import { Request, Response, NextFunction } from "express";
import jdService from "../services/jd.service.js";
import {
  createJDSchema,
  updateJDSchema,
} from "../validations/jd.validation.js";

const uploadJD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const verifiedData = createJDSchema.parse(req.body);
        if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    const jdData = await jdService.createJD(
        userId,
      verifiedData.title,
      verifiedData.rawText,
      verifiedData.roleCategory as string,
    );

    return res.status(201).json({
      
      data: {
        id: jdData.id,
        title: jdData.title,
        createdAt: jdData.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserJDs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const jdData = await jdService.getUserJDs(userId);
    return res.status(200).json({ data: jdData });
  } catch (error) {
    next(error);
  }
};
const getJDById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const jdid = req.params.id;
    if (!jdid || typeof jdid !== "string" || jdid.trim() === "") {
      return res.status(400).json({ message: "Invalid JD" });
    }
    const jdData = await jdService.getJDById(userId, jdid);
    return res.status(200).json({ data: jdData });
  } catch (error) {
    next(error);
  }
};
const updateJD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const jdid = req.params.id;
    const verifiedData = updateJDSchema.parse(req.body);
    if (!jdid || typeof jdid !== "string" || jdid.trim() === "") {
      return res.status(400).json({ message: "Invalid JD" });
    }

    const jdData = await jdService.updateJD(userId, jdid, verifiedData);

    return res.status(200).json({ data: jdData });
  } catch (error) {
    next(error);
  }
};
const deleteJD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const jdid = req.params.id;
    if (!jdid || typeof jdid !== "string" || jdid.trim() === "") {
      return res.status(400).json({ message: "Invalid JD" });
    }
     await jdService.deleteJD(userId,jdid);
     return res.status(200).json({
      message: "JD deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {uploadJD,getJDById,getUserJDs,updateJD,deleteJD}