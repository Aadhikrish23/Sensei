export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UploadResumeResponse {
  message: string;
  data: Resume;
}

export interface GetResumesResponse {
  data: Resume[];
}

export interface DeleteResumeResponse {
  message: string;
}

export interface RenameResumeResponse {
  message: string;
  data: {
    id: string;
    title: string;
    updatedAt: string;
  };
}