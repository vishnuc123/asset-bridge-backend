import { inject, injectable } from "inversify";
import { TCreateUserDto, TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { IConfirmRegisterUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

@injectable()
export class ConfirmRegisterUseCase implements IConfirmRegisterUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: IUserRepository
    ) { }

    async ConfirmRegister(userData: TCreateUserDto): Promise<{ userId: string, message: string }> {
        const existingUser = await this._authRepository.findByEmail(userData.email)
        const role = userData.roles[0]

        console.log("existing user", existingUser)


        let user;
        if (!existingUser) {
            user = await this._authRepository.create({
                ...userData,
                emailVerified: true,
                status: "active",
                isBlocked: false,

            })
        } else {

            if (!role) {
                throw new AppError("Role is required", HttpStatusCode.BAD_REQUEST);
            }
            if (existingUser.roles.includes(role)) {
                throw new AppError("user already Exist", HttpStatusCode.CONFLICT)
            }
            const updatedRoles = [...existingUser.roles, role];

            await this._authRepository.update(existingUser._id.toString(), {
                roles: updatedRoles
            });

            user = existingUser;
        }



        if (!user || !user._id) {
            throw new AppError("user creating failed", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        await Promise.all([
            // create wallet

        ])
        return {
            userId: user._id.toString(),
            message: "register successfully"
        }
    }
}