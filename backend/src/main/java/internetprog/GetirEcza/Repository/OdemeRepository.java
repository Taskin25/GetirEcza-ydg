package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Odeme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OdemeRepository extends JpaRepository<Odeme, Long> {
    Optional<Odeme> findBySiparis_SiparisId(Long siparisId);
}
