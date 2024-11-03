import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
export const cognitoClient = process.env.AWS_SAM_LOCAL
    ? new CognitoIdentityProviderClient({
          region: 'ap-northeast-1',
          credentials: {
              accessKeyId: process.env.AwsAccessKeyId || '',
              secretAccessKey: process.env.AwsSecretAccessKey || '',
              sessionToken: process.env.AwsSessionToken || '',
          },
      })
    : new CognitoIdentityProviderClient({});
export const userPoolId = process.env.UserPoolId;

