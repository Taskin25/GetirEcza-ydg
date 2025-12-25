package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YorumDTO {
    private Long id;
    private Long urunId;
    private Long kullaniciId;
    private String kullaniciAdSoyad;
    private String icerik;
    private Integer puan;
    private LocalDateTime tarih;


}
