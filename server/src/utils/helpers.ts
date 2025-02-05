import { CustomError } from "../middlewares/error.middleware";

export const throwError = (
  message: string | any,
  statusCode?: number
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode || 500;
  return error;
};

export const generateUniqueRoomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
