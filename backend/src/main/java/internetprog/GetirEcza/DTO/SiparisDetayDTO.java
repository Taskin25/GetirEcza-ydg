package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiparisDetayDTO {
    private Long id;
    private Long siparisId;
    private Long urunId;
    private Integer adet;
    private BigDecimal birimFiyat;
}
