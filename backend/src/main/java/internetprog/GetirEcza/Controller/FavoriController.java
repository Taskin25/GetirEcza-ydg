package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.FavoriDTO;
import internetprog.GetirEcza.Model.Favori;
import internetprog.GetirEcza.Services.FavoriService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favoriler")
@RequiredArgsConstructor
public class FavoriController {

    private final FavoriService favoriService;

    // Sadece kendi favorilerini getir
    @GetMapping
    public ResponseEntity<List<FavoriDTO>> girisYapanFavorileri(Authentication authentication) {
        Long kullaniciId = Long.parseLong(authentication.getName());

        List<FavoriDTO> favoriler = favoriService.kullaniciFavorileri(kullaniciId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(favoriler);
    }


    // Sadece kendi adına favori ekleyebilir
    @PostMapping
    public ResponseEntity<FavoriDTO> favoriEkle(@RequestBody FavoriDTO dto, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        if (!girisYapanId.equals(dto.getKullaniciId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Favori favori = favoriService.favoriEkle(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(favori));
    }

    // Sadece kendi favorisini silebilir
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> favoriSil(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        Favori favori = favoriService.favoriGetir(id);
        if (!favori.getKullanici().getKullaniciId().equals(girisYapanId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        favoriService.favoriSil(id);
        return ResponseEntity.noContent().build();
    }

    // Sadece kendi favorisini kaldırabilir
    @DeleteMapping("/kaldir")
    public ResponseEntity<Void> favoriKaldir(@RequestParam Long kullaniciId,
                                             @RequestParam Long urunId,
                                             Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        if (!girisYapanId.equals(kullaniciId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        favoriService.favoriKaldir(kullaniciId, urunId);
        return ResponseEntity.noContent().build();
    }

    private FavoriDTO mapToDto(Favori favori) {
        return new FavoriDTO(
                favori.getFavoriId(),
                favori.getKullanici().getKullaniciId(),
                favori.getUrun().getUrunId(),
                favori.getFavoriTarihi()
        );
    }
}
