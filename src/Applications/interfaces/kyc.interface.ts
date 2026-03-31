import { TKycResponseDto } from "../../interfaceAdapters/dtos/kyc.dto";
import { TKycUserData } from "../../shared/types/CommonTypes";

export interface IKycUseCase {
    submitKyc(data: TKycUserData): Promise<TKycResponseDto>
    canUploadKyc(userId: string): Promise<void>;
}

