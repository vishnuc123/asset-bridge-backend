import type { IUserModel } from "../../domain/models/userModel.js";

export type TRole = "User" | "Admin" | "investor" | "property_owner"
export type TKYC_Status = "PENDING" | "VERIFIED" | "REJECTED"
export type TUserRegistrationInput = Pick<IUserModel, 'firstname' | 'lastname' | 'email' | 'password' | 'phone' | 'role'>;
export type TOtpData = TUserRegistrationInput | { email: string } | { [key: string]: any }