import type { Response } from "express";
import { HttpStatusCode } from "../constants/HttpStatusCodes.js";

export class ResponseHandler {
    static success(
        res: Response,
        message: string,
        data: unknown = null,
        statusCode: number = HttpStatusCode.OK,
        meta: Record<string, unknown> | null = null
    ): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            meta,
            statusCode
        });
    }
}