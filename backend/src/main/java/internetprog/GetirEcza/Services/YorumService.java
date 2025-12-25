package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.YorumDTO;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Model.Yorum;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import internetprog.GetirEcza.Repository.YorumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class YorumService {

    private final YorumRepository yorumRepository;
    private final KullaniciRepository kullaniciRepository;
    private final UrunRepository urunRepository;

    public List<Yorum> urunYorumlari(Long urunId) {
        return yorumRepository.findByUrun_UrunId(urunId);
    }

    public List<Yorum> kullaniciYorumlari(Long kullaniciId) {
        return yorumRepository.findByKullanici_KullaniciId(kullaniciId);
    }

    public Optional<Yorum> yorumGetir(Long id) {
        return yorumRepository.findById(id);
    }

    public Yorum yorumEkle(YorumDTO dto) {
        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Urun urun = urunRepository.findById(dto.getUrunId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        Yorum yorum = new Yorum();
        yorum.setKullanici(kullanici);
        yorum.setUrun(urun);
        yorum.setIcerik(dto.getIcerik());
        yorum.setPuan(dto.getPuan());
        yorum.setTarih(dto.getTarih() != null ? dto.getTarih() : LocalDateTime.now());

        return yorumRepository.save(yorum);
    }
    public Yorum yorumGuncelle(Long id, YorumDTO dto) {
        Yorum yorum = yorumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));

        // URUN ve KULLANICI ilişkileri eksikse null kaydedilir! Bu yüzden tekrar set edilmeli
        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Urun urun = urunRepository.findById(dto.getUrunId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        yorum.setIcerik(dto.getIcerik());
        yorum.setKullanici(kullanici); // 🔴 ÖNEMLİ: ilişkileri tekrar set et
        yorum.setUrun(urun);
        yorum.setTarih(LocalDateTime.now());

        return yorumRepository.save(yorum);
    }



    public void yorumSil(Long id) {
        yorumRepository.deleteById(id);
    }
}
