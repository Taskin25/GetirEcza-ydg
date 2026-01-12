package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.*;

public class S2_UserSepeteEkleTest extends BaseUiTest {

    private int sepetSayisiApiIle(String token) throws Exception {
        // Host üzerinden çağırıyoruz (Windows -> localhost:3000)
        String hostApiBase = System.getProperty("HOST_API_BASE_URL");
        if (hostApiBase == null || hostApiBase.isBlank()) hostApiBase = "http://localhost:3000";
        if (hostApiBase.endsWith("/")) hostApiBase = hostApiBase.substring(0, hostApiBase.length() - 1);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(hostApiBase + "/api/sepet"))
                .header("Authorization", "Bearer " + token)
                .GET()
                .build();

        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());

        System.out.println("API STATUS=" + resp.statusCode());
        String body = resp.body() == null ? "" : resp.body();
        System.out.println("API BODY(first 300)=" + body.substring(0, Math.min(300, body.length())));

        if (resp.statusCode() != 200) return 0;
        if (body.isBlank() || body.equals("[]")) return 0;

        // Senin API body: [{"id":1,"kullaniciId":2,"urunId":1,"adet":2}]
        int count = 0;
        int idx = 0;
        while ((idx = body.indexOf("\"id\":", idx)) != -1) {
            count++;
            idx += 5;
        }
        return count;
    }

    @Test
    void userUrunSepeteEkle() throws Exception {
        // ✅ Navbar görünmesi için pencereyi büyüt
        try {
            driver.manage().window().setSize(new Dimension(1280, 900));
        } catch (Exception ignored) {}

        // 1) Login
        login("user@getirecza.com", "Test123!");

        // ✅ login sonrası state otursun
        driver.navigate().refresh();
        waitForPageReady();

        // 2) Ürünler sayfasına git ve ilk ürünü bekle
        goToUrunlerAndWaitFirstItem();

        // 3) İlk ürünü sepete ekle
        safeClick(firstUrunActionButton("sepete-ekle"));

        // 4) Token
        String token = getTokenFromLocalStorage();
        assertNotNull(token, "Token alınamadı!");
        assertFalse(token.isBlank(), "Token boş geldi!");

        // 5) API ile gerçekten sepete yazıldı mı?
        boolean doldu = false;
        for (int i = 0; i < 25; i++) {
            int n = sepetSayisiApiIle(token);
            System.out.println("API sepet count=" + n);
            if (n > 0) { doldu = true; break; }
            Thread.sleep(1000);
        }
        assertTrue(doldu, "API tarafında sepet dolmadı. Sepete ekleme backend'e yazılmıyor!");

        // 6) ✅ /sepet'e driver.get ile değil, NAV’dan tıklayarak git
        // Navbar’da "nav-sepet" var (logta gördük)
        WebElement navSepet = byTestId("nav-sepet");
        safeClick(navSepet);

        // 7) URL artık /sepet olmalı
        wait.until(d -> d.getCurrentUrl().contains("/sepet"));
        waitForPageReady();

        // 8) sepet-list bulunmalı (Sepet.jsx’de data-testid="sepet-list" var)
        WebElement sepetList = byTestId("sepet-list");
        assertNotNull(sepetList, "sepet-list bulunamadı!");

        // 9) Boş yazısı olmamalı
        String listText = sepetList.getText();
        System.out.println("UI sepet-list text=" + listText);
        assertFalse(listText.contains("Sepetiniz boş"), "UI tarafında sepet boş görünüyor!");

        // 10) Kaldır butonu gelmeli
        By kaldirButonu = By.xpath("//button[contains(normalize-space(.),'Kaldır') or contains(normalize-space(.),'Kaldir')]");
        wait.until(d -> !d.findElements(kaldirButonu).isEmpty());
        assertFalse(driver.findElements(kaldirButonu).isEmpty(), "Kaldır butonu bulunamadı. Sepet satırı render olmuyor!");
    }
}
