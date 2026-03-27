export const jwtConfig = {
    accessToken: {
        expiresIn: "1m",
        maxAge: 1*60* 1000 //1 * 60 * 1000
    },
    refreshToken: {
        expiresIn: "1d",
        maxAge: 1 * 24 * 60 * 60 * 1000
    }
}

export const otpTimer = {
    expiresInSeconds: 300,
}

export const awsS3Timer = {
    expiresAt: 84600, 
}