import { QueryFilter, Types } from "mongoose";
import { IKycModel } from "../../../domain/models/KycModel";
import { IKycRepository } from "../../../domain/repositories/IKycRepository";
import { mapKycDocumentToModel, mapKycToDto } from "../../../interfaceAdapters/dtos/kyc.dto";
import { IKycDocument, kycModel } from "../models/KycSchema";
import { BaseRepository } from "./BaseRepository";
import { TRole } from "../../../shared/types/CommonTypes";

export class KycRepository extends BaseRepository<IKycDocument> implements IKycRepository {
    constructor() {
        super(kycModel)
    }
    async findKycByUserId(userId: string): Promise<IKycModel | null> {
        const doc = await kycModel.findOne({
            userId: new Types.ObjectId(userId),
        });

        if (!doc) return null;

        return mapKycDocumentToModel(doc);
    }

    async findAllKyc(page: number, limit: number, role: TRole, search: string, sortField?: string, sortOrder?: string): Promise<{ data: IKycDocument[] | null, total: number }> {
        const skip = (page - 1) * limit
        const sortDirection = sortOrder === "descending" ? -1 : 1;
        const filter: QueryFilter<IKycDocument> = {}
        if (search) {
            const searchRegex = new RegExp("^" + search, "i")
            filter.$or = [
                { firstname: searchRegex },
                { userid: searchRegex }
            ]
        }
        const result = this.find(filter)
        const total = await this.model.countDocuments(filter)
        const data = await result.skip(skip).limit(limit).sort({ [sortField as string]: sortDirection })
        return { data: data, total: total }
    }
}