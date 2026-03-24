import { IUserModel } from "../domain/models/userModel";
import { TUserResponseDto } from "../interfaceAdapters/dtos/user.dto";

export class MapResponse{
    static MapUserResponseToDto(user:IUserModel):TUserResponseDto{
        return {
            userId:user._id.toString() ,
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            phone:user.phone,
            roles:user.roles,
            isBlocked:user.isBlocked,
            status:user.status,
            kycStatus:user.kycStatus,
            phoneVerified:user.phoneVerified,
            emailVerified:user.emailVerified,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        }
    }
}