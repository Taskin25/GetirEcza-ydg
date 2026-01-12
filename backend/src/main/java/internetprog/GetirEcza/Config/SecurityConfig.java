package internetprog.GetirEcza.Config;

import internetprog.GetirEcza.Security.JwtFilter;
import internetprog.GetirEcza.Services.KullaniciDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth işlemleri
                        .requestMatchers("/api/auth/**").permitAll()

                        // Ürünler herkese açık
                        .requestMatchers(HttpMethod.GET, "/api/urunler/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/urunler/kategori/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/urunler").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/urunler/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/urunler/**").hasAuthority("ROLE_ADMIN")


                        // Kullanıcı işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/kullanicilar").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/kullanicilar/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/kullanicilar/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/kullanicilar").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/kullanicilar/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // Adres işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/adresler").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/adresler/kullanici/**").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.POST, "/api/adresler").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/api/adresler/**").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/adresler/**").hasAuthority("ROLE_USER")

                        // Favori işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/favoriler").hasAuthority("ROLE_USER")
                        .requestMatchers("/api/favoriler/**").hasAuthority("ROLE_USER")

                        // Sepet işlemleri
                        .requestMatchers("/api/sepet/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // Kargo işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/kargolar").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/kargolar/*").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/kargolar/siparis/**").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.POST, "/api/kargolar").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/kargolar/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/kargolar/**").hasAuthority("ROLE_ADMIN")

                        // Sipariş işlemleri (önce daha özel path'ler)
                                .requestMatchers(HttpMethod.GET, "/api/siparisler/kullanici/**").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.GET, "/api/siparisler").hasAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/siparisler/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/siparisler").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.POST, "/api/siparisler/tam").hasAuthority("ROLE_USER")
                                .requestMatchers(HttpMethod.PUT, "/api/siparisler/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/siparisler/**").hasAuthority("ROLE_ADMIN")

                        // Sipariş detay işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/siparis-detay/siparis/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/siparis-detay").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/siparis-detay/**").hasAuthority("ROLE_ADMIN")


                        // Ödeme işlemleri
                        .requestMatchers(HttpMethod.GET, "/api/odemeler").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/odemeler/*").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/odemeler/siparis/**").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.POST, "/api/odemeler").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/api/odemeler/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/odemeler/**").hasAuthority("ROLE_ADMIN")


                        // Yorumlar
                        .requestMatchers(HttpMethod.GET, "/api/yorumlar/urun/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/yorumlar/kullanici/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/yorumlar/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/yorumlar").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/api/yorumlar/**").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/yorumlar/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")



                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
                // demo domainin varsa buraya ekle: "https://senin-frontend-domainin"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
