package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SepetUrunDTO {
    private Long id;
    private Long urunId;
    private String urunAdi;
    private int adet;
}

