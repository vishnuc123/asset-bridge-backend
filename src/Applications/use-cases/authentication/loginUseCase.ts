// import { inject, injectable } from "inversify";
// import type { ILoginUseCase } from "../../interfaces/auth.interface.js";
// import { Tokens } from "../../../constants/Tokens.js";
// import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
// import type { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto.js";
// import type { TRole } from "../../../shared/types/CommonTypes.js";

// @injectable()
// export class LoginUseCase implements ILoginUseCase {
//     constructor(
//         @inject(Tokens.authRepository) private _userRepository: IUserRepository
//     ) { }
//     login(email: string, password: string, role: TRole): Promise<{ refreashToken: string; accessToken: string; user: TUserResponseDto; }> {

//     }
// }