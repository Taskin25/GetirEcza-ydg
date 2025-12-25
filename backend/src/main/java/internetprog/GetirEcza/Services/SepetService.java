package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Sepet;
import internetprog.GetirEcza.Model.SepetUrun;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.SepetRepository;
import internetprog.GetirEcza.Repository.SepetUrunRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SepetService {

    private final SepetRepository sepetRepository;
    private final SepetUrunRepository sepetUrunRepository;
    private final KullaniciRepository kullaniciRepository;
    private final UrunRepository urunRepository;

    public Sepet getOrCreateSepet(Long kullaniciId) {
        return sepetRepository.findByKullanici_KullaniciId(kullaniciId)
                .orElseGet(() -> {
                    Kullanici k = kullaniciRepository.findById(kullaniciId)
                            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
                    Sepet sepet = new Sepet();
                    sepet.setKullanici(k);
                    return sepetRepository.save(sepet);
                });
    }

    public List<SepetUrun> kullaniciSepeti(Long kullaniciId) {
        Sepet sepet = getOrCreateSepet(kullaniciId);
        return sepetUrunRepository.findBySepet_Id(sepet.getId());
    }

    public void sepeteUrunEkle(Long kullaniciId, Long urunId, int adet) {
        Sepet sepet = getOrCreateSepet(kullaniciId);
        SepetUrun urun = sepetUrunRepository.findBySepet_IdAndUrun_UrunId(sepet.getId(), urunId)
                .orElseGet(() -> {
                    SepetUrun su = new SepetUrun();
                    su.setSepet(sepet);
                    su.setUrun(urunRepository.findById(urunId)
                            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı")));
                    su.setAdet(0);
                    return su;
                });

        urun.setAdet(urun.getAdet() + adet);
        sepetUrunRepository.save(urun);
    }

    public void urunAdetGuncelle(Long sepetUrunId, int yeniAdet) {
        SepetUrun su = sepetUrunRepository.findById(sepetUrunId)
                .orElseThrow(() -> new RuntimeException("Ürün sepet içinde bulunamadı"));
        su.setAdet(yeniAdet);
        sepetUrunRepository.save(su);
    }

    public void urunSil(Long sepetUrunId) {
        sepetUrunRepository.deleteById(sepetUrunId);
    }

    public void sepetTemizle(Long kullaniciId) {
        Sepet sepet = getOrCreateSepet(kullaniciId);
        List<SepetUrun> urunler = sepetUrunRepository.findBySepet_Id(sepet.getId());
        sepetUrunRepository.deleteAll(urunler);
    }

    public boolean urunKullaniciyaAitMi(Long sepetUrunId, Long kullaniciId) {
        return sepetUrunRepository.findById(sepetUrunId)
                .map(su -> su.getSepet().getKullanici().getKullaniciId().equals(kullaniciId))
                .orElse(false);
    }
}