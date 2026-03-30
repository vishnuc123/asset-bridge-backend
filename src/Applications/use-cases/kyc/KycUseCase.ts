import { inject, injectable } from "inversify"
import { TKycUserData } from "../../../shared/types/CommonTypes"
import { IKycUseCase } from "../../interfaces/kyc.interface"
import { Tokens } from "../../../constants/Tokens"
import { Types } from "mongoose"
import { mapKycToDto } from "../../../interfaceAdapters/dtos/kyc.dto"
import { IKycRepository } from "../../../domain/repositories/IKycRepository"
import { AppError } from "../../../utils/AppError"
import { HttpStatusCode } from "../../../constants/HttpStatusCodes"

@injectable()
export class KycUseCase implements IKycUseCase {
    constructor(
        @inject(Tokens.kycRepository) private kycRepository: IKycRepository,
    ) { }

    async submitKyc(data: TKycUserData): Promise<TKycUserData> {

        const existingKyc = await this.kycRepository.findUserById(data.userId.toString())


        let result;

        if (existingKyc) {
            throw new AppError("this docs already exists", HttpStatusCode.BAD_REQUEST)
        } else {
            result = await this.kycRepository.create({
                userId: new Types.ObjectId(data.userId),
                profileImage: data.profileImage,
                aadhaar: data.aadhaar,
                selfieVideo: data.selfieVideo,
                status: "pending"
            })
        }

        if (!result) {
            throw new Error("KYC operation failed")
        }


        return mapKycToDto(result)
    }

    async canUploadKyc(userId: string): Promise<void> {
        const existingKyc = await this.kycRepository.findUserById(userId);
        console.log("existing user", existingKyc);


        if (existingKyc && existingKyc.status === "pending") {
            throw new AppError("KYC already submitted", HttpStatusCode.BAD_REQUEST);
        }
    }
}