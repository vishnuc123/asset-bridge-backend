export const Tokens = {
    // controllers
    authController : Symbol.for("AuthController"),

    // Repostiories
    authRepository : Symbol.for("AuthRepository"),

    // services
    authService:Symbol.for("AuthService"),

    // userCases
    LoginUseCase:Symbol.for("LoginUseCase"),
    RegisterUseCase:Symbol.for("RegisterUseCase"),

    // routes
    authUserRoute:Symbol.for("authUserRoutes")


}