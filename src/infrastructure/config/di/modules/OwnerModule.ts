import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens";
import { OwnerRoutes } from "../../../../interfaceAdapters/routes/OwnerRoutes";

export const OwnerModule = new  ContainerModule(({bind}) => {
    bind(Tokens.OwnerRoutes).to(OwnerRoutes)
})