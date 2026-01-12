package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.*;

public class S3_FavoriYorumTest extends BaseUiTest {

    @Test
    void favoriEkleVeYorumYaz() throws Exception {
        // ✅ Navbar görünsün
        try { driver.manage().window().setSize(new Dimension(1280, 900)); } catch (Exception ignored) {}

        // 1) Login
        login("user@getirecza.com", "Test123!");
        driver.navigate().refresh();
        waitForPageReady();

        // 2) Ürünler sayfasına git ve ilk ürüne gir (detay sayfası)
        goToUrunlerAndWaitFirstItem();

        // Ürün kartındaki "İncele" linkine bas (projenizde data-testid yoksa href ile yakalıyoruz)
        // Tercih 1: data-testid varsa (öneri): urun-1-incele gibi
        // Tercih 2: yoksa ilk /urun/ linkini bul
        WebElement ilkUrunDetayLink = wait.until(d -> d.findElement(By.cssSelector("a[href^='/urun/']")));
        safeClick(ilkUrunDetayLink);

        wait.until(d -> d.getCurrentUrl().contains("/urun/"));
        waitForPageReady();

        // URL’den ürün id çek
        String url = driver.getCurrentUrl();         // ör: http://frontend/urun/1
        String urunId = url.substring(url.lastIndexOf("/") + 1).trim();
        assertFalse(urunId.isBlank(), "Ürün ID URL'den alınamadı!");

        // 3) Favoriye ekle (UrunDetay'daki buton)
        WebElement favoriBtn = byTestId("urun-" + urunId + "-favori");
        safeClick(favoriBtn);

        // 4) Favoriler sayfasına git (navbar)
        WebElement navFavoriler = byTestId("nav-favoriler");
        safeClick(navFavoriler);

        // 5) URL favoriler olmalı
        wait.until(d -> d.getCurrentUrl().contains("/favoriler"));
        waitForPageReady();

        // 6) Favorilerde boş mesajı olmamalı
        if (driver.findElements(css("[data-testid='favori-empty']")).size() > 0) {
            fail("Favoriler boş görünüyor! UI: " + byTestId("favori-empty").getText());
        }

        // 7) Favori listesi gelmeli ve içinde ürün görünmeli
        WebElement favoriList = byTestId("favori-list");
        assertNotNull(favoriList, "favori-list bulunamadı!");

        String favoriText = favoriList.getText();
        assertFalse(favoriText.isBlank(), "Favori listesi boş olamaz!");
        System.out.println("UI favori-list text=" + favoriText);

        // 8) Favori kartında ilgili ürün var mı? (Favorilerim.jsx'de: data-testid=`favori-urun-${urunId}`)
        // Eğer urunId ile eşleşmiyorsa en azından listede içerik var kontrolü zaten yukarıda var.
        // Burada daha net kontrol yapalım:
        boolean buUrunVar = driver.findElements(css("[data-testid='favori-urun-" + urunId + "']")).size() > 0;
        assertTrue(buUrunVar, "Eklenen ürün favorilerde görünmedi! urunId=" + urunId);

        // 9) Favori kartındaki "İncele" ile tekrar ürün detay sayfasına dön
        WebElement inceleBtn = byTestId("favori-urun-" + urunId + "-incele");
        safeClick(inceleBtn);

        wait.until(d -> d.getCurrentUrl().contains("/urun/" + urunId));
        waitForPageReady();

        // 10) Yorumlar sekmesine geç
        // Ben sana UrunDetay.jsx'e eklemeni önermiştim:
        // data-testid="tab-yorumlar"
        // Eğer eklemediysen aşağıdaki satır patlar -> o zaman jsx'e eklemen lazım.
        WebElement tabYorumlar = byTestId("tab-yorumlar");
        safeClick(tabYorumlar);

        // 11) Yorum input + gönder
        WebElement yorumInput = byTestId("yorum-input");
        String testYorum = "S3 Selenium yorum " + System.currentTimeMillis();
        yorumInput.clear();
        yorumInput.sendKeys(testYorum);

        WebElement yorumGonder = byTestId("yorum-gonder");
        safeClick(yorumGonder);

        // 12) Yorum listesinde yeni yorum görünsün
        WebElement yorumList = byTestId("yorum-list");
        wait.until(d -> yorumList.getText().contains(testYorum));

        System.out.println("✅ Yorum eklendi ve listede göründü: " + testYorum);
        assertTrue(yorumList.getText().contains(testYorum), "Yeni yorum listede görünmedi!");
    }

    private By css(String selector) {
        return By.cssSelector(selector);
    }
}
