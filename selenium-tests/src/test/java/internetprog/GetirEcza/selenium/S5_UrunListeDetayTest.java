package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S5_UrunListeDetayTest extends BaseUiTest {

    @Test
    void urunListesiVeDetayAciliyorMu() {
        String baseUrl = System.getProperty("APP_BASE_URL", "http://frontend");
        driver.get(baseUrl + "/");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // ✅ ürün kartları gelsin
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
                By.cssSelector("[data-testid^='urun-']"), 0
        ));

        List<WebElement> urunKartlari =
                driver.findElements(By.cssSelector("[data-testid^='urun-']"));

        assertTrue(urunKartlari.size() > 0, "Ürün listesi boş görünüyor");

        // ✅ ilk ürünün incele linkine tıkla
        WebElement inceleLink =
                urunKartlari.get(0).findElement(By.cssSelector("a"));
        inceleLink.click();

        // ✅ detay sayfasında başlık gelsin
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='urun-baslik']")
        ));

        WebElement baslik =
                driver.findElement(By.cssSelector("[data-testid='urun-baslik']"));

        assertTrue(!baslik.getText().isBlank(), "Ürün başlığı boş");
    }
}
