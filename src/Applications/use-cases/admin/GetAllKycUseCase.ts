import { inject, injectable } from "inversify";
import { Tokens } from "../../../constants/Tokens";
import { IKycRepository } from "../../../domain/repositories/IKycRepository";
import { TRole } from "../../../shared/types/CommonTypes";
import { IGetAllKycUseCase } from "../../interfaces/admin.interface";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { mapKycToDto, TKycResponseDto } from "../../../interfaceAdapters/dtos/kyc.dto";


@injectable()
export class GetAllKycUsecase implements IGetAllKycUseCase {
    constructor(
        @inject(Tokens.kycRepository) private kycRepository: IKycRepository,
    ) { }
    async getAllKycDetails(page: number, limit: number, role: TRole, search?: string, sortField?: string, sortOrder?: string): Promise<{ data: TKycResponseDto[]; totalData: number; }> {
        const { data, total } = await this.kycRepository.findAllKyc(page, limit, role, search as string, sortField, sortOrder)
        console.log(data,total)
        if (!data || !total) {
            throw new AppError("no users found", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }
        // const mappeduser = users.map(MapResponse.MapUserResponseToDto)
        const mappedData = data.map(mapKycToDto)
        return { data: mappedData, totalData: total }
    }
}