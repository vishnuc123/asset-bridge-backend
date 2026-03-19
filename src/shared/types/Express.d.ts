import { TRole } from "./CommonTypes";

declare global{
    namespace Express{
        interface Request{
            role?:TRole
        }
    }
}