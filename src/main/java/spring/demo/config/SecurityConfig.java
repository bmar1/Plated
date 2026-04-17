/*
 * This class aims to create a global config to secure our server by only allowing endpoints,
 * the rest of which utilizes the filter and authentication provider to authenticate users
 */

package spring.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import spring.demo.config.security.JwtAuthFilter;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Injected from application.properties → frontend.url → env var FRONTEND_URL.
     * Set FRONTEND_URL in your Render backend service to the static-site URL,
     * e.g. https://plated-frontend.onrender.com
     */
    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Build the allowed-origins list dynamically so the Render frontend URL
        // is picked up at runtime without a code change.
        List<String> origins = new ArrayList<>(List.of(
                "http://localhost:3000",
                "http://localhost",
                "http://127.0.0.1",
                "https://plated-app.online",
                "http://plated-app.online"
        ));

        // Add the deployed frontend URL (e.g. https://plated-frontend.onrender.com)
        // only if it differs from the defaults already listed.
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            origins.add(frontendUrl);
            // Also allow with/without trailing slash permutations.
            String stripped = frontendUrl.replaceAll("/+$", "");
            if (!origins.contains(stripped)) origins.add(stripped);
        }

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
