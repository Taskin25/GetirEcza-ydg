package internetprog.GetirEcza.Repository;

import internetprog.GetirEcza.Model.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.Optional;
import internetprog.GetirEcza.Model.Kullanici;

public interface KullaniciRepository extends JpaRepository<Kullanici, Long> {
    Optional<Kullanici> findByEmail(String email);
}

