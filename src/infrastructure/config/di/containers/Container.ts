import { Container } from "inversify";
import { authModule } from "../modules/AuthModule.js";

export const container  = new Container()
container.load(
    authModule,
)

