import { Request, Response, NextFunction } from "express";
import resumeService from "../services/resume.service.js";
import { renameResumeSchema, resumeIdParamSchema } from "../validations/resume.validation.js";

const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw Error("No resume file uploaded");
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    const resumedata = await resumeService.uploadResumeService({
      userId,
      filePath: req.file.path,
      title: req.file.originalname,
    });
    return res.status(201).json({
      message: "Resume uploaded successfully",
      data: {
        id: resumedata.id,
        title: resumedata.title,
        createdAt: resumedata.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    resumeIdParamSchema.parse(req.params);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await resumeService.deleteResumeService(
      req.params.id as string,
      req.user.id
    );

    return res.status(200).json({
      message: "Resume deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
const getResumeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    resumeIdParamSchema.parse(req.params);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resume = await resumeService.getUserResumeById(
      req.user.id,
      req.params.id as string
    );

    return res.status(200).json({
      data: resume,
    });

  } catch (error) {
    next(error);
  }
};

const getResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumes = await resumeService.getUserResumes(req.user.id);

    return res.status(200).json({
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

const renameResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    resumeIdParamSchema.parse(req.params);
    renameResumeSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await resumeService.renameResume(
      req.params.id as string, 
      req.user.id,
      req.body.title,
    );

    return res.status(200).json({
      message: "Resume renamed successfully",
      data: updated,
    });

  } catch (error) {
    next(error);
  }
};
export default { uploadResume, deleteResume ,getResumes,renameResume,getResumeById};
