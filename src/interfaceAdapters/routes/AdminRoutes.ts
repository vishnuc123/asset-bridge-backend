import { inject, injectable } from "inversify";
import { UserModel } from "../../infrastructure/database/models/userSchema";
import { BaseRoute } from "./BaseRoute";
import { Tokens } from "../../constants/Tokens";
import { IAuthController } from "../interfaces/IAuthController";
import { attachRole } from "../../middlewares/attachRole";
import { Roles } from "../../constants/Roles";
import { CustomRequest } from "../../utils/CustomRequest";
import { AuthMiddleWare } from "../../middlewares/Authenticate";
import { IAdminController } from "../interfaces/IAdminController";
import { IkycController } from "../interfaces/IKycController";

@injectable()
export class AdminRoutes extends BaseRoute {
    constructor(
        @inject(Tokens.authController) private _authController: IAuthController,
        @inject(Tokens.adminController) private _admincontroller: IAdminController,
        @inject(Tokens.kycController) private kycController: IkycController
    ) {
        super()
    }
    protected initRoute(): void {
        this.router
            .post('/login', attachRole(Roles.admin_role), (req: CustomRequest, res, next) => this._authController.login(req, res, next))
            .post("/changeUserStatus", AuthMiddleWare, attachRole(Roles.admin_role), (req: CustomRequest, res, next) => this._admincontroller.ChangerUserStatus(req, res, next))
            .get('/get_all_users', AuthMiddleWare, attachRole(Roles.admin_role), (req: CustomRequest, res, next) => this._admincontroller.getAllUserDetails(req, res, next))
            .get("/get_all_kyc", attachRole(Roles.admin_role), (req: CustomRequest, res, next) => this.kycController.getAllKyc(req, res, next))
            .get("/kyc/user/:userId", attachRole(Roles.admin_role), (req: CustomRequest, res, next) => this._admincontroller.getUserDetails(req, res, next))


    }

}