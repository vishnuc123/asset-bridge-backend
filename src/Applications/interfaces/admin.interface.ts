import { TUserDataDto, TUserResponseDto } from "../../interfaceAdapters/dtos/user.dto";
import { TRole } from "../../shared/types/CommonTypes";

export interface IGetAllUserDataUseCase {
    GetAllUseDetails(page: number, limit: number, role: TRole, search?: string, sortField?: string, sortOrder?: string): Promise<{users:TUserResponseDto[],TotalData:number}>
}
export interface IChangeUserStatusUseCase{
    changeUserStatus(userid:string):Promise<{user:TUserResponseDto,message:string}>;
}