package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.AdresDTO;
import internetprog.GetirEcza.Model.Adres;
import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Repository.AdresRepository;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdresService {

    private final AdresRepository adresRepository;
    private final KullaniciRepository kullaniciRepository;

    public List<Adres> tumAdresleriGetir() {
        return adresRepository.findAll();
    }

    public Adres adresGetir(Long id) {
        return adresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı: " + id));
    }
    public List<Adres> kullaniciAdresleriniGetir(Long kullaniciId) {
        return adresRepository.findByKullanici_KullaniciId(kullaniciId);
    }

    public Adres adresOlustur(AdresDTO dto) {
        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Adres adres = new Adres();
        adres.setAdresDetay(dto.getAdresDetay());
        adres.setKullanici(kullanici);

        return adresRepository.save(adres);
    }


    public Adres adresGuncelle(Long id, AdresDTO dto) {
        Adres adres = adresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı"));

        Kullanici kullanici = kullaniciRepository.findById(dto.getKullaniciId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        adres.setAdresDetay(dto.getAdresDetay());
        adres.setKullanici(kullanici);

        return adresRepository.save(adres);
    }

    public void adresSil(Long id) {
        adresRepository.deleteById(id);
    }
}


