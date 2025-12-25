package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiparisDTO {
    private Long id;
    private Long kullaniciId;
    private LocalDateTime siparisTarihi;
    private BigDecimal toplamTutar;
    private String durum;
}
