import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/CustomRequest";
import { TRole } from "../shared/types/CommonTypes";

export const attachRole = (role: TRole) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    req.role = role;
    next();
  };
};