import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const cognitoClient = new CognitoIdentityProviderClient({
    region: 'ap-northeast-1',
    credentials: {
        accessKeyId: process.env.AwsAccessKeyId || '',
        secretAccessKey: process.env.AwsSecretAccessKey || '',
        sessionToken: process.env.AwsSessionToken || '',
    },
});
export const userPoolId = process.env.UserPoolId;

export interface EventBody {
    userEmail: string;
}
