import type { IUserModel } from "../models/userModel.interface.js"


export interface IUserRepository{
    // saveToDatabase(user:IUserModel):Promise<IUserModel>
    findByEmail(email:string):Promise<IUserModel|null>
    // update(user:IUserModel):Promise<IUserModel>
}

