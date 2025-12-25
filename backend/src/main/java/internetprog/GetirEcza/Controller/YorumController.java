package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.YorumDTO;
import internetprog.GetirEcza.Model.Yorum;
import internetprog.GetirEcza.Services.YorumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/yorumlar")
@RequiredArgsConstructor
public class YorumController {

    private final YorumService yorumService;

    // Belirli bir ürüne ait yorumları getir
    @GetMapping("/urun/{urunId}")
    public List<YorumDTO> urunYorumlari(@PathVariable Long urunId) {
        return yorumService.urunYorumlari(urunId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Belirli kullanıcıya ait yorumları getir
    @GetMapping("/kullanici/{kullaniciId}")
    public List<YorumDTO> kullaniciYorumlari(@PathVariable Long kullaniciId) {
        return yorumService.kullaniciYorumlari(kullaniciId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Belirli bir yorumu getir
    @GetMapping("/{id}")
    public ResponseEntity<YorumDTO> yorumGetir(@PathVariable Long id) {
        return yorumService.yorumGetir(id)
                .map(y -> ResponseEntity.ok(mapToDto(y)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Yeni yorum ekle
    @PostMapping
    public ResponseEntity<YorumDTO> yorumEkle(@RequestBody YorumDTO dto, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        dto.setKullaniciId(girisYapanId); // dışarıdan gelen ID yerine JWT'den alınan ID kullan

        Yorum yeni = yorumService.yorumEkle(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(yeni));
    }


    // Yorumu güncelle
    @PutMapping("/{id}")
    public ResponseEntity<YorumDTO> yorumGuncelle(@PathVariable Long id,
                                                  @RequestBody YorumDTO dto,
                                                  Authentication auth) {
        Long girisYapanId = Long.parseLong(auth.getName());
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return yorumService.yorumGetir(id)
                .filter(yorum -> yorum.getKullanici().getKullaniciId().equals(girisYapanId) || isAdmin)
                .map(yorum -> {
                    Yorum guncel = yorumService.yorumGuncelle(id, dto);
                    return ResponseEntity.ok(mapToDto(guncel));
                })
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }




    // Yorumu sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> yorumSil(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return yorumService.yorumGetir(id)
                .filter(yorum -> yorum.getKullanici().getKullaniciId().equals(girisYapanId) || isAdmin)
                .map(yorum -> {
                    yorumService.yorumSil(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.FORBIDDEN));
    }

    // DTO dönüşümü
    private YorumDTO mapToDto(Yorum y) {
        String adSoyad = y.getKullanici().getAd() + " " + y.getKullanici().getSoyad();

        return
                new YorumDTO(
                y.getYorumId(),
                y.getUrun().getUrunId(),
                y.getKullanici().getKullaniciId(),
                adSoyad,
                y.getIcerik(),
                y.getPuan(),
                y.getTarih()
        );
    }
}
