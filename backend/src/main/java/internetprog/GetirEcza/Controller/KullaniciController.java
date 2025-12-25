package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.KullaniciDTO;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Services.KullaniciService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kullanicilar")
@RequiredArgsConstructor
public class KullaniciController {

    private final KullaniciService kullaniciService;


    // Tüm kullanıcıları getir (Sadece admin)
    @GetMapping
    public List<KullaniciDTO> tumKullanicilariGetir() {
        return kullaniciService.tumKullanicilariGetir()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ID ile kullanıcı getir (Kendisi veya admin)
    @GetMapping("/{id}")
    public ResponseEntity<KullaniciDTO> kullaniciGetir(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!girisYapanId.equals(id) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return kullaniciService.kullaniciGetir(id)
                .map(k -> ResponseEntity.ok(mapToDto(k)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Yeni kullanıcı oluştur (Sadece admin)
    @PostMapping
    public ResponseEntity<KullaniciDTO> kullaniciOlustur(@RequestBody KullaniciDTO dto) {
        Kullanici yeni = mapToEntity(dto);
        Kullanici kaydedilen = kullaniciService.kullaniciOlustur(yeni);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(kaydedilen));
    }

    // Kullanıcı güncelle (Kendisi veya admin)
    
    @PutMapping("/{id}")
    public ResponseEntity<KullaniciDTO> kullaniciGuncelle(@PathVariable Long id,
                                                          @RequestBody KullaniciDTO dto,
                                                          Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!girisYapanId.equals(id) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Kullanici guncel = mapToEntity(dto);
        Kullanici guncellenmis = kullaniciService.kullaniciGuncelle(id, guncel);
        return ResponseEntity.ok(mapToDto(guncellenmis));
    }

    // Kullanıcı sil (Kendisi veya admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> kullaniciSil(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!girisYapanId.equals(id) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        kullaniciService.kullaniciSil(id);
        return ResponseEntity.noContent().build();
    }


    private KullaniciDTO mapToDto(Kullanici k) {
        return new KullaniciDTO(
                k.getKullaniciId(),
                k.getAd(),
                k.getSoyad(),
                k.getEmail(),
                k.getTelefon(),
                k.getKayitTarihi()
        );
    }

    private Kullanici mapToEntity(KullaniciDTO dto) {
        Kullanici k = new Kullanici();
        k.setKullaniciId(dto.getId());
        k.setAd(dto.getAd());
        k.setSoyad(dto.getSoyad());
        k.setEmail(dto.getEmail());
        k.setTelefon(dto.getTelefon());

        return k;
    }
}
