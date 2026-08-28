package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // 💡 Vite 프록시 및 CORS 연동을 위해 추가
                .authorizeHttpRequests(auth -> auth
                        // ⭕ 현재 사용 중인 URL들을 허용 목록에 추가
                        .requestMatchers("/**/*.do").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}