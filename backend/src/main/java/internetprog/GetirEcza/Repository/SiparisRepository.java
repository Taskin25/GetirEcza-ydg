package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Siparis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiparisRepository extends JpaRepository<Siparis, Long> {
    List<Siparis> findByKullanici_KullaniciId(Long kullaniciId);
}
