package com.presignedurl.backend.controller

import com.presignedurl.backend.config.CustomOAuth2User
import com.presignedurl.backend.config.Role
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class UserController {
    @GetMapping("/users")
    fun getUserInformation (
        @AuthenticationPrincipal user: CustomOAuth2User
    ): ResponseUser {
        println("きてるよ")
        println("user : $user")
        val res = ResponseUser(
            sub = user.getAttribute<String>("sub")!!,
            companyUUID = user.getAttribute<String>("companyUUID")!!,
            domain = user.getAttribute<String>("domain")!!,
            role = user.getAttribute<Role>("role")!!,
        )
        println("res : ${res}")
        return res
    }
}

data class ResponseUser (
    val sub: String,
    val companyUUID: String,
    val domain: String,
    val role: Role
)