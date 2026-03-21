export const jwtConfig = {
    accessToken: {
        expiresIn: 15,
        maxAge: 5 * 1000 //1 * 60 * 1000
    },
    refreshToken: {
        expiresIn: 7,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

export const otpTimer = {
    expiresInSeconds: 300,
}

export const awsS3Timer = {
    expiresAt: 84600, //one day milliseconds
}