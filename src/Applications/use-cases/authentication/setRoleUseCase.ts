import { inject, injectable } from "inversify";
import { TRole } from "../../../shared/types/CommonTypes";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Tokens } from "../../../constants/Tokens";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface";
import { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { MapResponse } from "../../../utils/MapResponse";

@injectable()
export class SetRoleUsecase {
    constructor(
        @inject(Tokens.authRepository) private _userRepository: IUserRepository,
        @inject(Tokens.authService) private _authService: IAuthService,


    ) { }
    async setRole(userid: string, selectedRole: TRole): Promise<{ accessToken: string, refreashToken: string ,user:TUserResponseDto}> {
        console.log(userid)
        const user = await this._userRepository.findById(userid)
        console.log("backend setrole",user)
        if (!user?.roles.includes(selectedRole)) {
            throw new AppError("invalid role not acccessible", HttpStatusCode.FORBIDDEN)
        }

        const accesstoken = this._authService.generateAccessToken(user._id.toString(),selectedRole,user.email)
        const refreashToken = this._authService.generateRefreashToken(user._id.toString(),selectedRole,user.email)
        const mapped = MapResponse.MapUserResponseToDto(user)
        console.log("mappeduser setrole",mapped);
        
        return {
            accessToken: accesstoken,
            refreashToken:refreashToken,
            user:mapped
        }
    }
}