import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../constants/HttpStatusCodes";
import { logger } from "../utils/Logger";
import { AppError } from "../utils/AppError";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error(`Error Message:, ${ err.message }`);
    console.log('Error stack: ', err.stack);

    const status = err instanceof AppError ? err.statusCode : HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
        success: false,
        message,
        statusCode: status
    });
}