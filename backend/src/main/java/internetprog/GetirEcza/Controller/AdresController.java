package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.AdresDTO;
import internetprog.GetirEcza.Model.Adres;
import internetprog.GetirEcza.Services.AdresService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/adresler")
@RequiredArgsConstructor
public class AdresController {

    private final AdresService adresService;

    // ADMIN: Tüm adresleri görsün
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AdresDTO> tumAdresleriGetir() {
        return adresService.tumAdresleriGetir()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ADMIN: ID'ye göre adres getirme
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<AdresDTO> adresGetir(@PathVariable Long id) {
        Adres adres = adresService.adresGetir(id);
        return ResponseEntity.ok(mapToDto(adres));
    }

    // ROLE_USER: Sadece kendi adreslerini görebilir
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/kullanici/{kullaniciId}")
    public ResponseEntity<List<AdresDTO>> kullaniciAdresleri(@PathVariable Long kullaniciId,
                                                             Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        if (!girisYapanId.equals(kullaniciId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<AdresDTO> adresler = adresService.kullaniciAdresleriniGetir(kullaniciId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(adresler);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<AdresDTO> adresOlustur(@RequestBody AdresDTO dto,
                                                 Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        if (!girisYapanId.equals(dto.getKullaniciId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Adres kaydedilen = adresService.adresOlustur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(kaydedilen));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<AdresDTO> adresGuncelle(@PathVariable Long id,
                                                  @RequestBody AdresDTO dto,
                                                  Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        Adres mevcut = adresService.adresGetir(id);
        if (!mevcut.getKullanici().getKullaniciId().equals(girisYapanId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Adres guncellenen = adresService.adresGuncelle(id, dto);
        return ResponseEntity.ok(mapToDto(guncellenen));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> adresSil(@PathVariable Long id,
                                         Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        Adres mevcut = adresService.adresGetir(id);
        if (!mevcut.getKullanici().getKullaniciId().equals(girisYapanId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        adresService.adresSil(id);
        return ResponseEntity.noContent().build();
    }

    private AdresDTO mapToDto(Adres adres) {
        return new AdresDTO(
                adres.getAdresId(),
                adres.getAdresDetay(),
                adres.getKullanici().getKullaniciId()
        );
    }
}
