import { inject, injectable } from "inversify";
import { BaseRoute } from "./BaseRoute.js";
import { Tokens } from "../../constants/Tokens.js";
import type { UserController } from "../controllers/AuthController.js";
import type { CustomRequest } from "../../utils/CustomRequest.js";
import { attachRole } from "../../middlewares/attachRole.js";
import { Roles } from "../../constants/Roles.js";



@injectable()
export class OwnerRoutes extends BaseRoute {
    constructor(
        @inject(Tokens.authController) private authController: UserController
    ) { super() }
    protected initRoute(): void {
        this.router
            .post("/signup", attachRole(Roles.property_owner_role), (req: CustomRequest, res, next) => this.authController.register(req, res, next))
            .post('/otp/verifyOtp', attachRole(Roles.property_owner_role), (req: CustomRequest, res, next) => this.authController.verifyOtp(req, res, next))
            .post('/login', attachRole(Roles.property_owner_role), (req: CustomRequest, res, next) => this.authController.login(req, res, next))
            .post('/refresh', (req: CustomRequest, res, next) => this.authController.verifyRefreash(req, res, next))
            .post('/google-login', attachRole(Roles.property_owner_role), (req: CustomRequest, res, next) => this.authController.LoginUsingGoogle(req, res, next))
        // .get('/me',AuthMiddleWare,attachRole(Roles.investor_role),(req:CustomRequest,res,next) => this.authController.GetCurrentUser(req,res,next))
    }
}
