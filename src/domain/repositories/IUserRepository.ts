import { TRole } from "../../shared/types/CommonTypes";
import { IUserModel } from "../models/userModel";
import { IBaseRepository } from "./IBaseRepository";


export interface IUserRepository extends IBaseRepository<IUserModel>{
    // saveToDatabase(user:IUserModel):Promise<IUserModel>
    findByEmail(email:string):Promise<IUserModel|null>
    findAllUser(page:number,limit:number,role:TRole,search:string,sortField?:string,sortOrder?:string):Promise<{users:IUserModel[]|null,total:number}>
    // update(user:IUserModel):Promise<IUserModel>

}

