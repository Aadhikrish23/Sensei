import apiClient from "./axios";
import {
  CreateJDRequest,
  CreateJDResponse,
  GetJDsResponse
} from "../types/jd.types";

const createJD = async (payload: CreateJDRequest): Promise<CreateJDResponse> => {
  const response = await apiClient.post("/jd/upload", payload);
  return response.data;
};

const getAllJDs = async (): Promise<GetJDsResponse> => {
  const response = await apiClient.get("/jd");
  return response.data;
};

const deleteJD = async (id: string) => {
  const response = await apiClient.delete(`/jd/${id}`);
  return response.data;
};

const updateJD = async (id: string, payload: CreateJDRequest) => {
  const response = await apiClient.patch(`/jd/${id}`, payload);
  return response.data;
};

export default {
  createJD,
  getAllJDs,
  deleteJD,
  updateJD
};