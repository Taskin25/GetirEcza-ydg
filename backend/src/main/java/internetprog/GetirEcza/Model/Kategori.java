package internetprog.GetirEcza.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kategori {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kategoriId;

    private String ad;
    private String aciklama;
    private String gorselUrl;

    @Column(nullable = false)
    private boolean aktif = true;

    @OneToMany(mappedBy = "kategori")
    private List<Urun> urunler;
}
