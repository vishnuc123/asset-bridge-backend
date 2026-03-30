import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/CustomRequest";
import { TRole } from "../shared/types/CommonTypes";

export const attachRole = (role: TRole | TRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const allowedRoles = Array.isArray(role) ? role : [role];
    req.role = allowedRoles[0];
    req.allowedRole = allowedRoles
    next();
  };
};