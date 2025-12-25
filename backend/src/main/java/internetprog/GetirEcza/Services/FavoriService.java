package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.FavoriDTO;
import internetprog.GetirEcza.Model.Favori;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.FavoriRepository;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriService {

    private final FavoriRepository favoriRepository;
    private final KullaniciRepository kullaniciRepository;
    private final UrunRepository urunRepository;

    public List<Favori> kullaniciFavorileri(Long kullaniciId) {
        return favoriRepository.findByKullanici_KullaniciId(kullaniciId);
    }

    public Favori favoriEkle(FavoriDTO dto) {
        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Urun urun = urunRepository.findById(dto.getUrunId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        // Aynı favori tekrar eklenmesin
        favoriRepository.findByKullanici_KullaniciIdAndUrun_UrunId(dto.getKullaniciId(), dto.getUrunId())
                .ifPresent(f -> { throw new RuntimeException("Zaten favorilere eklenmiş."); });

        Favori favori = new Favori();
        favori.setKullanici(kullanici);
        favori.setUrun(urun);
        favori.setFavoriTarihi(LocalDateTime.now());

        return favoriRepository.save(favori);
    }

    public void favoriSil(Long id) {
        favoriRepository.deleteById(id);
    }
    public Favori favoriGetir(Long id) {
        return favoriRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favori bulunamadı"));
    }


    public void favoriKaldir(Long kullaniciId, Long urunId) {
        Favori favori = favoriRepository.findByKullanici_KullaniciIdAndUrun_UrunId(kullaniciId, urunId)
                .orElseThrow(() -> new RuntimeException("Favori bulunamadı"));
        favoriRepository.delete(favori);
    }
}
