package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.UrunDTO;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.UrunRepository;
import internetprog.GetirEcza.Services.UrunService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/urunler")
@RequiredArgsConstructor
public class UrunController {

    private final UrunService urunService;
    private final UrunRepository urunRepository;

    @GetMapping
    public List<UrunDTO> tumUrunleriGetir() {
        return urunService.tumUrunleriGetir()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UrunDTO> urunGetir(@PathVariable Long id) {
        return urunService.urunGetir(id)
                .map(u -> ResponseEntity.ok(mapToDto(u)))
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/kategori/{kategoriId}/benzer")
    public ResponseEntity<List<UrunDTO>> benzerUrunler(@PathVariable Long kategoriId,
                                                       @RequestParam Long haricUrunId) {
        List<Urun> benzerler = urunRepository.findTop4ByKategori_KategoriIdAndUrunIdNot(kategoriId, haricUrunId);
        List<UrunDTO> dtoList = benzerler.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }



    @PostMapping
    public ResponseEntity<UrunDTO> urunOlustur(@Valid @RequestBody UrunDTO dto) {
        Urun kaydedilen = urunService.urunOlustur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(kaydedilen));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UrunDTO> urunGuncelle(@PathVariable Long id, @Valid @RequestBody UrunDTO dto) {
        Urun guncellenen = urunService.urunGuncelle(id, dto);
        return ResponseEntity.ok(mapToDto(guncellenen));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> urunSil(@PathVariable Long id) {
        urunService.urunSil(id);
        return ResponseEntity.noContent().build();
    }

    // --- Yardımcı dönüşüm metodları ---
    private UrunDTO mapToDto(Urun u) {
        return new UrunDTO(
                u.getUrunId(),
                u.getAd(),
                u.getAciklama(),
                u.getFiyat(),
                u.getStokDurumu(),
                u.getGorselUrl(),
                u.getKategori() != null ? u.getKategori().getKategoriId() : null,
                u.getKategori() != null ? u.getKategori().getAd() : "-"
        );
    }

}
