
import { IUserModel } from "../../../domain/models/userModel.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { UserModel, type IUserDocument } from "../models/userSchema.js";
import { BaseRepository } from "./BaseRepository.js";


// neeed to implement usermodel 

export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {
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



}