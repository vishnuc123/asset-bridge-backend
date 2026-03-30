import { Types } from "mongoose"
import type { TKYC_Status, TRole, TUserStatus } from "../../shared/types/CommonTypes.js"

export interface IUserModel {
    _id: Types.ObjectId
    firstname: string
    lastname: string
    email: string
    password: string
    roles: TRole[]
    status: TUserStatus
    isBlocked: boolean

    phone: string
    walletId?: string

    stripeCustomerId?: string
    stripeConnectedAccountId?: string

    kycStatus: TKYC_Status

    emailVerified: boolean
    phoneVerified: boolean

}