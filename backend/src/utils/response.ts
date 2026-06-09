import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = { success: true, data, message, meta };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500
): Response => {
  const response: ApiResponse = { success: false, error };
  return res.status(statusCode).json(response);
};
