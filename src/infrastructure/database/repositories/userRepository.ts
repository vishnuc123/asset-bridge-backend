
import mongoose, { Mongoose, QueryFilter, QueryOptions } from "mongoose";
import { IUserModel } from "../../../domain/models/userModel.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { UserModel, type IUserDocument } from "../models/userSchema.js";
import { BaseRepository } from "./BaseRepository.js";
import { injectable } from "inversify"
import { TRole } from "../../../shared/types/CommonTypes.js";
import { Filter } from "mongodb";


// neeed to implement usermodel 
@injectable()
export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(UserModel)
    }
    // saveToDatabase(user: IUserModel): Promise<IUserModel> {
    //     const newUser = await this.findById(u)
    // }
    async findByEmail(email: string): Promise<IUserModel | null> {
        const data = await this.findOne({ email }).exec()
        return data
    }
    async findAllUser(page: number, limit: number, role: TRole, search: string, sortField?: string, sortOrder?: string): Promise<{ users: IUserModel[] | null, total: number }> {
        const skip = (page - 1) * limit
        const sortDirection = sortOrder === "descending" ? -1 : 1;
        const filter: QueryFilter<IUserDocument> = {}
        if (search) {
            const searchRegex = new RegExp("^" + search, "i")
            filter.$or = [
                { firstname: searchRegex },
                { email: searchRegex }
            ]
        }
        const result = this.find(filter)
        const total = await this.model.countDocuments(filter)
        const user = await result.skip(skip).limit(limit).sort({ [sortField as string]: sortDirection }).lean<IUserModel[]>()
        return { users: user, total: total }
    }



}