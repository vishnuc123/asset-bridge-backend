import { IUserModel } from "../domain/models/userModel";
import { TUserResponseDto } from "../interfaceAdapters/dtos/user.dto";

export class MapResponse{
    static MapUserResponseToDto(user:IUserModel):TUserResponseDto{
        return {
            id:user.id as string ,
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            phone:user.phone,
            role:user.role,
            kycStatus:user.kycStatus,
            phoneVerified:user.phoneVerified,
            emailVerified:user.emailVerified,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        }
    }
}