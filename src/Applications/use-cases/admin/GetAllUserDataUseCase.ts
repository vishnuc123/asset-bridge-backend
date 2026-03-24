import { inject, injectable } from "inversify";
import { IGetAllUserDataUseCase } from "../../interfaces/admin.interface";
import { Tokens } from "../../../constants/Tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TRole } from "../../../shared/types/CommonTypes";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { MapResponse } from "../../../utils/MapResponse";
import { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";

@injectable()
export class GetAllUserDataUseCase implements IGetAllUserDataUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: IUserRepository
    ) { }
    async GetAllUseDetails(page: number, limit: number, role: TRole, search?: string, sortField?: string, sortOrder?: string): Promise<{ users: TUserResponseDto[]; TotalData: number; }> {
        const { users, total } = await this._authRepository.findAllUser(page, limit, role, search as string, sortField, sortOrder)
        // console.log(users,total)
        if (!users || !total) {
            throw new AppError("no users found", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }
        const mappeduser = users.map(MapResponse.MapUserResponseToDto)
        return { users: mappeduser, TotalData: total }
    }
}