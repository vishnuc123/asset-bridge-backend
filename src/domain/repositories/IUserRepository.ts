import { IUserModel } from "../models/userModel";


export interface IUserRepository{
    // saveToDatabase(user:IUserModel):Promise<IUserModel>
    findByEmail(email:string):Promise<IUserModel|null>
    // update(user:IUserModel):Promise<IUserModel>
}

