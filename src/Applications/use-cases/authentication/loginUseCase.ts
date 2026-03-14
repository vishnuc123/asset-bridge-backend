import { inject, injectable } from "inversify";
import type { ILoginUseCase } from "../../interfaces/auth.interface.js";
import { Tokens } from "../../../constants/Tokens.js";

@injectable
export class LoginUseCase implements ILoginUseCase{
    constructor(
        @inject(Tokens.)
    )
}