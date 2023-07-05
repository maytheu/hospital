import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import AppError from "../utils/AppError";
import secret from "../utils/validateEnv";

const sendErrDev = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrProd = (err: AppError, res: Response) => {
  //trusted error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    console.error(`something bad happens 🔥 message:${err.message} err: ${err}`);
    return res.status(500).json({ status: "error", message: "Something went  wrong!" });
  }
};

const mongoCastError = (err: any) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 406);
};

const mongoDupError = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate value for ${value}`;
  return new AppError(msg, 409);
};

const mongoValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const msg = `Invalid data ${errors.join(". ")}`;
  return new AppError(msg, 422);
};

/**
 * handles error response
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (secret.isDevelopment || secret.isTest) {
    sendErrDev(err, res);
  }
  if (secret.isProduction) {
    let error: any = { ...err };
    if (error.name === "CastError") error = mongoCastError(error);
    if (error.code == 11000) error = mongoDupError(error);
    if (error.name === "ValidationError") error = mongoValidationError(error);

    sendErrProd(error, res);
  }
};

export const validationError = (error: ZodError) => {
  const msg = error.issues.map(({ path, message }) => `${path[0]} - ${message}`);
  return new AppError(`Validation Error - ${msg.join(". ")}`, 422);
};

export const notFoundError = (error: string) => {
  return new AppError(`${error} not found `, 404);
};

export const unauthenticatedError = () => {  
 return new AppError("user/password not found", 401);
};
