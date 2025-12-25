package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.UrunDTO;
import internetprog.GetirEcza.Model.Kategori;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KategoriRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UrunService {

    private final UrunRepository urunRepository;
    private final KategoriRepository kategoriRepository;

    public List<Urun> tumUrunleriGetir() {
        return urunRepository.findByAktifTrue();
    }
    public Optional<Urun> urunGetir(Long id) {
        return urunRepository.findById(id);
    }

    public Urun urunOlustur(UrunDTO dto) {
        Kategori kategori = kategoriRepository.findById(dto.getKategoriId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

        Urun urun = new Urun();
        urun.setAd(dto.getAd());
        urun.setAciklama(dto.getAciklama());
        urun.setFiyat(dto.getFiyat());
        urun.setStokDurumu(dto.getStokDurumu());
        urun.setGorselUrl(dto.getGorselUrl());
        urun.setKategori(kategori);

        return urunRepository.save(urun);
    }

    public Urun urunGuncelle(Long id, UrunDTO dto) {
        Urun urun = urunRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        Kategori kategori = kategoriRepository.findById(dto.getKategoriId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

        urun.setAd(dto.getAd());
        urun.setAciklama(dto.getAciklama());
        urun.setFiyat(dto.getFiyat());
        urun.setStokDurumu(dto.getStokDurumu());
        urun.setGorselUrl(dto.getGorselUrl());
        urun.setKategori(kategori);

        return urunRepository.save(urun);
    }

    public void urunSil(Long id) {
        Urun urun = urunRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));
        urun.setAktif(false);
        urunRepository.save(urun);
    }}
