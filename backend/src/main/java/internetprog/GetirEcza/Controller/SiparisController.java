package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.DTO.SiparisDTO;
import internetprog.GetirEcza.DTO.SiparisTamRequest;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Siparis;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Services.SiparisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/siparisler")
@RequiredArgsConstructor
public class SiparisController {

    private final SiparisService siparisService;
    private final KullaniciRepository kullaniciRepository;

    // ADMIN - tüm siparişleri getirir
    @GetMapping
    public ResponseEntity<List<SiparisDTO>> tumSiparisler(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<SiparisDTO> siparisler = siparisService.tumSiparisler()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(siparisler);
    }

    // Kullanıcının kendi siparişlerini getirir
    @GetMapping("/kullanici/{kullaniciId}")
    public ResponseEntity<List<SiparisDTO>> kullaniciSiparisleri(@PathVariable Long kullaniciId, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        if (!girisYapanId.equals(kullaniciId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<SiparisDTO> siparisler = siparisService.kullaniciSiparisleri(kullaniciId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(siparisler);
    }

    @PostMapping("/tam")
    public ResponseEntity<SiparisDTO> siparisVeDetayOlustur(@RequestBody SiparisTamRequest request,
                                                            Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName()); // Artık doğrudan ID geliyor

        if (!girisYapanId.equals(request.getKullaniciId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Siparis siparis = siparisService.siparisVeDetayOlustur(request);

        SiparisDTO dto = new SiparisDTO(
                siparis.getSiparisId(),
                siparis.getKullanici().getKullaniciId(),
                siparis.getSiparisTarihi(),
                siparis.getToplamTutar(),
                siparis.getDurum().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }



    // Belirli bir siparişi getir
    @GetMapping("/{id}")
    public ResponseEntity<SiparisDTO> siparisGetir(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        Kullanici kullanici = kullaniciRepository.findById(girisYapanId)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return siparisService.siparisGetir(id)
                .filter(s -> isAdmin || s.getKullanici().getKullaniciId().equals(kullanici.getKullaniciId()))
                .map(s -> ResponseEntity.ok(mapToDto(s)))
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }



    // Sipariş oluştur
    @PostMapping
    public ResponseEntity<SiparisDTO> siparisOlustur(@RequestBody SiparisDTO dto, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        if (!girisYapanId.equals(dto.getKullaniciId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Siparis kayit = siparisService.siparisOlustur(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(kayit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiparisDTO> siparisGuncelle(@PathVariable Long id,
                                                      @RequestBody SiparisDTO dto,
                                                      Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return siparisService.siparisGetir(id)
                .filter(s -> isAdmin || s.getKullanici().getKullaniciId().equals(girisYapanId))
                .map(s -> {
                    Siparis guncel = siparisService.siparisGuncelle(id, dto);
                    return ResponseEntity.ok(mapToDto(guncel));
                })
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }


    // Sipariş sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> siparisSil(@PathVariable Long id, Authentication authentication) {
        Long girisYapanId = Long.parseLong(authentication.getName());

        return siparisService.siparisGetir(id).map(s -> {
            if (s.getKullanici().getKullaniciId().equals(girisYapanId)) {
                siparisService.siparisSil(id);
                return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
            }
        }).orElse(new ResponseEntity<Void>(HttpStatus.NOT_FOUND));
    }

    // DTO mapleme
    private SiparisDTO mapToDto(Siparis s) {
        return new SiparisDTO(
                s.getSiparisId(),
                s.getKullanici().getKullaniciId(),
                s.getSiparisTarihi(),
                s.getToplamTutar(),
                s.getDurum().name()
        );
    }
}
