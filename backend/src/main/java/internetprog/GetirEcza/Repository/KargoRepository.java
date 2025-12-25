package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Kargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KargoRepository extends JpaRepository<Kargo, Long> {
    Optional<Kargo> findBySiparis_SiparisId(Long siparisId);
}
