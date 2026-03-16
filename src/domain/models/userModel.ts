import type {  TKYC_Status, TRole } from "../../shared/types/CommonTypes.js"

export interface IUserModel {
    id: string
    firstname: string
    lastname: string
    email: string
    password: string
    role: TRole

    phone: string
    walletId?: string

    stripeCustomerId?: string
    stripeConnectedAccountId?: string

    kycStatus: TKYC_Status

    emailVerified: boolean
    phoneVerified: boolean

    createdAt: Date
    updatedAt: Date
}