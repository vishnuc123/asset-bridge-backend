import type { IUserModel } from "../../domain/models/userModel.js";

export type TRole = "User" | "Admin" | "Investor" | "Owner"
export type TKYC_Status = "pending" | "verified" | "rejected"
export type TUserStatus = "pending"| "active" | "banned"
export type TUserRegistrationInput = Pick<IUserModel, 'firstname' | 'lastname' | 'email' | 'password'  | 'roles' |"status"|"isBlocked">;
export type TOtpData = TUserRegistrationInput | { email: string } | { [key: string]: unknown }
export type TPagination = {page:number,limit:number,totalData:number,totalPages:number}