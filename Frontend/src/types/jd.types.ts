export interface JobDescription {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJDRequest {
  title: string;
  rawText: string;
  roleCategory?: string;
}

export interface GetJDsResponse {
  data: JobDescription[];
}

export interface CreateJDResponse {
  data: JobDescription;
}