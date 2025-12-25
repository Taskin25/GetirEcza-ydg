package internetprog.GetirEcza.Model;

import internetprog.GetirEcza.Enum.OdemeDurumu;
import internetprog.GetirEcza.Enum.OdemeYontemi;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Odeme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long odemeId;

    private BigDecimal odemeTutari;

    private LocalDateTime odemeTarihi;

    @Enumerated(EnumType.STRING)
    private OdemeYontemi odemeYontemi;

    @Enumerated(EnumType.STRING)
    private OdemeDurumu odemeDurumu;

    @OneToOne
    @JoinColumn(name = "siparis_id")
    private Siparis siparis;
}
