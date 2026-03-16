export interface IMailService {
    sendOtpEmail(email: string, otp: string, otpExpireAt: string): Promise<{ message: string; otpExpireAt: string }>;
}