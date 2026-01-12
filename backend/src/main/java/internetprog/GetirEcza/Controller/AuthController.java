package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.LoginRequest;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final KullaniciRepository kullaniciRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Kullanici kullanici) {
        if (kullaniciRepository.findByEmail(kullanici.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Bu e-posta ile kayıtlı kullanıcı zaten var.");
        }

        kullanici.setSifre(passwordEncoder.encode(kullanici.getSifre()));

        // ROL düzeltmesi
        String rol = kullanici.getRol();
        if (rol == null || rol.trim().isEmpty()) {
            kullanici.setRol("ROLE_USER");
        } else if (rol.equalsIgnoreCase("admin")) {
            kullanici.setRol("ROLE_ADMIN");
        } else {
            kullanici.setRol("ROLE_USER");
        }

        kullanici.setKayitTarihi(LocalDateTime.now());


        return ResponseEntity.ok(kullaniciRepository.save(kullanici));
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("LOGIN HIT: " + request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSifre())
        );

        Kullanici kullanici = kullaniciRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        UserDetails userDetails = new User(
                kullanici.getEmail(),
                kullanici.getSifre(),
                Collections.singletonList(new SimpleGrantedAuthority(kullanici.getRol()))
        );

        String token = jwtUtil.generateToken(userDetails, kullanici.getKullaniciId());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", kullanici.getRol(),
                        "kullaniciId", kullanici.getKullaniciId(),
                        "email", kullanici.getEmail()
                )
        );
    }

}