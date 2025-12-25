package internetprog.GetirEcza.DTO;


import lombok.Data;

import java.util.List;

@Data
public class SiparisOlusturmaRequest {
    private Long kullaniciId;
    private double toplamTutar;
    private List<SiparisDetayRequest> detaylar;
}

