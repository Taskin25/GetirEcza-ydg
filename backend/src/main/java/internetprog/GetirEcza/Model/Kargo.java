package internetprog.GetirEcza.Model;


import internetprog.GetirEcza.Enum.KargoDurum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kargoId;

    private String kargoSirketi;
    private String takipNumarasi;

    @Enumerated(EnumType.STRING)
    private KargoDurum durum;

    private LocalDateTime gonderimTarihi;
    private LocalDateTime teslimTarihi;

    @OneToOne
    @JoinColumn(name = "siparis_id")
    private Siparis siparis;
}
