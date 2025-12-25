package internetprog.GetirEcza.DTO;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrunDTO {
    private Long id;
    private String ad;
    private String aciklama;

    @DecimalMin(value = "0.0", inclusive = true, message = "Fiyat negatif olamaz")
    private BigDecimal fiyat;
    private Integer stokDurumu;
    private String gorselUrl;
    private Long kategoriId;
    private String kategoriAd;
}
