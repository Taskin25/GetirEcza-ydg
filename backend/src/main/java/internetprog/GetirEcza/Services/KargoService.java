package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.KargoDTO;
import internetprog.GetirEcza.Enum.KargoDurum;
import internetprog.GetirEcza.Model.Kargo;
import internetprog.GetirEcza.Model.Siparis;
import internetprog.GetirEcza.Repository.KargoRepository;
import internetprog.GetirEcza.Repository.SiparisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KargoService {

    private final KargoRepository kargoRepository;
    private final SiparisRepository siparisRepository;

    public List<Kargo> tumKargolar() {
        return kargoRepository.findAll();
    }

    public Optional<Kargo> kargoGetir(Long id) {
        return kargoRepository.findById(id);
    }

    public Optional<Kargo> siparisKargosunuGetir(Long siparisId) {
        return kargoRepository.findBySiparis_SiparisId(siparisId);
    }

    public Kargo kargoOlustur(KargoDTO dto) {
        Siparis siparis = siparisRepository.findById(dto.getSiparisId())
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));

        Kargo kargo = new Kargo();
        kargo.setSiparis(siparis);
        kargo.setKargoSirketi(dto.getKargoSirketi());
        kargo.setTakipNumarasi(dto.getTakipNumarasi());
        kargo.setDurum(KargoDurum.valueOf(dto.getDurum()));
        kargo.setGonderimTarihi(dto.getGonderimTarihi());
        kargo.setTeslimTarihi(dto.getTeslimTarihi());

        return kargoRepository.save(kargo);
    }

    public Kargo kargoGuncelle(Long id, KargoDTO dto) {
        Kargo kargo = kargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kargo bulunamadı"));

        kargo.setKargoSirketi(dto.getKargoSirketi());
        kargo.setTakipNumarasi(dto.getTakipNumarasi());
        kargo.setDurum(KargoDurum.valueOf(dto.getDurum()));
        kargo.setGonderimTarihi(dto.getGonderimTarihi());
        kargo.setTeslimTarihi(dto.getTeslimTarihi());

        return kargoRepository.save(kargo);
    }

    public void kargoSil(Long id) {
        kargoRepository.deleteById(id);
    }
}
