package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Yorum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YorumRepository extends JpaRepository<Yorum, Long> {
    List<Yorum> findByUrun_UrunId(Long urunId);
    List<Yorum> findByKullanici_KullaniciId(Long kullaniciId);
}
