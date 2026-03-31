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
import { Roles } from "../../constants/Roles";
import { IGetAllKycUseCase } from "../../Applications/interfaces/admin.interface";
import { TPagination } from "../../shared/types/CommonTypes";

@injectable()
export class KycController implements IkycController {
    constructor(
        @inject(Tokens._kycUseCase) private kycUseCase: IKycUseCase,
        @inject(Tokens.getAllKycUseCase)private getAllKycUseCase:IGetAllKycUseCase
    ) { }
    async uploadUrl(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, files } = req.body
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

            const { userId, payload } = req.body
            console.log("userid", userId);
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

    async getAllKyc(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const role = req.role
            console.log(role)
            if (role !== Roles.admin_role) {
                throw new AppError("only admin role can access", HttpStatusCode.FORBIDDEN)
            }
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string
            const sortField = req.query.sortField as string;
            const sortOrder = req.query.sortOrder as string;
            console.log(page, limit, search, sortField, sortOrder)
            const allowedSortFields = ["firstname", "updatedAt"];

            if (!allowedSortFields.includes(sortField)) {
                throw new AppError("SortField Not Found or Not Accessible", HttpStatusCode.BAD_REQUEST)
            }

            const { data, totalData } = await this.getAllKycUseCase.getAllKycDetails(page, limit, role, search, sortField, sortOrder)

            const pagination: TPagination = { page: page, limit: limit, totalData: totalData, totalPages: Math.ceil(totalData / limit) }
            const result = {
                data,
                pagination
            }
            ResponseHandler.success(res, "ALL kyc Data fetched", result, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}