package internetprog.GetirEcza.Controller;

import internetprog.GetirEcza.Model.Kategori;
import internetprog.GetirEcza.Model.Urun;
import internetprog.GetirEcza.Repository.KategoriRepository;
import internetprog.GetirEcza.Repository.UrunRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UrunControllerIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("getirecza_test")
            .withUsername("postgres")
            .withPassword("123");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
        r.add("spring.jpa.hibernate.ddl-auto", () -> "update");
        r.add("server.port", () -> "0"); // random port
    }

    @Autowired MockMvc mockMvc;
    @Autowired UrunRepository urunRepository;
    @Autowired KategoriRepository kategoriRepository;

    @BeforeEach
    void setup() {
        urunRepository.deleteAll();
        kategoriRepository.deleteAll();

        Kategori kat = new Kategori();
        kat.setAd("Ağrı Kesici");
        kat = kategoriRepository.save(kat);

        Urun u = new Urun();
        u.setAd("Parol");
        u.setAciklama("Test ürün");
        u.setFiyat(BigDecimal.valueOf(100));
        u.setStokDurumu(1);
        u.setGorselUrl("img");

        // aktif alanın Boolean ise:
        u.setAktif(true);

        u.setKategori(kat);
        urunRepository.save(u);
    }

    @Test
    void GET_api_urunler_200_veListeDoner() throws Exception {
        mockMvc.perform(get("/api/urunler"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].ad", is("Parol")))
                .andExpect(jsonPath("$[0].kategoriAd", is("Ağrı Kesici")));
    }
}
