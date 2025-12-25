package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.OdemeDTO;
import internetprog.GetirEcza.Model.Odeme;
import internetprog.GetirEcza.Services.OdemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/odemeler")
@RequiredArgsConstructor
public class OdemeController {

    private final OdemeService odemeService;

    @GetMapping
    public List<OdemeDTO> tumOdemeler() {
        return odemeService.tumOdemeler()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OdemeDTO> odemeGetir(@PathVariable Long id) {
        return odemeService.odemeGetir(id)
                .map(o -> ResponseEntity.ok(mapToDto(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/siparis/{siparisId}")
    public ResponseEntity<OdemeDTO> siparisOdemesi(@PathVariable Long siparisId, Authentication authentication) {
        Long girisYapanId = odemeService.kullaniciIdGetir(authentication.getName());

        return odemeService.siparisOdemesiGetir(siparisId)
                .filter(o -> o.getSiparis().getKullanici().getKullaniciId().equals(girisYapanId))
                .map(o -> ResponseEntity.ok(mapToDto(o)))
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PostMapping
    public ResponseEntity<OdemeDTO> odemeOlustur(@RequestBody OdemeDTO dto, Authentication authentication) {
        Long girisYapanId = odemeService.kullaniciIdGetir(authentication.getName());

        if (!odemeService.kullaniciSipariseAitMi(dto.getSiparisId(), girisYapanId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Odeme o = odemeService.odemeOlustur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(o));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OdemeDTO> odemeGuncelle(@PathVariable Long id, @RequestBody OdemeDTO dto) {
        Odeme o = odemeService.odemeGuncelle(id, dto);
        return ResponseEntity.ok(mapToDto(o));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> odemeSil(@PathVariable Long id) {
        odemeService.odemeSil(id);
        return ResponseEntity.noContent().build();
    }

    private OdemeDTO mapToDto(Odeme o) {
        return new OdemeDTO(
                o.getOdemeId(),
                o.getSiparis().getSiparisId(),
                o.getOdemeTutari(),
                o.getOdemeTarihi(),
                o.getOdemeYontemi().name(),
                o.getOdemeDurumu().name()
        );
    }
}
