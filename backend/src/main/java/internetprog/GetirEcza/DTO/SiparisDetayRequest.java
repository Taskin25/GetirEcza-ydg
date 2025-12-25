package internetprog.GetirEcza.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiparisDetayRequest {
    private Long urunId;
    private int adet;
    private double birimFiyat;
}
