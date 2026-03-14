import { injectable } from "inversify";
import type { IRegisterUseCase } from "../../interfaces/auth.interface.js";
import type { TCreateUserDto } from "../../../interfaceAdapters/dtos/user.dto.js";

@injectable()
export class RegisterUseCase implements IRegisterUseCase{
    constructor(){}
    Regiser(userData: TCreateUserDto): Promise<{ userId: string; message: string; }> {
        
    }
}