import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/CustomRequest";

export interface IAdminController {
    getAllUserDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    ChangerUserStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    getUserDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void>

}