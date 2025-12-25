package internetprog.GetirEcza.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriDTO {
    private Long id;
    private Long kullaniciId;
    private Long urunId;
    private LocalDateTime favoriTarihi;
}
