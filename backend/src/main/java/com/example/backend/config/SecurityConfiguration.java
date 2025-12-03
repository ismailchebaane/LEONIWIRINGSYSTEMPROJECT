package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final jwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfiguration(jwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Ensure the CORS configuration is applied
                .csrf(csrf -> csrf.disable()) // Disable CSRF if using JWT
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signin","/api/equipment/add","/api/chat", "/api/auth/login","/api/equipment/check/{serialNumber}","/api/equipment/{id}","/api/dashboard/**","/api/documents/download/**","/api/equipment/upload-csv", "/api/user/me","/api/user/by-work/**","/api/notifications/**","/api/notifications/").permitAll()
                        .requestMatchers("/add/user", "/delete/user/**","/update/user/{userName}", "/update/user/**").hasAuthority("ADMIN")

                        .requestMatchers("/api/equipment/all","/api/equipment/add", "/api/equipment/update/**", "/api/equipment/delete/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/document/delete/**").hasAuthority("ADMIN")
                        .requestMatchers( "/api/document/update/**", "/api/user", "/api/user/**" ,"/api/equipment/{equipmentId}/replace-document/{docId}","/api/equipment/{equipmentId}/document/{fileIdToReplace}").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
