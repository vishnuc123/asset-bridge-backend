import type { IUserModel } from "../../domain/models/userModel.js";

export type TRole = "User" | "Admin" | "Investor" | "Property_owner"
export type TKYC_Status = "pending" | "verified" | "rejected"
export type TUserRegistrationInput = Pick<IUserModel, 'firstname' | 'lastname' | 'email' | 'password'  | 'role'>;
export type TOtpData = TUserRegistrationInput | { email: string } | { [key: string]: unknown }