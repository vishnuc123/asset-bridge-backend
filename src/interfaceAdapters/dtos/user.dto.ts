import type { TKYC_Status, TRole, TUserStatus } from "../../shared/types/CommonTypes.js"

export type TUserResponseDto = {
    userId: string
    firstname: string
    lastname: string
    email: string
    roles: TRole[]
    status: TUserStatus
    isBlocked: boolean,
    phone: string
    walletId?: string

    stripeCustomerId?: string
    stripeConnectedAccountId?: string

    kycStatus: "pending" | "verified" | "rejected"

    emailVerified: boolean
    phoneVerified: boolean

    createdAt: Date;
    updatedAt: Date;
}

export type TCreateUserDto = {
    firstname: string
    lastname: string
    email: string
    password: string
    roles: TRole[]
    status: TUserStatus
    isBlocked: boolean
    // phone: string
}

export type TUserDataDto = {
    firstname: string,
    lastname: string,
    email: string,
    status: string,
    isblocked: boolean,
    createdAt: Date,
}


