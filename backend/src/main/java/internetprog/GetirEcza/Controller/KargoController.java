package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.KargoDTO;
import internetprog.GetirEcza.Model.Kargo;
import internetprog.GetirEcza.Services.KargoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/kargolar")
@RequiredArgsConstructor
public class KargoController {

    private final KargoService kargoService;

    // SADECE ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<KargoDTO> tumKargolar() {
        return kargoService.tumKargolar()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // SADECE ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<KargoDTO> kargoGetir(@PathVariable Long id) {
        return kargoService.kargoGetir(id)
                .map(k -> ResponseEntity.ok(mapToDto(k)))
                .orElse(ResponseEntity.notFound().build());
    }

    // SADECE KENDİSİ
    @GetMapping("/siparis/{siparisId}")
    public ResponseEntity<KargoDTO> siparisKargosunuGetir(@PathVariable Long siparisId,
                                                          Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        return kargoService.siparisKargosunuGetir(siparisId)
                .filter(kargo -> kargo.getSiparis().getKullanici().getKullaniciId().equals(girisYapanId))
                .map(k -> ResponseEntity.ok(mapToDto(k)))
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    // SADECE ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<KargoDTO> kargoOlustur(@RequestBody KargoDTO dto) {
        Kargo k = kargoService.kargoOlustur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(k));
    }

    // SADECE ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<KargoDTO> kargoGuncelle(@PathVariable Long id, @RequestBody KargoDTO dto) {
        Kargo k = kargoService.kargoGuncelle(id, dto);
        return ResponseEntity.ok(mapToDto(k));
    }

    // SADECE ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> kargoSil(@PathVariable Long id) {
        kargoService.kargoSil(id);
        return ResponseEntity.noContent().build();
    }

    private KargoDTO mapToDto(Kargo k) {
        return new KargoDTO(
                k.getKargoId(),
                k.getSiparis().getSiparisId(),
                k.getKargoSirketi(),
                k.getTakipNumarasi(),
                k.getDurum().name(),
                k.getGonderimTarihi(),
                k.getTeslimTarihi()
        );
    }
}