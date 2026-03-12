import { Request, Response } from "express";
import resumeService from "../services/resume.service.js";
import { renameResumeSchema, resumeIdParamSchema } from "../validations/resume.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
const uploadResume = asyncHandler( async (
  req: Request,
  res: Response,
  
) => {
 
    if (!req.file) {
      throw new AppError("No resume file uploaded",400);
    }
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
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
  
});
const deleteResume = asyncHandler(async (
  req: Request,
  res: Response,
  
) => {
  
    resumeIdParamSchema.parse(req.params);

    if (!req.user) {
     throw new AppError( "Unauthorized" ,401);
    }

    await resumeService.deleteResumeService(
      req.params.id as string,
      req.user.id
    );

    return res.status(200).json({
      message: "Resume deleted successfully",
    });

  
});
const getResumeById = asyncHandler(async (
  req: Request,
  res: Response,
  
) => {
 
    resumeIdParamSchema.parse(req.params);

    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }

    const resume = await resumeService.getUserResumeById(
      req.user.id,
      req.params.id as string
    );

    return res.status(200).json({
      data: resume,
    });

  
});

const getResumes = asyncHandler( async (req: Request, res: Response, ) => {
  
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }

    const resumes = await resumeService.getUserResumes(req.user.id);

    return res.status(200).json({
      data: resumes,
    });

});

const renameResume =asyncHandler( async (
  req: Request,
  res: Response,
  
) => {
 
    resumeIdParamSchema.parse(req.params);
    renameResumeSchema.parse(req.body);

    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
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

 
});
export default { uploadResume, deleteResume ,getResumes,renameResume,getResumeById};
