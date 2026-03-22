import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/CustomRequest";
import { HttpStatusCode } from "../constants/HttpStatusCodes";
import { container } from "../infrastructure/config/di/containers/Container";
import { AuthService } from "../infrastructure/service/AuthService";
import { Tokens } from "../constants/Tokens";
import { setAccessCookie } from "../utils/SetCookies";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/Logger";

export const AuthMiddleWare = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const authService = container.get<AuthService>(Tokens.authService);

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    try {
        if (!accessToken && !refreshToken) {
            return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Not authenticated" });
        }

        if (accessToken) {
            const decoded = authService.verifyAccessToken(accessToken);

            if (decoded) {
                (req as any).user = decoded;
                return next();
            }

            console.log("Access token invalid or expired, trying refresh...");
        }

        if (refreshToken) {
            const decodedRefresh = authService.verifyRefreashToken(refreshToken);

            if (!decodedRefresh) {
                // res.clearCookie("access_token");
                // res.clearCookie("refresh_token");

                 return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Session expired" });
                // return next();
            }
            const { userId, email, role } = decodedRefresh

            const newAccessToken = await authService.generateAccessToken(
                userId, email, role
            );

            setAccessCookie(newAccessToken, res);

            const newDecoded = authService.verifyAccessToken(newAccessToken);

            (req as any).user = newDecoded!;

            console.log("Access token refreshed");

            return next();
        }
        console.log("Access token refreshed successfully", { Id: req.user?.userid, email: req.user?.email, role: req.user?.role });
        
        logger.info("Access token refreshed successfully",);
        return next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        next(error instanceof AppError ? error : new AppError("Your session has expired. Please sign in again.", HttpStatusCode.UNAUTHORIZED));
    }
};