import type { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../utils/CustomRequest";

export interface IAuthController{
    register(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    verifyOtp(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    login(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    verifyRefreash(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    LoginUsingGoogle(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    setRole(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
    logout(req:CustomRequest,res:Response,next:NextFunction):Promise<void>
}