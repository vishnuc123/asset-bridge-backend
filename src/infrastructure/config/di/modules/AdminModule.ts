import { ContainerModule } from "inversify";
import { Tokens } from "../../../../constants/Tokens";
import { AdminRoutes } from "../../../../interfaceAdapters/routes/AdminRoutes";
import { AdminController } from "../../../../interfaceAdapters/controllers/AdminController";
import { GetAllUserDataUseCase } from "../../../../Applications/use-cases/admin/GetAllUserDataUseCase";
import { ChangerUserStatusUseCase } from "../../../../Applications/use-cases/admin/ChangeUserStatusUseCase";
import { GetAllKycUsecase } from "../../../../Applications/use-cases/admin/GetAllKycUseCase";
import { getSingleUserUseCase } from "../../../../Applications/use-cases/admin/getSingleUserUseCase";

export const AdminModule = new ContainerModule(({bind}) => {
    bind(Tokens.AdminRoutes).to(AdminRoutes)
    bind(Tokens.adminController).to(AdminController)

    bind(Tokens.getAllUsersUseCase).to(GetAllUserDataUseCase)
    bind(Tokens.changeUserStatusUseCase).to(ChangerUserStatusUseCase)

    bind(Tokens.getAllKycUseCase).to(GetAllKycUsecase)
    bind(Tokens.getSingleUserUsecase).to(getSingleUserUseCase)
})