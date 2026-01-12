package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S5_UrunListeDetayTest extends BaseUiTest {

    @Test
    void urunListesiVeDetayAciliyorMu() {
        String baseUrl = System.getProperty("APP_BASE_URL", "http://frontend");
        driver.get(baseUrl + "/");

        List<WebElement> urunKartlari =
                driver.findElements(By.cssSelector("[data-testid='urun-karti']"));
        assertTrue(urunKartlari.size() > 0, "Ürün listesi boş görünüyor");

        WebElement inceleLink =
                urunKartlari.get(0).findElement(By.cssSelector("a"));
        inceleLink.click();

        WebElement baslik =
                driver.findElement(By.cssSelector("[data-testid='urun-baslik']"));
        assertTrue(baslik.getText() != null && !baslik.getText().isBlank(), "Ürün başlığı boş");
    }
}
