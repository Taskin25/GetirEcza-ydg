package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OdemeDTO {
    private Long id;
    private Long siparisId;
    private BigDecimal odemeTutari;
    private LocalDateTime odemeTarihi;
    private String odemeYontemi;
    private String odemeDurumu;
}
