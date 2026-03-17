import type { TRole } from "../../shared/types/CommonTypes.js"

export type TUserResponseDto =  {
     id: string
    firstname: string
    lastname: string
    email: string
    role:TRole
    phone: string
    walletId?: string

    stripeCustomerId?: string
    stripeConnectedAccountId?: string

    kycStatus: "PENDING" | "VERIFIED" | "REJECTED"

    emailVerified: boolean
    phoneVerified: boolean

    createdAt: Date
    updatedAt: Date
}

export type TCreateUserDto = {
    firstname: string
    lastname: string
    email: string
    password:string
    role:TRole
    phone: string
}