package com.recycle.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.recycle.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ===== ENDPOINTS PÚBLICOS (SIN AUTENTICACIÓN) =====
                        // Swagger UI y documentación
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/swagger-resources/**",
                                "/webjars/**")
                        .permitAll()
                        // Auth y Test
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()

                        // ===== CENTROS DE ACOPIO =====
                        // Consulta pública (RF-07/RF-11 lectura), pero crear
                        // centros ya NO es público: antes /api/centros/**
                        // permitAll cubría también el POST, así que cualquiera
                        // sin sesión podía dar de alta centros falsos.
                        // CORRECCIÓN FASE 4: Añadidos PUT y DELETE con rol ADMIN
                        // para completar el CRUD de centros.
                        .requestMatchers(HttpMethod.GET, "/api/centros/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/centros").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/centros/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/centros/**").hasRole("ADMIN")

                        // ===== RESIDUOS =====
                        // Antes solo exigían .authenticated() a nivel de
                        // /api/residuos/**, así que cualquier CIUDADANO podía
                        // ver /todos o cambiar el estado de cualquier residuo.
                        .requestMatchers(HttpMethod.GET, "/api/residuos/todos")
                        .hasAnyRole("OPERADOR_CENTRO", "OPERADOR_TECNICO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/residuos/*/estado")
                        .hasAnyRole("OPERADOR_CENTRO", "OPERADOR_TECNICO", "ADMIN")
                        .requestMatchers("/api/residuos/**").authenticated()

                        // ===== TRAZABILIDAD =====
                        // Consultar el historial: cualquier usuario autenticado
                        // (el ciudadano dueño del residuo, operadores, admin).
                        // Cambiar el estado: solo operadores/admin (RF-06/PT07).
                        .requestMatchers(HttpMethod.PUT, "/api/trazabilidad/*/estado")
                        .hasAnyRole("OPERADOR_CENTRO", "OPERADOR_TECNICO", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/trazabilidad/**").authenticated()

                        // ===== ENDPOINTS SOLO ADMIN =====
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://re-cycle-tech.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}