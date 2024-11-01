package com.presignedurl.backend.config.cognito

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient

@Configuration
class CognitoClientFactory {

    @Bean
    fun build(
        @Value("\${environments.cognito.user-pool-id}")
        userPoolId: String,
        @Value("\${environments.cognito.access-key}")
        accessKey: String,
        @Value("\${environments.cognito.secret-key}")
        secretKey: String,
        @Value("\${environments.cognito.session-token}")
        sessionToken: String
    ): CognitoIdentityProviderClient {
        val awsCredentials = AwsSessionCredentials.create(accessKey, secretKey, sessionToken)
        return CognitoIdentityProviderClient.builder()
            .region(Region.AP_NORTHEAST_1)
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .build()
    }
}