package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S5_UrunListeDetayTest extends BaseUiTest {

    @Test
    void urunListesiVeDetayAciliyorMu() {
        String baseUrl = System.getProperty("APP_BASE_URL", "http://frontend");
        driver.get(baseUrl + "/");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));

        // ✅ Ürün kartları gelene kadar bekle (senin UI'da kartın data-testid'si bu)
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
                By.cssSelector("[data-testid='urun-karti']"), 0
        ));

        List<WebElement> kartlar = driver.findElements(By.cssSelector("[data-testid='urun-karti']"));
        assertTrue(kartlar.size() > 0, "Ürün listesi boş görünüyor");

        WebElement ilkKart = kartlar.get(0);

        // ✅ İlk kartın içindeki "İncele" linkini bul (data-testid ...-incele)
        WebElement inceleLink = ilkKart.findElement(By.cssSelector("[data-testid$='-incele']"));
        inceleLink.click();

        // ✅ Detay sayfasında başlık gelsin
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='urun-baslik']")
        ));

        WebElement baslik = driver.findElement(By.cssSelector("[data-testid='urun-baslik']"));
        assertTrue(!baslik.getText().isBlank(), "Ürün başlığı boş");
    }
}
