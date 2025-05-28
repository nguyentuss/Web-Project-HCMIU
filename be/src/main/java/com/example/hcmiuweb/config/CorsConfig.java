package com.example.hcmiuweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow your frontend origins
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("https://hcmiu-project-web.id.vn");
        config.addAllowedOrigin("http://hcmiu-project-web.id.vn");
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow common HTTP methods
        config.addAllowedMethod("*");
        
        // Allow common headers
        config.addAllowedHeader("*");
        
        // Allow cookies
        config.addExposedHeader("Set-Cookie");
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 