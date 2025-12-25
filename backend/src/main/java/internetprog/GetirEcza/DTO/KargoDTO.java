package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KargoDTO {
    private Long id;
    private Long siparisId;
    private String kargoSirketi;
    private String takipNumarasi;
    private String durum;
    private LocalDateTime gonderimTarihi;
    private LocalDateTime teslimTarihi;
}
