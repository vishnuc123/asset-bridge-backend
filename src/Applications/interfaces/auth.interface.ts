import type { TCreateUserDto, TUserResponseDto } from "../../interfaceAdapters/dtos/user.dto.js";
import type { TOtpData, TRole } from "../../shared/types/CommonTypes.js";

export interface ILoginUseCase {
    login(email: string, password: string, role: TRole): Promise<{ refreashToken: string, accessToken: string, user: TUserResponseDto }>
}
export interface IRegisterUseCase {
    Regiser(userData: TCreateUserDto): Promise<{ userId: string, message: string }>
}
export interface IVerifyOtpUseCase {
    VerifyOtp(userId: string, opt: string, purpose: "signup" | "reset"): Promise<{ message: string, data: TOtpData }>
}
export interface IConfirmRegisterUseCase {
    ConfirmRegister(userData: TCreateUserDto): Promise<{ userId: string, message: string }>
}

export interface IVerifyAccessUseCase {
    executeToken(refreashToken: string): Promise<{ accessToken: string }>
}
export interface IGoogleLoginUseCase {
    GoogleLogin(googleToken: string, role: TRole): Promise<{ accessToken: string, refreshToken: string, user: TUserResponseDto }>
}
export interface ILogoutUseCases {
    logout(accessToken: string, refreshToken: string): Promise<{ message: string }>
}