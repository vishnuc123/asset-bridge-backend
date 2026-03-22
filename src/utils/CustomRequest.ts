import type { Request } from "express";
import type { TRole } from "../shared/types/CommonTypes.js";

export interface CustomRequest extends Request{
    role?:TRole,
    user?:{
        userid:string,
        role:string,
        email:string
        // role?:TRole;
    }|null
}