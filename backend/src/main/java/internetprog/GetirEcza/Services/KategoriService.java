package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.KategoriDTO;
import internetprog.GetirEcza.Model.Kategori;
import internetprog.GetirEcza.Repository.KategoriRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KategoriService {

    private final KategoriRepository kategoriRepository;

    public List<Kategori> tumKategoriler() {
        return kategoriRepository.findByAktifTrue();
    }

    public Optional<Kategori> kategoriGetir(Long id) {
        return kategoriRepository.findById(id);
    }

    public Kategori kategoriOlustur(KategoriDTO dto) {
        Kategori kategori = new Kategori();
        kategori.setAd(dto.getAd());
        kategori.setGorselUrl(dto.getGorselUrl());
        kategori.setAciklama(dto.getAciklama());
        return kategoriRepository.save(kategori);
    }

    public Kategori kategoriGuncelle(Long id, KategoriDTO dto) {
        Kategori kategori = kategoriRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategori ID ile bulunamadı: " + id));

        kategori.setAd(dto.getAd());
        kategori.setGorselUrl(dto.getGorselUrl());
        kategori.setAciklama(dto.getAciklama());
        return kategoriRepository.save(kategori);
    }

    public void kategoriSil(Long id) {
        Kategori kategori = kategoriRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı: " + id));
        kategori.setAktif(false);
        kategoriRepository.save(kategori);
    }

}
