import { TKycUserData } from "../../shared/types/CommonTypes";

export interface IKycUseCase {
    submitKyc(data: TKycUserData): Promise<TKycUserData>
    canUploadKyc(userId: string): Promise<void>;
}