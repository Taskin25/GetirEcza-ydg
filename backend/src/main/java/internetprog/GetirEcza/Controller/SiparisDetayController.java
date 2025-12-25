package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.SiparisDetayDTO;
import internetprog.GetirEcza.Model.SiparisDetay;
import internetprog.GetirEcza.Services.SiparisDetayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/siparis-detay")
@RequiredArgsConstructor
public class SiparisDetayController {

    private final SiparisDetayService siparisDetayService;

    @GetMapping("/siparis/{siparisId}")
    public ResponseEntity<List<SiparisDetayDTO>> siparisDetaylari(@PathVariable Long siparisId,
                                                                  Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<SiparisDetay> detaylar = siparisDetayService.sipariseAitDetaylar(siparisId);

        // Eğer sipariş sahibinin ID'si giriş yapan kullanıcıya ait değilse ve admin değilse erişimi engelle
        if (!detaylar.isEmpty() &&
                !detaylar.get(0).getSiparis().getKullanici().getKullaniciId().equals(girisYapanId) &&
                !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                detaylar.stream().map(this::mapToDto).collect(Collectors.toList())
        );
    }


    @PostMapping
    public ResponseEntity<SiparisDetayDTO> detayEkle(@RequestBody SiparisDetayDTO dto) {
        SiparisDetay detay = siparisDetayService.detayEkle(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(detay));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> detaySil(@PathVariable Long id) {
        siparisDetayService.detaySil(id);
        return ResponseEntity.noContent().build();
    }

    private SiparisDetayDTO mapToDto(SiparisDetay d) {
        return new SiparisDetayDTO(
                d.getSiparisDetayId(),
                d.getSiparis().getSiparisId(),
                d.getUrun().getUrunId(),
                d.getAdet(),
                d.getBirimFiyat()
        );
    }
}
