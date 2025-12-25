package internetprog.GetirEcza.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kullanici {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kullaniciId;

    private String ad;
    private String soyad;

    @Column(unique = true)
    private String email;

    private String sifre;

    private String telefon;

    @Column(name = "rol")
    private String rol;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime kayitTarihi;

    @OneToMany(mappedBy = "kullanici", cascade = CascadeType.ALL)
    private List<Adres> adresler;

    @OneToMany(mappedBy = "kullanici")
    private List<Yorum> yorumlar;



    @OneToOne(mappedBy = "kullanici", cascade = CascadeType.ALL)
    private Sepet sepet;

    @OneToMany(mappedBy = "kullanici")
    private List<Favori> favoriler;

    @OneToMany(mappedBy = "kullanici")
    private List<Siparis> siparisler;
}
