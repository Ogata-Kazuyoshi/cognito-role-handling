package com.presignedurl.backend.controller

import com.presignedurl.backend.config.CustomOAuth2User
import com.presignedurl.backend.config.Role
import com.presignedurl.backend.service.UserService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class UserController(
    val userService: UserService
) {
    @GetMapping("/users")
    fun getUserInformation (
        @AuthenticationPrincipal user: CustomOAuth2User
    ): ResponseUser {
        val res = ResponseUser(
            sub = user.getAttribute<String>("sub")!!,
            companyUUID = user.getAttribute<String>("companyUUID")!!,
            domain = user.getAttribute<String>("domain")!!,
            role = user.getAttribute<Role>("role")!!,
        )
        return res
    }

    @PostMapping("/users")
    fun createUser (
        @AuthenticationPrincipal user: CustomOAuth2User,
        @RequestBody reqBody: RequestCreateUser,
    ) {
        val companyUUID = user.getAttribute<String>("companyUUID")!!
        userService.createUser(reqBody.email, companyUUID)
    }
}

data class RequestCreateUser (
    val email: String
)

data class ResponseUser (
    val sub: String,
    val companyUUID: String,
    val domain: String,
    val role: Role
)