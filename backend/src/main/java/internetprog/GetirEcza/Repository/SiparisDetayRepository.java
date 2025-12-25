package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.SiparisDetay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiparisDetayRepository extends JpaRepository<SiparisDetay, Long> {
    List<SiparisDetay> findBySiparis_SiparisId(Long siparisId);
}
