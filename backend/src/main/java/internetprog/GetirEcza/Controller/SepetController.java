package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.SepetDTO;
import internetprog.GetirEcza.Model.SepetUrun;
import internetprog.GetirEcza.Services.SepetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sepet")
@RequiredArgsConstructor
public class SepetController {

    private final SepetService sepetService;

    @GetMapping
    public ResponseEntity<List<SepetDTO>> kullaniciSepeti(Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        List<SepetDTO> sepet = sepetService.kullaniciSepeti(girisYapanId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(sepet);
    }

    @PostMapping("/ekle")
    public ResponseEntity<Void> sepeteEkle(@RequestParam Long urunId,
                                           @RequestParam int adet,
                                           Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        sepetService.sepeteUrunEkle(girisYapanId, urunId, adet);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/guncelle/{sepetUrunId}")
    public ResponseEntity<Void> urunAdetGuncelle(@PathVariable Long sepetUrunId,
                                                 @RequestParam int adet,
                                                 Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        if (!sepetService.urunKullaniciyaAitMi(sepetUrunId, girisYapanId)) {
            return ResponseEntity.status(403).build();
        }

        sepetService.urunAdetGuncelle(sepetUrunId, adet);
        return ResponseEntity.ok().build();
    } 

    @DeleteMapping("/sil/{sepetUrunId}")
    public ResponseEntity<Void> urunSil(@PathVariable Long sepetUrunId,
                                        Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        if (!sepetService.urunKullaniciyaAitMi(sepetUrunId, girisYapanId)) {
            return ResponseEntity.status(403).build();
        }

        sepetService.urunSil(sepetUrunId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/temizle")
    public ResponseEntity<Void> sepetiTemizle(Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        sepetService.sepetTemizle(girisYapanId);
        return ResponseEntity.noContent().build();
    }

    // DTO Mapping metodu
    private SepetDTO mapToDTO(SepetUrun su) {
        return new SepetDTO(
                su.getId(),
                su.getSepet().getKullanici().getKullaniciId(),
                su.getUrun().getUrunId(),
                su.getAdet()
        );
    }
}
