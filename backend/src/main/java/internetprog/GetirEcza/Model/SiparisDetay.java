package internetprog.GetirEcza.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiparisDetay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long siparisDetayId;

    @ManyToOne
    @JoinColumn(name = "siparis_id")
    private Siparis siparis;

    @ManyToOne
    @JoinColumn(name = "urun_id")
    private Urun urun;

    private Integer adet;
    private BigDecimal birimFiyat;
}
