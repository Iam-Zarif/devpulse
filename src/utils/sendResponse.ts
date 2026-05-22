import type { Response } from "express";

type TSendResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, payload: TSendResponse<T>) => {
  const { statusCode, message, data } = payload;

  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default sendResponse;
