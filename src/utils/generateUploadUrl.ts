import { PutObjectCommand } from "@aws-sdk/client-s3"
import { env } from "../infrastructure/config/env/env"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "../infrastructure/config/aws/s3"

export const generateUploadUrl = async (fileName: string, fileType: string) => {

    const key = `kyc/${Date.now()}-${fileName}`
    console.log("file types",fileType);
    

    const command = new PutObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: key,
        ContentType: fileType
    })

    const url = await getSignedUrl(s3, command, {
        expiresIn: 60
    })

    return { url, key }
}