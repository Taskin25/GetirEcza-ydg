package internetprog.GetirEcza.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SepetUrun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer adet;

    @ManyToOne
    @JoinColumn(name = "sepet_id")
    private Sepet sepet;

    @ManyToOne
    @JoinColumn(name = "urun_id")
    private Urun urun;
}
