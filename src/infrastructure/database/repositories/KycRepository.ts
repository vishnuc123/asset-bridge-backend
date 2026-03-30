import { Types } from "mongoose";
import { IKycModel } from "../../../domain/models/KycModel";
import { IKycRepository } from "../../../domain/repositories/IKycRepository";
import { mapKycToDto } from "../../../interfaceAdapters/dtos/kyc.dto";
import { IKycDocument, kycModel } from "../models/KycSchema";
import { BaseRepository } from "./BaseRepository";

export class KycRepository extends BaseRepository<IKycDocument> implements IKycRepository {
    constructor() {
        super(kycModel)
    }
    async findUserById(userid: string): Promise<IKycModel | null> {
        return this.model.findOne({
        userId: new Types.ObjectId(userid) 
    }).exec();
    }
}