import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens";
import { KycController } from "../../../../interfaceAdapters/controllers/KycController";
import { KycRoutes } from "../../../../interfaceAdapters/routes/kyc/KycRoutes";
import { KycUseCase } from "../../../../Applications/use-cases/kyc/KycUseCase";
import { KycRepository } from "../../../database/repositories/KycRepository";

export const Kycmodule = new ContainerModule(({bind}) => {
    bind(Tokens.kycController).to(KycController)
    bind(Tokens.kycRoutes).to(KycRoutes)
    bind(Tokens._kycUseCase).to(KycUseCase)
    bind(Tokens.kycRepository).to(KycRepository)
})