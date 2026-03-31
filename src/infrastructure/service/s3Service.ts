import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env/env";
import { s3 } from "../config/aws/s3";

export class S3Service {
    async getSignedViewUrl(key: string): Promise<string> {
        console.log("key", key);
        console.log("bucket", env.AWS_BUCKET);

        if (!key) throw new Error("Invalid key");

        if (!env.AWS_BUCKET) {
            throw new Error("S3_BUCKET not defined");
        }

        let contentType = "application/octet-stream";

        if (key.endsWith(".jpg") || key.endsWith(".jpeg") || key.endsWith(".png")) {
            contentType = "image/jpeg";
        } else if (key.endsWith(".mp4")) {
            contentType = "video/mp4";
        }

        const command = new GetObjectCommand({
            Bucket: env.AWS_BUCKET,
            Key: key,
            ResponseContentDisposition: "inline",
            ResponseContentType: contentType
        });

        return await getSignedUrl(s3, command, {
            expiresIn:30,
        });
    }
}