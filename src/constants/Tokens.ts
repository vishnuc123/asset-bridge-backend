export const Tokens = {
    // controllers
    authController : Symbol.for("AuthController"),

    // Repostiories
    authRepository : Symbol.for("AuthRepository"),

    // services
    authService:Symbol.for("AuthService"),
    redisService:Symbol.for("RedisService"),
    _mailService:Symbol.for("MailService"),

    // userCases
    LoginUseCase:Symbol.for("LoginUseCase"),
    RegisterUseCase:Symbol.for("RegisterUseCase"),

    // routes
    authUserRoute:Symbol.for("authUserRoutes")


}