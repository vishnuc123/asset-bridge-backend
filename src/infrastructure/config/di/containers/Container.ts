import { Container } from "inversify";
import { authModule } from "../modules/AuthModule.js";
import { AdminModule } from "../modules/AdminModule.js";
import { InvestorModule } from "../modules/InvestorModule.js";

export const container  = new Container()
container.load(
    authModule,AdminModule,InvestorModule
)

