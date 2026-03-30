import { Container } from "inversify";
import { authModule } from "../modules/AuthModule.js";
import { AdminModule } from "../modules/AdminModule.js";
import { InvestorModule } from "../modules/InvestorModule.js";
import { OwnerModule } from "../modules/OwnerModule.js";
import { Kycmodule } from "../modules/kycModule.js";

export const container  = new Container()
container.load(
    authModule,AdminModule,InvestorModule,OwnerModule,Kycmodule
)

