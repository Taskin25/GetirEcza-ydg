package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.SiparisDTO;
import internetprog.GetirEcza.DTO.SiparisDetayRequest;
import internetprog.GetirEcza.DTO.SiparisOlusturmaRequest;
import internetprog.GetirEcza.DTO.SiparisTamRequest;
import internetprog.GetirEcza.Enum.SiparisDurum;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Siparis;
import internetprog.GetirEcza.Model.SiparisDetay;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.SiparisDetayRepository;
import internetprog.GetirEcza.Repository.SiparisRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiparisService {

    private final SiparisRepository siparisRepository;
    private final KullaniciRepository kullaniciRepository;
    private final UrunRepository urunRepository;
    private final SiparisDetayRepository siparisDetayRepository;

    public List<Siparis> tumSiparisler() {
        return siparisRepository.findAll();
    }

    public List<Siparis> kullaniciSiparisleri(Long kullaniciId) {
        return siparisRepository.findByKullanici_KullaniciId(kullaniciId);
    }

    public Optional<Siparis> siparisGetir(Long id) {
        return siparisRepository.findById(id);
    }

    public Siparis siparisOlustur(SiparisDTO dto) {
        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Siparis siparis = new Siparis();
        siparis.setKullanici(kullanici);
        siparis.setSiparisTarihi(dto.getSiparisTarihi());
        siparis.setToplamTutar(dto.getToplamTutar());
        siparis.setDurum(SiparisDurum.valueOf(dto.getDurum()));

        return siparisRepository.save(siparis);
    }




    public Siparis siparisVeDetayOlustur(SiparisTamRequest request) {
        Siparis siparis = new Siparis();
        siparis.setKullanici(kullaniciRepository.findById(request.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı")));
        siparis.setSiparisTarihi(request.getSiparisTarihi() != null ? request.getSiparisTarihi() : LocalDateTime.now());

        List<SiparisDetay> detayListesi = new java.util.ArrayList<>();
        BigDecimal toplamTutar = BigDecimal.ZERO;

        for (SiparisDetayRequest detayDto : request.getDetaylar()) {
            Urun urun = urunRepository.findById(detayDto.getUrunId())
                    .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

            SiparisDetay detay = new SiparisDetay();
            detay.setSiparis(siparis);
            detay.setUrun(urun);
            detay.setAdet(detayDto.getAdet());

            // 🔧 double → BigDecimal dönüşümü
            BigDecimal birimFiyat = BigDecimal.valueOf(detayDto.getBirimFiyat());
            detay.setBirimFiyat(birimFiyat);

            BigDecimal adetBigDecimal = BigDecimal.valueOf(detayDto.getAdet());
            toplamTutar = toplamTutar.add(birimFiyat.multiply(adetBigDecimal));

            detayListesi.add(detay);
        }

        siparis.setToplamTutar(toplamTutar);
        siparis.setDurum(SiparisDurum.HAZIRLANIYOR);
        Siparis kayitliSiparis = siparisRepository.save(siparis);

        for (SiparisDetay detay : detayListesi) {
            detay.setSiparis(kayitliSiparis);
            siparisDetayRepository.save(detay);
        }

        return kayitliSiparis;
    }



    public Siparis siparisGuncelle(Long id, SiparisDTO dto) {
        Siparis siparis = siparisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));

        siparis.setToplamTutar(dto.getToplamTutar());
        siparis.setDurum(SiparisDurum.valueOf(dto.getDurum()));

        return siparisRepository.save(siparis);
    }

    public void siparisSil(Long id) {
        siparisRepository.deleteById(id);
    }
}
