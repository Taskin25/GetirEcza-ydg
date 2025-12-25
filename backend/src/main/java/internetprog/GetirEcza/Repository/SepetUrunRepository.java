package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.SepetUrun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SepetUrunRepository extends JpaRepository<SepetUrun, Long> {

    List<SepetUrun> findBySepet_Id(Long sepetId);  // ✅ doğru alan ismi "id"
    Optional<SepetUrun> findBySepet_IdAndUrun_UrunId(Long sepetId, Long urunId);  // ✅
}
