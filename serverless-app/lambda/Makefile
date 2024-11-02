sam-local:
	UserPoolId=$(USER_POOL_ID) AwsAccessKeyId=$(AWS_ACCESS_KEY_ID) AwsSecretAccessKey=$(AWS_SECRET_ACCESS_KEY) AwsSessionToken=$(AWS_SESSION_TOKEN) sam build
	UserPoolId=$(USER_POOL_ID) AwsAccessKeyId=$(AWS_ACCESS_KEY_ID) AwsSecretAccessKey=$(AWS_SECRET_ACCESS_KEY) AwsSessionToken=$(AWS_SESSION_TOKEN) sam local start-api

sam-deploy:
	sam build
	sam deploy --no-confirm-changeset --no-fail-on-empty-changeset

sam-delete:
	sam delete --stack-name temp-ogata-sam

