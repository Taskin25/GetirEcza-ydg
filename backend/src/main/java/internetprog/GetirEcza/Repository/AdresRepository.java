package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Adres;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdresRepository extends JpaRepository<Adres, Long> {
    List<Adres> findByKullanici_KullaniciId(Long kullaniciId);
}
