import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/CustomRequest";
import { IkycController } from "../interfaces/IKycController";
import { AppError } from "../../utils/AppError";
import { HttpStatusCode } from "../../constants/HttpStatusCodes";
import { generateUploadUrl } from "../../utils/generateUploadUrl";
import { ResponseHandler } from "../../middlewares/ResponseHandle";
import { inject, injectable } from "inversify";
import { Tokens } from "../../constants/Tokens";
import { IKycUseCase } from "../../Applications/interfaces/kyc.interface";

@injectable()
export class KycController implements IkycController {
    constructor(
        @inject(Tokens._kycUseCase)private kycUseCase:IKycUseCase
    ){}
    async uploadUrl(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {userId,files} = req.body
            console.log("data", req.body);

            if (!files) {
                throw new AppError("files not found", HttpStatusCode.BAD_REQUEST)
            }

            // const url = await generateUploadUrl(data.fileName, data.fileType)
            await this.kycUseCase.canUploadKyc(userId)
            const result = await Promise.all(
                files.map(async (file: any) => {
                    const url = await generateUploadUrl(file.fileName, file.fileType)

                    return {
                        type: file.type,
                        url
                    }
                })
            )

            ResponseHandler.success(res, "signedurl generated success", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async submit(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const {userId,payload} = req.body
            console.log("userid",userId);
            // const userId = userId
            
            const { profileImage, aadhaar, selfieVideo } = payload

            if (!profileImage || !aadhaar || !selfieVideo) {
                throw new AppError("All KYC documents are required", HttpStatusCode.BAD_REQUEST)
            }

            if (!userId) {
                throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED)
            }

            await this.kycUseCase.canUploadKyc(userId)
            const result = await this.kycUseCase.submitKyc({
                userId,
                profileImage,
                aadhaar,
                selfieVideo
            })

            ResponseHandler.success(res, "KYC submitted successfully", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}