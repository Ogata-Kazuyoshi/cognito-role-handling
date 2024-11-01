package com.presignedurl.backend.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminAddUserToGroupRequest
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse

interface UserService {
    fun createUser(email: String, companyUUID: String)
}
@Service
class DefaultUserService(
    @Value("\${environments.cognito.user-pool-id}")
    val userPoolId: String,
    @Value("\${environments.cognito.access-key}")
    val accessKey: String,
    @Value("\${environments.cognito.secret-key}")
    val secretKey: String,
    @Value("\${environments.cognito.session-token}")
    val sessionToken: String
): UserService {
    override fun createUser(email: String, companyUUID: String) {
        this.registerUser(email, companyUUID)
    }

    private fun registerUser(email: String, companyUUID: String) {
        val awsCredentials = AwsSessionCredentials.create(accessKey, secretKey, sessionToken)
        val cognitoClient = CognitoIdentityProviderClient.builder()
            .region(Region.AP_NORTHEAST_1)
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .build()

        // 標準属性とカスタム属性を設定
        val userAttributes = mutableListOf(
            AttributeType.builder().name("email").value(email).build(),
            AttributeType.builder().name("email_verified").value("true").build(),
            AttributeType.builder().name("custom:companyUUID").value(companyUUID).build()
        )

        val request = AdminCreateUserRequest.builder()
            .userPoolId(userPoolId)
            .username(email)
            .userAttributes(userAttributes)
            .build()

        val response: AdminCreateUserResponse = cognitoClient.adminCreateUser(request)
        println("User ${response.user().username()} is created.")

        val addUserToGroupRequest = AdminAddUserToGroupRequest.builder()
            .userPoolId(userPoolId)
            .username(email)
            .groupName("EMPLOYEE")
            .build()

        cognitoClient.adminAddUserToGroup(addUserToGroupRequest)
    }

}
