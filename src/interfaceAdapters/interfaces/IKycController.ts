import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/CustomRequest";

export interface IkycController {
    uploadUrl(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    submit(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    getAllKyc(req: CustomRequest, res: Response, next: NextFunction): Promise<void>

}