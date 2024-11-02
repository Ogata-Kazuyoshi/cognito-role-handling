package com.presignedurl.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
class SecurityConfiguration(
    val successHandler: CustomOAuth2SuccessHandler
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it.requestMatchers("/api/**")
                    .hasRole("ADMIN")
                it.anyRequest()
                    .permitAll()
            }
            .oauth2Login {
                it.successHandler(successHandler)
            }
            .logout {
                it.logoutSuccessUrl("http://localhost:5180/")
            }
        return http.build()
    }
}

