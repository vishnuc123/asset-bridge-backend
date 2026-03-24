import dotenv from "dotenv"
dotenv.config()


export const env = {
    PORT: process.env.PORT,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,
    REDIS_URL: process.env.REDIS_URL,
    MONGO_DB_URL: process.env.DB_CONNECTION_STRING,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFREASH_SECRET: process.env.JWT_REFREASH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
}