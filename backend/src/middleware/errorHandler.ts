import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("[Error]", err.message);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      sendError(res, "Record not found", 404);
      return;
    }
    if (err.code === "P2002") {
      sendError(res, "A record with this value already exists", 409);
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, "Invalid data provided", 400);
    return;
  }

  sendError(res, err.message || "Internal server error", 500);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, "Route not found", 404);
};
