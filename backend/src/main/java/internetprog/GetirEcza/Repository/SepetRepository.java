package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Sepet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SepetRepository extends JpaRepository<Sepet, Long> {
    Optional<Sepet> findByKullanici_KullaniciId(Long kullaniciId);
}

