import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/CustomRequest";
import { container } from "../infrastructure/config/di/containers/Container";
import { UserRepository } from "../infrastructure/database/repositories/userRepository";
import { Tokens } from "../constants/Tokens";
import { AuthService } from "../infrastructure/service/AuthService";
import { HttpStatusCode } from "../constants/HttpStatusCodes";
import { AppError } from "../utils/AppError";
import { setAccessCookie } from "../utils/SetCookies";

export const AuthMiddleWare = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const authService = container.get<AuthService>(Tokens.authService);
    const authRepository = container.get<UserRepository>(Tokens.authRepository);

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    try {
        if (!accessToken && !refreshToken) {
            return res.status(HttpStatusCode.FORBIDDEN).json({
                message: "Not authenticated",
            });
        }

        // 🔹 1. Try access token
        if (accessToken) {
            const decoded = authService.verifyAccessToken(accessToken);

            if (decoded) {
                // const user = await authRepository.findByEmail(decoded.email);

                const user = await authRepository.findById(decoded.userId);
                
                if (!user) {
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    
                    throw new AppError("User deleted", HttpStatusCode.UNAUTHORIZED);
                }
                
                (req as any).user = {
                    userId:user._id,
                    email:user.email,
                    roles:user.roles,
                    activeRole:decoded.role
                }
                req.role = decoded.role
                
                return next();
            }
            
            // console.log("Access token expired, trying refresh...");
        }
        
        // 🔹 2. Try refresh token
        if (refreshToken) {
            const decodedRefresh = authService.verifyRefreashToken(refreshToken);
            const user = await authRepository.findById(decodedRefresh?.userId);
            
            if (!decodedRefresh) {
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");

                return res.status(HttpStatusCode.FORBIDDEN).json({
                    message: "Session expired",
                });
            }

            const { userId, role, email } = decodedRefresh;

           
            const newAccessToken = authService.generateAccessToken(
                userId,
                role,
                email
            );

            setAccessCookie(newAccessToken, res);

            const newDecoded = authService.verifyAccessToken(newAccessToken);

            if (!newDecoded) {
                throw new AppError("Token regeneration failed", HttpStatusCode.UNAUTHORIZED);
            }

            (req as any).user = {
                    userId:user?._id,
                    email:user?.email,
                    roles:user?.roles,
                    activeRole:newDecoded.role
                }
            req.role = newDecoded.role
;

            return next();
        }

        // 🔹 fallback
        return res.status(HttpStatusCode.FORBIDDEN).json({
            message: "Authentication failed",
        });

    } catch (error) {
        console.error("Auth middleware error:", error);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        next(
            error instanceof AppError
                ? error
                : new AppError(
                    "Your session has expired. Please sign in again.",
                    HttpStatusCode.UNAUTHORIZED
                )
        );
    }
};