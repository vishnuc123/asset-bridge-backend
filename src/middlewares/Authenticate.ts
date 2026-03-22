import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/CustomRequest";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../constants/HttpStatusCodes";
import { container } from "../infrastructure/config/di/containers/Container";
import { IAuthService } from "../infrastructure/interfaces/AuthService.interface";
import { Tokens } from "../constants/Tokens";
import { AuthService } from "../infrastructure/service/AuthService";

export const AuthMiddleWare =  (req:CustomRequest,res:Response,next:NextFunction) => {
    const authService = container.get<AuthService>(Tokens.authService)
    try {
        let token = req.cookies.access_token;
        console.log("access token",token)
        if(!token){
            throw new AppError("refresh_token expired or not found",HttpStatusCode.UNAUTHORIZED)
        }
        const decoded = authService.verifyAccessToken(token)
        console.log("decoded",decoded)
        if(!decoded){
            throw new AppError("invalid token while verifying ,failed",HttpStatusCode.UNAUTHORIZED)
        }
        (req as any).user = decoded
        
        next()
    } catch (error) {
        next(error)
    }
}