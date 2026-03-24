import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens";
import { InvestorRoutes } from "../../../../interfaceAdapters/routes/InvestorRoutes";

export const InvestorModule = new ContainerModule(({bind}) => {
    bind(Tokens.InvestorRoutes).to(InvestorRoutes)
})