import { IKycModel } from "../../domain/models/KycModel";
import { IKycDocument } from "../../infrastructure/database/models/KycSchema";
import { TKYC_Status } from "../../shared/types/CommonTypes";


export type TKycResponseDto = {
  userId: string;

  profileImage: string | null;
  aadhaar: string |null;
  selfieVideo: string | null;

  status: TKYC_Status;

  rejectionReason?: string;
  verifiedAt?: Date;
  submittedAt?: Date;
};

export const mapKycToDto = (data: IKycModel): TKycResponseDto => ({
  userId: data.userId.toString(),
  profileImage: data.profileImage,
  aadhaar: data.aadhaar,
  selfieVideo: data.selfieVideo,
  status: data.status ?? "pending",
  rejectionReason: data.rejectionReason,
  verifiedAt: data.verifiedAt,
  submittedAt: data.submittedAt,

})
export const mapKycDocumentToModel = (doc: IKycDocument): IKycModel => ({
  userId: doc.userId,

  profileImage: doc.profileImage ?? null,
  aadhaar: doc.aadhaar ?? null,
  selfieVideo: doc.selfieVideo ?? null,

  status: doc.status ?? "pending",

  rejectionReason: doc.rejectionReason,
  verifiedAt: doc.verifiedAt,
  submittedAt: doc.submittedAt,
});