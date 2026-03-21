import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens.js";
import {  UserController } from "../../../../interfaceAdapters/controllers/AuthController.js";
import { UserRoutes } from "../../../../interfaceAdapters/routes/AuthRoutes.js";
import { userRepository } from "../../../database/repositories/userRepository.js";
import { RegisterUseCase } from "../../../../Applications/use-cases/authentication/registerUseCase.js";
import { AuthService } from "../../../service/AuthService.js";
import { RedisService } from "../../../service/RedisService.js";
import { MailService } from "../../../service/MailService.js";
import { VerifyOtpUseCase } from "../../../../Applications/use-cases/authentication/VerifyOtpUseCase.js";
import { ConfirmRegisterUseCase } from "../../../../Applications/use-cases/authentication/confirmRegisterUseCase.js";
import { LoginUseCase } from "../../../../Applications/use-cases/authentication/loginUseCase.js";
import { VerifyAccessUseCase } from "../../../../Applications/use-cases/authentication/VerifyAccessUseCase.js";

export const authModule = new ContainerModule(({bind}) =>  {
    bind(Tokens.authController).to(UserController)
    bind(Tokens.authRepository).to(userRepository)
    bind(Tokens.authService).to(AuthService)
    bind(Tokens.authUserRoute).to(UserRoutes)
    bind(Tokens.redisService).to(RedisService)
    bind(Tokens._mailService).to(MailService)
    bind(Tokens.VerifyOtp).to(VerifyOtpUseCase)

    bind(Tokens.LoginUseCase).to(LoginUseCase)
    bind(Tokens.RegisterUseCase).to(RegisterUseCase)
    bind(Tokens.ConfirmRegisterUseCase).to(ConfirmRegisterUseCase)
    bind(Tokens._verifyAccessUseCase).to(VerifyAccessUseCase)
})
