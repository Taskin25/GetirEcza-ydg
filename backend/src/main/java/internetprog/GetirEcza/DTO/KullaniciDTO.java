package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KullaniciDTO {
    private Long id;
    private String ad;
    private String soyad;
    private String email;
    private String telefon;
    private LocalDateTime kayitTarihi;
}
