export interface JobDescription {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  parsedData?:string;
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

export type JDAnalysisValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, any>[]
  | Record<string, any>;

export type JDAnalysis = Record<string, JDAnalysisValue>;

export interface AnalyzeJDResponse {
  parsedData: JDAnalysis;
}