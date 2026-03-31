export const Tokens = {
    // controllers
    authController : Symbol.for("AuthController"),
    adminController:Symbol.for("AdminController"),
    kycController:Symbol.for("KycController"),

    // Repostiories
    authRepository : Symbol.for("AuthRepository"),
    kycRepository:Symbol.for("KycRepository"),

    // services
    authService:Symbol.for("AuthService"),
    redisService:Symbol.for("RedisService"),
    _mailService:Symbol.for("MailService"),
    VerifyOtp:Symbol.for("VerifyOtp"),
    s3Service:Symbol.for("s3Service"),

    // userCases
    LoginUseCase:Symbol.for("LoginUseCase"),
    RegisterUseCase:Symbol.for("RegisterUseCase"),
    ConfirmRegisterUseCase:Symbol.for("ConfirmRegisterUseCase"),
    _verifyAccessUseCase:Symbol.for("VerifyAccessUseCase"),
    _GoogleLoginUseCase:Symbol.for("GoogleLoginUseCase"),
    _setRoleUseCase:Symbol.for("SetRoleUseCase"),
    _logoutUseCase:Symbol.for("LogoutUseCase"),
    _changePasswordUseCase:Symbol.for("ChangePasswordUseCase"),
    _resetPassUseCase:Symbol.for("ResetPasswordUseCase"),
    _resendOtpUseCase:Symbol.for("ResendOtpUseCase"),
    _forgotPassUseCase:Symbol.for("ForgetPasswordUseCase"),

    _kycUseCase:Symbol.for("KycUseCase"),



    // adminusecasess
    getAllUsersUseCase:Symbol.for("getAllUsersUseCase"),
    changeUserStatusUseCase:Symbol.for("changeUserStatusUseCase"),
    getAllKycUseCase:Symbol.for("getAllKycUseCase"),
    getSingleUserUsecase:Symbol.for("getSingleUserUseCase"),


    // routes
    authUserRoute:Symbol.for("authUserRoutes"),
    InvestorRoutes:Symbol.for("InvestorRoutes"),
    AdminRoutes:Symbol.for("AdminRoutes"),
    OwnerRoutes:Symbol.for("OwnerRoutes"),
    kycRoutes:Symbol.for("KycRoutes")

    




}