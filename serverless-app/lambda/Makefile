sam-local:
	UserPoolId=$(USER_POOL_ID) AwsAccessKeyId=$(AWS_ACCESS_KEY_ID) AwsSecretAccessKey=$(AWS_SECRET_ACCESS_KEY) AwsSessionToken=$(AWS_SESSION_TOKEN) sam build
	UserPoolId=$(USER_POOL_ID) AwsAccessKeyId=$(AWS_ACCESS_KEY_ID) AwsSecretAccessKey=$(AWS_SECRET_ACCESS_KEY) AwsSessionToken=$(AWS_SESSION_TOKEN) sam local start-api

sam-deploy:
	sam build
	if aws s3 ls "s3://ogata-sam-cli2" 2>&1 | grep -q 'NoSuchBucket'; then \
        echo "バケット ogata-sam-cli2 が存在しません。作成します。"; \
        aws s3 mb s3://ogata-sam-cli2 --region ap-northeast-1; \
    else \
        echo "バケット ogata-sam-cli2 は既に存在します。クリーンナップします。"; \
        aws s3 rm s3://ogata-sam-cli2 --recursive; \
    fi
	sam deploy --stack-name ogata-cogniot-lambda-cli2 --s3-bucket ogata-sam-cli2 --capabilities CAPABILITY_IAM --no-confirm-changeset --no-fail-on-empty-changeset \
	--parameter-overrides \
	UserPoolId=$(COGNITO_USERPOOL_ID) \
	LambdaRoleName=$(LAMBDA_ROLE_NAME) \
	HostZoneId=$(HOST_ZONE_ID) \
	RegionalCertificateArn=$(ACM_ARN_FOR_API) \
	DomainName=$(DOMAIN_NAME_FOR_API) \

sam-delete:
	sam delete --stack-name temp-ogata-sam

