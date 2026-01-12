package internetprog.GetirEcza.Config;

import internetprog.GetirEcza.Model.Kullanici;
import internetprog.GetirEcza.Model.Kategori;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KullaniciRepository;
import internetprog.GetirEcza.Repository.KategoriRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class SeedConfig {

    private final KullaniciRepository kullaniciRepository;
    private final PasswordEncoder passwordEncoder;

    private final KategoriRepository kategoriRepository;
    private final UrunRepository urunRepository;

    @Bean
    CommandLineRunner seedAll() {
        return args -> {
            // 1) Users
            ensureUser("admin@getirecza.com", "Test123!", "ROLE_ADMIN", "Admin", "User");
            ensureUser("user@getirecza.com",  "Test123!", "ROLE_USER",  "Normal", "User");

            // 2) Kategori (aktif)
            Kategori kat = ensureKategori("Genel", true);

            // 3) Ürün (aktif) - /urunler listesinde en az 1 ürün olsun
            ensureUrun("Seed Ürün", new BigDecimal("10.00"), 10, kat, true);
        };
    }

    private void ensureUser(String email, String rawPass, String rol, String ad, String soyad) {
        Kullanici k = kullaniciRepository.findByEmail(email).orElseGet(Kullanici::new);
        k.setEmail(email);
        k.setSifre(passwordEncoder.encode(rawPass));
        k.setRol(rol);
        k.setAd(ad);
        k.setSoyad(soyad);
        kullaniciRepository.save(k);
        System.out.println("✅ Seed user ensured: " + email + " / " + rol);
    }

    private Kategori ensureKategori(String ad, boolean aktif) {
        // Repository’de böyle bir method yoksa -> findAll() ile kontrol edeceğiz.
        Kategori existing = kategoriRepository.findAll().stream()
                .filter(k -> ad.equalsIgnoreCase(k.getAd()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setAktif(aktif);
            kategoriRepository.save(existing);
            System.out.println("✅ Seed kategori ensured: " + existing.getAd());
            return existing;
        }

        Kategori k = new Kategori();
        k.setAd(ad);
        k.setAktif(aktif);
        k.setAciklama("Seed kategori");
        k.setGorselUrl(null);
        Kategori saved = kategoriRepository.save(k);
        System.out.println("✅ Seed kategori created: " + saved.getAd());
        return saved;
    }

    private void ensureUrun(String ad, BigDecimal fiyat, int stok, Kategori kategori, boolean aktif) {
        Urun existing = urunRepository.findAll().stream()
                .filter(u -> ad.equalsIgnoreCase(u.getAd()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setFiyat(fiyat);
            existing.setStokDurumu(stok);
            existing.setKategori(kategori);
            existing.setAktif(aktif);
            urunRepository.save(existing);
            System.out.println("✅ Seed urun ensured: " + existing.getAd());
            return;
        }

        Urun u = new Urun();
        u.setAd(ad);
        u.setFiyat(fiyat);
        u.setStokDurumu(stok);
        u.setKategori(kategori);
        u.setAktif(aktif);
        u.setAciklama("Seed urun");
        u.setGorselUrl(null);
        urunRepository.save(u);
        System.out.println("✅ Seed urun created: " + ad);
    }
}
