import { inject, injectable } from "inversify";
import { BaseRoute } from "./BaseRoute.js";
import { Tokens } from "../../constants/Tokens.js";


@injectable
export class UserRoutes extends BaseRoute{
    constructor(
        @inject(Tokens.authUserRoute) 
        private authController : 
    ){}
    protected initRoute(): void {
        
    }
}
