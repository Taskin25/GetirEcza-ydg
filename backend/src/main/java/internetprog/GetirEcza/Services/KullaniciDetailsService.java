package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class KullaniciDetailsService implements UserDetailsService {

    private final KullaniciRepository kullaniciRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Kullanici kullanici = kullaniciRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));

        String rol = kullanici.getRol();
        if (rol == null || rol.trim().isEmpty()) {
            throw new UsernameNotFoundException("Kullanıcının rolü tanımlı değil.");
        }

        return new User(
                kullanici.getEmail(),
                kullanici.getSifre(),
                Collections.singletonList(new SimpleGrantedAuthority(kullanici.getRol()))
        );
    }
}
