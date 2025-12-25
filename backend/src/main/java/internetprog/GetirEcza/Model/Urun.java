package internetprog.GetirEcza.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Urun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long urunId;

    private String ad;
    private String aciklama;

    @DecimalMin(value = "0.0", inclusive = true, message = "Fiyat negatif olamaz")
    private BigDecimal fiyat;
    private Integer stokDurumu;
    private String gorselUrl;

    @Column(nullable = false)
    private Boolean aktif = true;

    @ManyToOne
    @JoinColumn(name = "kategori_id")
    private Kategori kategori;

    @OneToMany(mappedBy = "urun")
    private List<Yorum> yorumlar;

    @OneToMany(mappedBy = "urun")
    private List<Favori> favoriler;

    @OneToMany(mappedBy = "urun")
    private List<SiparisDetay> siparisDetaylar;
}
