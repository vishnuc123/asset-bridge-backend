import { inject, injectable } from "inversify";
import { BaseRoute } from "../BaseRoute";
import { attachRole } from "../../../middlewares/attachRole";
import { Roles } from "../../../constants/Roles";
import { CustomRequest } from "../../../utils/CustomRequest";
import { Tokens } from "../../../constants/Tokens";
import { IkycController } from "../../interfaces/IKycController";
import { AuthMiddleWare } from "../../../middlewares/Authenticate";

@injectable()
export class KycRoutes extends BaseRoute {
    constructor(
        @inject(Tokens.kycController) private KycController: IkycController
    ) { super() }

    protected initRoute(): void {
        this.router
            .post("/upload-url",AuthMiddleWare, attachRole([Roles.investor_role, Roles.property_owner_role]), (req: CustomRequest, res, next) => this.KycController.uploadUrl(req, res, next))
            .post("/submit",AuthMiddleWare, attachRole([Roles.investor_role, Roles.property_owner_role]),(req:CustomRequest,res,next) => this.KycController.submit(req,res,next))


    }

}