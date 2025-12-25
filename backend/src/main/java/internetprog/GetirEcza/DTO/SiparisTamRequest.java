package internetprog.GetirEcza.DTO;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiparisTamRequest {
    private Long kullaniciId;
    private double toplamTutar;
    private LocalDateTime siparisTarihi;
    private List<SiparisDetayRequest> detaylar;
}
