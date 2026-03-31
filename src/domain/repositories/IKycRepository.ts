import { IKycDocument } from "../../infrastructure/database/models/KycSchema";
import { BaseRepository } from "../../infrastructure/database/repositories/BaseRepository";
import { TRole } from "../../shared/types/CommonTypes";
import { IKycModel } from "../models/KycModel";

export interface IKycRepository extends BaseRepository<IKycDocument> {
    findKycByUserId(userId: string): Promise<IKycModel | null>;
    findAllKyc(page: number, limit: number, role: TRole, search: string, sortField?: string, sortOrder?: string): Promise<{ data: IKycDocument[] | null, total: number }>

    // updateByUserId(userId: string,data: Partial<IKycDocument>): Promise<IKycDocument>
}