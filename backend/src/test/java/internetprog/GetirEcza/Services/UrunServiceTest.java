package internetprog.GetirEcza.Services;

import internetprog.GetirEcza.DTO.UrunDTO;
import internetprog.GetirEcza.Model.Kategori;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KategoriRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrunServiceTest {

    @Mock
    UrunRepository urunRepository;

    @Mock
    KategoriRepository kategoriRepository;

    @InjectMocks
    UrunService urunService;

    @Test
    void tumUrunleriGetir_findByAktifTrueCagrilir_veListeDoner() {
        Urun u1 = new Urun();
        Urun u2 = new Urun();
        when(urunRepository.findByAktifTrue()).thenReturn(List.of(u1, u2));

        List<Urun> result = urunService.tumUrunleriGetir();

        assertEquals(2, result.size());
        verify(urunRepository, times(1)).findByAktifTrue();
    }

    @Test
    void urunOlustur_kategoriVarsa_kaydedipDoner() {
        // dto (SENİN DTO İMZANA UYGUN: BigDecimal + Integer stokDurumu)
        UrunDTO dto = new UrunDTO(
                null,
                "Parol",
                "Ağrı kesici",
                BigDecimal.valueOf(100),
                1,
                "img",
                1L,
                null
        );

        Kategori kat = new Kategori();
        when(kategoriRepository.findById(1L)).thenReturn(Optional.of(kat));

        when(urunRepository.save(any(Urun.class))).thenAnswer(inv -> inv.getArgument(0));

        Urun saved = urunService.urunOlustur(dto);

        assertNotNull(saved);
        assertEquals("Parol", saved.getAd());
        assertEquals("Ağrı kesici", saved.getAciklama());
        assertEquals(BigDecimal.valueOf(100), saved.getFiyat());
        assertEquals(1, saved.getStokDurumu());
        assertEquals("img", saved.getGorselUrl());
        assertEquals(kat, saved.getKategori());

        verify(kategoriRepository, times(1)).findById(1L);
        verify(urunRepository, times(1)).save(any(Urun.class));
    }

    @Test
    void urunOlustur_kategoriYoksa_exceptionFirlatir() {
        // dto'yu doğru imzayla oluştur
        UrunDTO dto = new UrunDTO(
                null,
                "X",
                "Y",
                BigDecimal.valueOf(10),
                1,
                "",
                999L,
                null
        );

        when(kategoriRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> urunService.urunOlustur(dto));
        assertTrue(ex.getMessage().toLowerCase().contains("kategori"));

        verify(urunRepository, never()).save(any());
    }

    @Test
    void urunSil_urunBulunur_aktifFalseYapipKaydeder() {
        Urun u = new Urun();

        // SENDE setAktif(Boolean) bekliyor -> boolean veriyoruz
        u.setAktif(true);

        when(urunRepository.findById(5L)).thenReturn(Optional.of(u));
        when(urunRepository.save(any(Urun.class))).thenAnswer(inv -> inv.getArgument(0));

        urunService.urunSil(5L);

        // aktif alanının getter'ı büyük ihtimalle getAktif() (Boolean)
        assertEquals(Boolean.FALSE, u.getAktif());

        verify(urunRepository, times(1)).findById(5L);
        verify(urunRepository, times(1)).save(u);
    }
}
