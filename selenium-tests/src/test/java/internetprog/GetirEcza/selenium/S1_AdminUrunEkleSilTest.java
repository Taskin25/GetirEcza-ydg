package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.*;

public class S1_AdminUrunEkleSilTest extends BaseUiTest {

    @Test
    void adminUrunEkleVeSil() {
        login("admin@getirecza.com", "Test123!");
        goToAdminUrunler();

        String urunAdi = "Selenium Urun " + System.currentTimeMillis();

        typeTestId("urun-ad", urunAdi);
        typeTestId("urun-fiyat", "12.50");
        typeTestId("urun-stok", "3");

        // AdminUrunler.jsx içinde required -> mutlaka doldur
        typeTestId("urun-gorselUrl", "https://via.placeholder.com/300x300.png?text=urun");
        typeTestId("urun-aciklama", "Selenium test ürünü");

        selectFirstNonEmptyOption("urun-kategoriId");
        clickTestId("urun-kaydet");

        // Sayfalama yüzünden görünmeyebilir -> arama ile filtrele
        typeTestId("urun-arama", urunAdi);

        // Tablo içinde ürün adı görünsün
        By rowByName = By.xpath("//tbody[@data-testid='urun-list-body']//tr[.//*[contains(normalize-space(.),'" + urunAdi + "')]]");
        WebElement row = wait.until(ExpectedConditions.presenceOfElementLocated(rowByName));
        assertTrue(row.getText().contains(urunAdi));

        // Aynı satırın içindeki sil butonu (data-testid ...-sil)
        WebElement silBtn;
        try {
            silBtn = row.findElement(By.cssSelector("button[data-testid$='-sil']"));
        } catch (Exception e) {
            silBtn = row.findElement(By.xpath(".//button[contains(normalize-space(.),'Sil') or contains(normalize-space(.),'Delete') or contains(normalize-space(.),'Kaldır') or contains(normalize-space(.),'Kaldir')]"));
        }

        scrollIntoView(silBtn);
        safeClick(silBtn);
        acceptConfirmIfPresent();

        // Silinince arama sonuçlarında görünmemeli
        wait.until(ExpectedConditions.invisibilityOfElementLocated(rowByName));
    }
}
