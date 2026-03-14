import type { IUserModel } from "../models/IUserModel.js";

export interface IUserRepository{
    saveToDatabase(user:IUserModel):Promise<IUserModel>
    findByEmail(email:string):Promise<IUserModel>|null
    findById(id:string):Promise<IUserModel>|null
    update(user:IUserModel):Promise<IUserModel>
}

