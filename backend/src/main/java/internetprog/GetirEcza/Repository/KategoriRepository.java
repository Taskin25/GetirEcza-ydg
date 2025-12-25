package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Kategori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KategoriRepository extends JpaRepository<Kategori, Long> {
    Optional<Kategori> findByAdIgnoreCase(String ad);
    List<Kategori> findByAktifTrue();

}
