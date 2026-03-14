import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";

export class userRepository implements IUserRepository{
    saveToDatabase(user: IUserModel): Promise<IUserModel> {
        
    }
    findByEmail(email: string): Promise<IUserModel> | null {
        
    }
    findById(id: string): Promise<IUserModel> | null {
        
    }

    update(user: IUserModel): Promise<IUserModel> {
        
    }
}