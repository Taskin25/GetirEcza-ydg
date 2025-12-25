package internetprog.GetirEcza.Model;

import internetprog.GetirEcza.Enum.SiparisDurum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Siparis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long siparisId;

    @ManyToOne
    @JoinColumn(name = "kullanici_id")
    private Kullanici kullanici;

    private LocalDateTime siparisTarihi;

    private BigDecimal toplamTutar;

    @Enumerated(EnumType.STRING)
    private SiparisDurum durum;



    @OneToOne(mappedBy = "siparis", cascade = CascadeType.ALL)
    private Odeme odeme;

    @OneToOne(mappedBy = "siparis", cascade = CascadeType.ALL)
    private Kargo kargo;

    @OneToMany(mappedBy = "siparis", cascade = CascadeType.ALL)
    private List<SiparisDetay> siparisDetaylari = new ArrayList<>();
}
