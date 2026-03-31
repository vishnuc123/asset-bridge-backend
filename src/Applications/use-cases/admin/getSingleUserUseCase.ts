import { inject } from "inversify";
import { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { IgetSingleUserUseCase } from "../../interfaces/admin.interface";
import { Tokens } from "../../../constants/Tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IKycRepository } from "../../../domain/repositories/IKycRepository";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { MapResponse } from "../../../utils/MapResponse";
import { S3Service } from "../../../infrastructure/service/s3Service";
import { mapKycToDto, TKycResponseDto } from "../../../interfaceAdapters/dtos/kyc.dto";
import { Types } from "mongoose";

export class getSingleUserUseCase implements IgetSingleUserUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IUserRepository,
        @inject(Tokens.kycRepository) private kycRepository: IKycRepository,
        @inject(Tokens.s3Service) private s3Service: S3Service
    ) { }

    async getSingleUseDetails(userId: string): Promise<{ user: TUserResponseDto, kyc: TKycResponseDto | null }> {
        if (!userId) {
            throw new AppError("userid not found", HttpStatusCode.BAD_REQUEST);
        }

        // 🔹 1. Get User
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new AppError("user not found", HttpStatusCode.NOT_FOUND);
        }

        // 🔹 2. Get KYC
        const kyc = await this.kycRepository.findKycByUserId(userId);
        console.log("kyc",kyc);
        
        // if(!kyc){
        //     throw new AppError("docs not found",HttpStatusCode.NOT_FOUND)
        // }

        let signedKyc = null;

        if (kyc) {
                const mappedKyc = mapKycToDto(kyc)
            const [profileImage, aadhaar, selfieVideo] = await Promise.all([
                kyc.profileImage
                    ? this.s3Service.getSignedViewUrl(kyc.profileImage)
                    : null,
                kyc.aadhaar
                    ? this.s3Service.getSignedViewUrl(kyc.aadhaar)
                    : null,
                kyc.selfieVideo
                    ? this.s3Service.getSignedViewUrl(kyc.selfieVideo)
                    : null,
            ]);

            signedKyc = {
                ...mappedKyc,
                profileImage,
                aadhaar,
                selfieVideo,
            };
        }

        console.log("signedkyc",signedKyc)
        const mappedUser = MapResponse.MapUserResponseToDto(user);

        return {
            user: mappedUser,
            kyc: signedKyc,
        };
    }
}