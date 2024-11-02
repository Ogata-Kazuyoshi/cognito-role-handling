package com.presignedurl.backend.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminAddUserToGroupRequest
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType

interface UserService {
    fun createUser(email: String, companyUUID: String)
}
@Service
class DefaultUserService(
    @Value("\${environments.cognito.user-pool-id}")
    val userPoolId: String,
    val cognitoClient: CognitoIdentityProviderClient
): UserService {
    override fun createUser(email: String, companyUUID: String) {
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
