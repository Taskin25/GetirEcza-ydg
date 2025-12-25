package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KategoriDTO {
    private Long id;
    private String ad;
    private String gorselUrl; // Görsel URL'si için eklenen alan
    private String aciklama;
}
