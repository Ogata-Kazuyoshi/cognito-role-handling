package com.presignedurl.backend.config

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import java.util.*

enum class Role {
    ADMIN,
    MANAGER,
    EMPLOYEE
}
data class AuthAttributes(
    val sub: String,
    val companyUUID: String,
    val group: Role,
    val domain: String
)

@Component
class CustomOAuth2SuccessHandler(
    private val redirectUrl: RedirectUrl
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        authentication: Authentication?,
    ) {
        val oAuth2AuthenticationToken = authentication as OAuth2AuthenticationToken
        val clientRegistrationId = oAuth2AuthenticationToken.authorizedClientRegistrationId
        val principal = authentication.principal as OAuth2User
        val authAttributes = when (clientRegistrationId) {
            "cognito" -> {
                val sub = principal.getAttribute<String>("sub")
                    ?: throw Exception("!!! cognito sub is not found. !!!")
                val companyUUID = principal.getAttribute<String>("custom:companyUUID")
                    ?: throw Exception("!!! custom:companyUUID is not found. !!!")
                val groups = principal.getAttribute<List<String>>("cognito:groups")
                    ?: throw Exception("!!! cognito:groups is not found. !!!")
                val domain = principal.getAttribute<String>("custom:allowDomain")
                    ?: throw Exception("!!! cognito:groups is not found. !!!")
                val role = Role.valueOf(groups[0])
                AuthAttributes(sub, companyUUID, role, domain)
            }
            else -> {
                val sub = principal.getAttribute<String>("sub")
                    ?: throw Exception("!!! keycloak sub is not found. !!!")
                AuthAttributes(sub, "", Role.EMPLOYEE, "")
            }
        }

        val authorities =  listOf(SimpleGrantedAuthority("ROLE_${authAttributes.group}"))
        val newOAuth2User = CustomOAuth2User(
            authorities,
            userId = UUID.randomUUID(),
            name = "cognito-user",
            sub = authAttributes.sub,
            companyUUID = authAttributes.companyUUID,
            domain = authAttributes.domain,
            role = authAttributes.group
        )
        val newAuthentication =
            OAuth2AuthenticationToken(
                newOAuth2User,
                newOAuth2User.authorities,
                oAuth2AuthenticationToken.authorizedClientRegistrationId,
            )
        SecurityContextHolder.getContext().authentication = newAuthentication
        response?.sendRedirect(redirectUrl.url)
    }
}
