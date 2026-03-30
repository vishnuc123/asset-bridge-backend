import mongoose, { Schema, Types, Document } from "mongoose"
import { IKycModel } from "../../../domain/models/KycModel"

export interface IKycDocument extends IKycModel, Document { }

const KycSchema = new Schema<IKycDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    profileImage: {
        type: String,
        required: true
    },

    aadhaar: {
        type: String,
        required: true
    },

    selfieVideo: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    },

    rejectionReason: {
        type: String,
        default: null
    },

    verifiedAt: {
        type: Date,
        default: null
    },
    submittedAt: {
        type: Date,
        default: Date.now(),
    },


}, {
    timestamps: true
})

export const kycModel = mongoose.model<IKycDocument>("kyc_documents", KycSchema)