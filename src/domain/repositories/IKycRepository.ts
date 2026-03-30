import { IKycDocument } from "../../infrastructure/database/models/KycSchema";
import { BaseRepository } from "../../infrastructure/database/repositories/BaseRepository";
import { IKycModel } from "../models/KycModel";

export interface IKycRepository extends BaseRepository<IKycDocument> {
    findUserById(userId: string): Promise<IKycModel | null>;
    // updateByUserId(userId: string,data: Partial<IKycDocument>): Promise<IKycDocument>
}