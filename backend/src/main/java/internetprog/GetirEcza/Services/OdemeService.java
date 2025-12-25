package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.OdemeDTO;
import internetprog.GetirEcza.Enum.OdemeDurumu;
import internetprog.GetirEcza.Enum.OdemeYontemi;
import internetprog.GetirEcza.Model.Odeme;
import internetprog.GetirEcza.Model.Siparis;
import internetprog.GetirEcza.Model.SiparisDetay;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.SiparisDetayRepository;
import internetprog.GetirEcza.Repository.UrunRepository;

import internetprog.GetirEcza.Repository.OdemeRepository;
import internetprog.GetirEcza.Repository.SiparisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OdemeService {

    private final OdemeRepository odemeRepository;
    private final SiparisRepository siparisRepository;
    private final KullaniciRepository kullaniciRepository;
    private final SiparisDetayRepository siparisDetayRepository;
    private final UrunRepository urunRepository;


    public List<Odeme> tumOdemeler() {
        return odemeRepository.findAll();
    }

    public Optional<Odeme> odemeGetir(Long id) {
        return odemeRepository.findById(id);
    }

    public Optional<Odeme> siparisOdemesiGetir(Long siparisId) {
        return odemeRepository.findBySiparis_SiparisId(siparisId);
    }

    public Odeme odemeOlustur(OdemeDTO dto) {
        Siparis siparis = siparisRepository.findById(dto.getSiparisId())
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));

        Odeme odeme = new Odeme();
        odeme.setSiparis(siparis);
        odeme.setOdemeTutari(dto.getOdemeTutari());

        odeme.setOdemeTarihi(
                dto.getOdemeTarihi() != null ? dto.getOdemeTarihi() : LocalDateTime.now()
        );

        try {
            odeme.setOdemeYontemi(OdemeYontemi.valueOf(dto.getOdemeYontemi()));
        } catch (Exception e) {
            odeme.setOdemeYontemi(OdemeYontemi.KREDIKARTI); // varsayılan
        }

        try {
            odeme.setOdemeDurumu(OdemeDurumu.valueOf(dto.getOdemeDurumu()));
        } catch (Exception e) {
            odeme.setOdemeDurumu(OdemeDurumu.ODEME_ALINDI); // varsayılan
        }


        if (odeme.getOdemeDurumu() == OdemeDurumu.ODEME_ALINDI) {
            stokGuncelle(siparis.getSiparisId());
        }

        return odemeRepository.save(odeme);
    }


    public Odeme odemeGuncelle(Long id, OdemeDTO dto) {
        Odeme odeme = odemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ödeme bulunamadı"));

        odeme.setOdemeTutari(dto.getOdemeTutari());
        odeme.setOdemeTarihi(dto.getOdemeTarihi());
        odeme.setOdemeYontemi(OdemeYontemi.valueOf(dto.getOdemeYontemi()));
        odeme.setOdemeDurumu(OdemeDurumu.valueOf(dto.getOdemeDurumu()));

        return odemeRepository.save(odeme);
    }

    // Sipariş gerçekten bu kullanıcıya mı ait?
    public boolean kullaniciSipariseAitMi(Long siparisId, Long kullaniciId) {
        return siparisRepository.findById(siparisId)
                .map(s -> s.getKullanici().getKullaniciId().equals(kullaniciId))
                .orElse(false);
    }

    public Siparis findSiparisById(Long id) {
        return siparisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));
    }

    public void stokGuncelle(Long siparisId) {
        List<SiparisDetay> detaylar = siparisDetayRepository.findBySiparis_SiparisId(siparisId);

        for (SiparisDetay detay : detaylar) {
            Urun urun = detay.getUrun();
            int yeniStok = urun.getStokDurumu() - detay.getAdet();

            if (yeniStok < 0) {
                throw new RuntimeException("Stok yetersiz: " + urun.getAd());
            }

            urun.setStokDurumu(yeniStok);
            urunRepository.save(urun);
        }
    }


    // Ödeme gerçekten bu kullanıcıya mı ait?
    public boolean odemeKullaniciyaAitMi(Long odemeId, Long kullaniciId) {
        return odemeRepository.findById(odemeId)
                .map(o -> o.getSiparis().getKullanici().getKullaniciId().equals(kullaniciId))
                .orElse(false);
    }

    // Email'e göre kullanıcı ID'sini getir
    public Long kullaniciIdGetir(String idStr) {
        try {
            return Long.parseLong(idStr);
        } catch (Exception e) {
            throw new RuntimeException("Geçersiz kullanıcı ID formatı");
        }
    }


    public void odemeSil(Long id) {
        odemeRepository.deleteById(id);
    }
}
