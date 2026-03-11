import apiClient from "./axios";
import {
  UploadResumeResponse,
  GetResumesResponse,
  DeleteResumeResponse,
  RenameResumeResponse,
} from "../types/resumes.types";

const uploadResume = async (formData: FormData): Promise<UploadResumeResponse> => {
  const resumeData = await apiClient.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resumeData.data;
};
const getAllResumes = async (): Promise<GetResumesResponse> => {
  const response = await apiClient.get("/resumes");

  return response.data;
};

const deleteResume = async (id: string): Promise<DeleteResumeResponse> => {
  const response = await apiClient.delete(`/resumes/${id}`);

  return response.data;
};

const renameResume = async (
  id: string,
  title: string
): Promise<RenameResumeResponse> => {
  const response = await apiClient.patch(`/resumes/${id}`, {
    title,
  });

  return response.data;
};

export default {
  uploadResume,
  getAllResumes,
  deleteResume,
  renameResume,
};