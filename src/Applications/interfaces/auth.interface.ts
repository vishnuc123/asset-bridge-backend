import type { TUserResponseDto } from "../../interfaceAdapters/dtos/user.dto.js";
import type { TRole } from "../../shared/types/CommonTypes.js";

export interface ILoginUseCase{
    login(email:string,password:string,role:TRole):Promise<{refreashToken:string,accessToken:string,user:TUserResponseDto}>
}