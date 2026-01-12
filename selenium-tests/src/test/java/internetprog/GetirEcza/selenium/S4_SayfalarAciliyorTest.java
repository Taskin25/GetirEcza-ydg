package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class S4_SayfalarAciliyorTest extends BaseUiTest {

    private String getBaseUrl() {
        return System.getProperty("APP_BASE_URL", "http://frontend");
    }

    @Test
    void anasayfaAcilmali() {
        driver.get(getBaseUrl() + "/");
        assertTrue(driver.getPageSource().length() > 200);
    }

    @Test
    void girisSayfasiAcilmali() {
        driver.get(getBaseUrl() + "/giris");
        String html = driver.getPageSource().toLowerCase();
        assertTrue(html.contains("giriş") || html.contains("email") || html.contains("şifre"));
    }
}
