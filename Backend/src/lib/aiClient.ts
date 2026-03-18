import axios from "axios";
import { aiLogger } from "./aiLogger.js";

const baseurl = process.env.AI_SERVICES_URL || "http://localhost:8000";

const aiClient = axios.create({
  baseURL: baseurl,
  timeout: 60000,
});

// 🔥 REQUEST INTERCEPTOR
aiClient.interceptors.request.use((config) => {
  const requestId = config.headers?.["x-request-id"] as string;
  const type = (config.headers?.["x-ai-type"] as string) || "other";

  // attach metadata
  (config as any).metadata = {
    startTime: Date.now(),
    requestId,
    type,
  };

  aiLogger.request({
    requestId,
    type: type as any,
    endpoint: config.url,
  });

  return config;
});

// 🔥 RESPONSE INTERCEPTOR
aiClient.interceptors.response.use(
  (response) => {
    const metadata = (response.config as any).metadata;

    const duration = Date.now() - metadata.startTime;

    aiLogger.response({
      requestId: metadata.requestId,
      type: metadata.type,
      duration,
      status: response.status,
    });

    return response;
  },
  (error) => {
    const config = error.config || {};
    const metadata = (config as any).metadata || {};

    const duration = metadata.startTime
      ? Date.now() - metadata.startTime
      : undefined;

    aiLogger.error({
      requestId: metadata.requestId || "unknown",
      type: metadata.type || "other",
      error: error.message,
      stack: error.stack,
      status: error.response?.status,
    });

    return Promise.reject(error);
  }
);

export default aiClient;