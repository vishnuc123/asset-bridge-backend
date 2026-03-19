import dotenv from "dotenv"
dotenv.config()


export const env = {
    PORT:process.env.PORT,
    EMAIL:process.env.EMAIL,
    EMAIL_PASS:process.env.EMAIL_PASS,
    REDIS_URL : process.env.REDIS_URL,
    MONGO_DB_URL:process.env.DB_CONNECTION_STRING,
    CLIENT_URL : process.env.CLIENT_URL
}