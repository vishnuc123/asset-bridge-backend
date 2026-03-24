import mongoose, { Schema, Document } from "mongoose";
import { IUserModel } from "../../../domain/models/userModel";

export interface IUserDocument extends IUserModel, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      required: true,
      enum: ["User", "Admin", "Property_owner","Investor"], 
      default:[]
    },
    status:{
      type:String,
      required:true,
      enum:["pending","active","banned"]
    },
    phone: {
      type: String,
      // required: true,
    },

    walletId: {
      type: String,
    },

    stripeCustomerId: {
      type: String,
    },

    stripeConnectedAccountId: {
      type: String,
    },

    kycStatus: {
      type: String,
      required: true,
      enum: ["pending", "verified", "rejected"], 
      default: "pending",
    },
    isBlocked:{
      type:Boolean,
      required:true,
      default:false
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>("Users", UserSchema);