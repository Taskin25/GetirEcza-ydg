package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Favori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long> {
    List<Favori> findByKullanici_KullaniciId(Long kullaniciId);
    Optional<Favori> findByKullanici_KullaniciIdAndUrun_UrunId(Long kullaniciId, Long urunId);
}
