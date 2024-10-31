package com.presignedurl.backend.config

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.oauth2.core.user.OAuth2User
import java.util.*

class CustomOAuth2User(
    private val authorities: Collection<GrantedAuthority>,
    private val name: String,
    userId: UUID,
    sub: String,
    companyUUID: String,
    domain: String,
    role: Role
) : OAuth2User {
    private val attributes = mapOf("userId" to userId, "sub" to sub, "companyUUID" to companyUUID, "domain" to domain, "role" to role)

    override fun getName(): String {
        return name
    }

    override fun getAttributes(): Map<String, Any> {
        return attributes
    }

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return authorities
    }
}
