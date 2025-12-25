package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Urun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrunRepository extends JpaRepository<Urun, Long> {
    List<Urun> findByKategori_KategoriId(Long kategoriId);
    List<Urun> findByAdContainingIgnoreCase(String ad); // Arama filtresi için
    List<Urun> findByAktifTrue(); // Soft delete için
    List<Urun> findTop4ByKategori_KategoriIdAndUrunIdNot(Long kategoriId, Long urunId);

}

