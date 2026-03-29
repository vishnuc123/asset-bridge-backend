import { inject, injectable } from "inversify";
import { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { IChangeUserStatusUseCase } from "../../interfaces/admin.interface";
import { Tokens } from "../../../constants/Tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { MapResponse } from "../../../utils/MapResponse";

@injectable()
export class ChangerUserStatusUseCase implements IChangeUserStatusUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: IUserRepository
    ) { }
    async changeUserStatus(userid: string): Promise<{ user: TUserResponseDto; message: string; }> {
        // console.log("userid",userid);
        
        const user = await this._authRepository.findById(userid)
        if (!user) {
            throw new AppError("user not exist or not found", HttpStatusCode.NOT_FOUND)
        }
        const toggleStatus = { isBlocked: !user.isBlocked }
        const updateUser = await this._authRepository.update(userid, toggleStatus)
        if (!updateUser) {
            throw new AppError("user not updated try again", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        const mappedUser = MapResponse.MapUserResponseToDto(updateUser)
        return {
            user: mappedUser,
            message: mappedUser.isBlocked ? `${mappedUser.isBlocked} BLOCKED` : `${mappedUser.isBlocked}UNBLOCKED`
        }
    }
}