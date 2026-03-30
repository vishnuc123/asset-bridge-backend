import { Types } from "mongoose";
import { TKYC_Status } from "../../shared/types/CommonTypes";

export interface IKycModel {
    userId: Types.ObjectId,
    profileImage: string,
    aadhaar: string,
    selfieVideo: string,
    status?: TKYC_Status,
    rejectionReason?: string,
    verifiedAt?: Date
    submittedAt:Date
}