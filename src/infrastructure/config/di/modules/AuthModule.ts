import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens.js";
import { LoginUseCase } from "../../../../Applications/use-cases/authentication/loginUseCase.js";
import {  UserController } from "../../../../interfaceAdapters/controllers/AuthController.js";
import { UserRoutes } from "../../../../interfaceAdapters/routes/AuthRoutes.js";
import { userRepository } from "../../../database/repositories/userRepository.js";

export const authModule = new ContainerModule(({bind}) =>  {
    bind(Tokens.authController).to(UserController)
    bind(Tokens.authRepository).to(userRepository)
    // bind(Tokens.authService).to()
    bind(Tokens.authUserRoute).to(UserRoutes)
    bind(Tokens.LoginUseCase).to(LoginUseCase)
})
