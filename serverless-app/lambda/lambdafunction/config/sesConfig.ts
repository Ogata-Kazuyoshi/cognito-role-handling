import {SESClient} from "@aws-sdk/client-ses";

export const sesClient = process.env.AWS_SAM_LOCAL
    ? new SESClient({
        region: 'ap-northeast-1',
        credentials: {
            accessKeyId: process.env.AwsAccessKeyId || '',
            secretAccessKey: process.env.AwsSecretAccessKey || '',
            sessionToken: process.env.AwsSessionToken || '',
        },
    }): new SESClient({
        region: 'ap-northeast-1'
    })