package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S4_SayfalarAciliyorTest extends BaseUiTest {

    @Test
    void anasayfaVeGirisSayfasiAcilmali() {
        // Anasayfa
        driver.get(baseUrl + "/");
        // Sayfada navbar veya ürün listesi gibi bir şey varsa onu kontrol et
        assertTrue(driver.getPageSource().length() > 200);

        // Giriş sayfası
        driver.get(baseUrl + "/giris");
        // Giriş formundan bir input yakalamaya çalış (uygun selector seç)
        assertTrue(driver.getPageSource().toLowerCase().contains("giriş")
                || driver.getPageSource().toLowerCase().contains("email"));
    }

    @Test
    void sepetVeFavorilerLoginIleAcilmali() {
        loginAsUser(); // BaseUiTest içinde yoksa aşağıda nasıl ekleyeceğini yazdım

        driver.get(baseUrl + "/sepet");
        assertTrue(driver.getPageSource().length() > 200);

        driver.get(baseUrl + "/favorilerim");
        assertTrue(driver.getPageSource().length() > 200);
    }
}
