package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SepetDTO {
    private Long id;
    private Long kullaniciId;
    private Long urunId;
    private Integer adet;
}
