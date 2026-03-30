import { IKycDocument } from "../../infrastructure/database/models/KycSchema";
import { TKYC_Status } from "../../shared/types/CommonTypes";


export type TKycResponseDto = {
  userId: string;

  profileImage: string;
  aadhaar: string;
  selfieVideo: string;

  status: TKYC_Status;

  rejectionReason?: string;
  verifiedAt?: Date;
  submittedAt?: Date;
};

export const mapKycToDto = (data: IKycDocument): TKycResponseDto => ({
  userId: data.userId.toString(),
  profileImage: data.profileImage,
  aadhaar: data.aadhaar,
  selfieVideo: data.selfieVideo,
  status: data.status ?? "pending",
  rejectionReason: data.rejectionReason,
  verifiedAt: data.verifiedAt,
  submittedAt: data.submittedAt,

})