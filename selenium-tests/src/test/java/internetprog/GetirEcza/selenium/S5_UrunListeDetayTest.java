package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S5_UrunListeDetayTest extends BaseUiTest {

    @Test
    void urunListesiVeDetayAciliyorMu() {
        // ✅ Anasayfa
        driver.get(appBaseUrl + "/");

        // ✅ Ürün kartları yüklendi mi
        List<WebElement> urunKartlari =
                driver.findElements(By.cssSelector("[data-testid='urun-karti']"));

        assertTrue(urunKartlari.size() > 0, "Ürün listesi boş görünüyor");

        // ✅ İlk ürünün "İncele" linkine tıkla
        WebElement inceleLink =
                urunKartlari.get(0).findElement(By.cssSelector("a"));

        inceleLink.click();

        // ✅ Ürün detay sayfasında başlık var mı
        WebElement baslik =
                driver.findElement(By.cssSelector("[data-testid='urun-baslik']"));

        assertTrue(
                baslik.getText() != null && !baslik.getText().isBlank(),
                "Ürün başlığı boş"
        );
    }
}
