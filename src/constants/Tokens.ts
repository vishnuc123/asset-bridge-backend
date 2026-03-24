export const Tokens = {
    // controllers
    authController : Symbol.for("AuthController"),
    adminController:Symbol.for("AdminController"),

    // Repostiories
    authRepository : Symbol.for("AuthRepository"),

    // services
    authService:Symbol.for("AuthService"),
    redisService:Symbol.for("RedisService"),
    _mailService:Symbol.for("MailService"),
    VerifyOtp:Symbol.for("VerifyOtp"),

    // userCases
    LoginUseCase:Symbol.for("LoginUseCase"),
    RegisterUseCase:Symbol.for("RegisterUseCase"),
    ConfirmRegisterUseCase:Symbol.for("ConfirmRegisterUseCase"),
    _verifyAccessUseCase:Symbol.for("VerifyAccessUseCase"),
    _GoogleLoginUseCase:Symbol.for("GoogleLoginUseCase"),
    _setRoleUseCase:Symbol.for("SetRoleUseCase"),


    // adminusecasess
    getAllUsersUseCase:Symbol.for("getAllUsersUseCase"),
    changeUserStatusUseCase:Symbol.for("changeUserStatusUseCase"),


    // routes
    authUserRoute:Symbol.for("authUserRoutes"),
    InvestorRoutes:Symbol.for("InvestorRoutes"),
    AdminRoutes:Symbol.for("AdminRoutes")

    




}