package internetprog.GetirEcza.selenium;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.*;

import java.net.URL;
import java.time.Duration;
import java.util.List;

public abstract class BaseUiTest {

    protected WebDriver driver;
    protected WebDriverWait wait;

    protected String baseUrl() {
        String v = System.getProperty("APP_BASE_URL");
        if (v == null || v.isBlank()) {
            throw new IllegalStateException(
                    "APP_BASE_URL zorunlu! Örn: -DAPP_BASE_URL=http://frontend (CI) veya http://localhost:3000 (local)"
            );
        }
        String url = v.trim();
        if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
        return url;
    }

    protected String remoteUrl() {
        String v = System.getProperty("SELENIUM_REMOTE_URL");
        if (v == null || v.isBlank()) {
            throw new IllegalStateException(
                    "SELENIUM_REMOTE_URL zorunlu! Örn: -DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub"
            );
        }
        return v.trim();
    }



    @BeforeEach
    void startDriver() throws Exception {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1440,900");

        driver = new RemoteWebDriver(new URL(remoteUrl()), options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(40));
    }

    @AfterEach
    void stopDriver() {
        if (driver != null) driver.quit();
    }

    // ----------------- Core helpers -----------------

    protected By testId(String id) {
        return By.cssSelector("[data-testid='" + id + "']");
    }

    protected WebElement byTestId(String id) {
        try {
            WebElement el = wait.until(ExpectedConditions.presenceOfElementLocated(testId(id)));
            scrollIntoView(el);
            return wait.until(ExpectedConditions.visibilityOf(el));
        } catch (TimeoutException e) {
            debug("Element bulunamadı: " + id);
            throw e;
        }
    }

    protected void clickTestId(String id) {
        try {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(testId(id)));
            scrollIntoView(el);
            safeClick(el);
        } catch (TimeoutException e) {
            debug("Tıklanamadı: " + id);
            throw e;
        }
    }

    protected void typeTestId(String id, String text) {
        WebElement el = byTestId(id);
        wait.until(d -> el.isDisplayed() && el.isEnabled());
        el.click();
        el.sendKeys(Keys.chord(Keys.CONTROL, "a"));
        el.sendKeys(Keys.BACK_SPACE);
        el.sendKeys(text);
    }

    /** SPA için: root + readyState */
    protected void waitForPageReady() {
        try {
            wait.until(d -> "complete".equals(((JavascriptExecutor) d).executeScript("return document.readyState")));
        } catch (Exception ignored) {}
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#root")));
        } catch (Exception ignored) {}
    }

    // ----------------- Login -----------------

    protected void login(String email, String sifre) {
        driver.get(baseUrl() + "/giris");
        waitForPageReady();

        byTestId("login-email");
        byTestId("login-password");

        typeTestId("login-email", email);
        typeTestId("login-password", sifre);
        clickTestId("login-submit");

        // alert varsa login fail
        try {
            Alert a = new WebDriverWait(driver, Duration.ofSeconds(2))
                    .until(ExpectedConditions.alertIsPresent());
            String msg = a.getText();
            a.accept();
            throw new RuntimeException("Login başarısız! Alert: " + msg + " | email=" + email);
        } catch (TimeoutException ignored) {}

        // token yazıldı mı?
        wait.until(d -> {
            Object t = ((JavascriptExecutor) d).executeScript("return window.localStorage.getItem('token');");
            System.out.println("TOKEN after login=" + t);
            return t != null && !t.toString().isBlank();
        });

        wait.until(d -> !d.getCurrentUrl().contains("/giris"));
        waitForPageReady();
    }

    // ----------------- Navigation helpers -----------------

    private void clickAdminUrunlerCardIfOnPanel() {
        if (!driver.getCurrentUrl().contains("/admin/panel")) return;

        String[] possibleTestIds = new String[] {
                "nav-admin-urunler",
                "nav-admin-urun",
                "nav-admin-products",
                "nav-admin-product"
        };

        for (String tid : possibleTestIds) {
            try {
                WebElement el = new WebDriverWait(driver, Duration.ofSeconds(2))
                        .until(ExpectedConditions.elementToBeClickable(testId(tid)));
                scrollIntoView(el);
                safeClick(el);
                waitForPageReady();
                return;
            } catch (Exception ignored) {}
        }

        By urunKarti = By.xpath(
                "//div[contains(@class,'cursor-pointer') and (" +
                        ".//h2[contains(normalize-space(.),'Ürün')]" +
                        " or .//h2[contains(normalize-space(.),'Urun')]" +
                        " or .//h2[contains(normalize-space(.),'Product')]" +
                        ")] ]"
        );

        WebElement kart = wait.until(ExpectedConditions.elementToBeClickable(urunKarti));
        scrollIntoView(kart);
        safeClick(kart);
        waitForPageReady();
    }

    protected void goToAdminUrunler() {
        driver.get(baseUrl() + "/admin/urunler");
        waitForPageReady();

        if (driver.getCurrentUrl().contains("/admin/panel")) {
            clickAdminUrunlerCardIfOnPanel();
        }

        if (!driver.getCurrentUrl().contains("/admin/urunler")) {
            driver.get(baseUrl() + "/admin/urunler");
            waitForPageReady();
        }

        byTestId("urun-form");
        byTestId("urun-ad");
    }

    /** Ürünler sayfasına git ve en az 1 ürün kartının geldiğini bekle */
    protected void goToUrunlerAndWaitFirstItem() {
        driver.get(baseUrl() + "/urunler");
        waitForPageReady();

        By anyUrunTestId = By.cssSelector("[data-testid^='urun-']");
        try {
            new WebDriverWait(driver, Duration.ofSeconds(3))
                    .until(ExpectedConditions.presenceOfElementLocated(anyUrunTestId));
            return;
        } catch (TimeoutException ignored) {}

        driver.get(baseUrl() + "/");
        waitForPageReady();
        wait.until(ExpectedConditions.presenceOfElementLocated(anyUrunTestId));
    }

    // ----------------- Robust selectors for dynamic product IDs -----------------

    protected WebElement firstUrunActionButton(String actionSuffix) {
        By btn = By.cssSelector("[data-testid^='urun-'][data-testid$='-" + actionSuffix + "']");
        WebElement el = wait.until(ExpectedConditions.elementToBeClickable(btn));
        scrollIntoView(el);
        return el;
    }

    protected void waitListNotBlank(String listTestId) {
        wait.until(d -> {
            try {
                String t = byTestId(listTestId).getText();
                return t != null && !t.trim().isBlank();
            } catch (Exception e) {
                return false;
            }
        });
    }

    // ----------------- Admin: select helper -----------------

    protected void selectFirstNonEmptyOption(String id) {
        wait.until(d -> {
            try {
                Select s = new Select(byTestId(id));
                return s.getOptions().size() > 1;
            } catch (StaleElementReferenceException e) {
                return false;
            }
        });

        Select select = new Select(byTestId(id));
        List<WebElement> opts = select.getOptions();
        for (WebElement opt : opts) {
            String val = opt.getAttribute("value");
            if (val != null && !val.isBlank()) {
                select.selectByValue(val.trim());
                return;
            }
        }
        throw new RuntimeException("Kategori option bulunamadı (value boş olmayan yok).");
    }

    // ----------------- Common asserts -----------------

    protected void waitUntilTextContainsIfExists(String id, String text) {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(5))
                    .until(ExpectedConditions.presenceOfElementLocated(testId(id)));
        } catch (TimeoutException e) {
            return;
        }
        wait.until(d -> byTestId(id).getText().contains(text));
    }

    protected void acceptConfirmIfPresent() {
        try {
            Alert a = new WebDriverWait(driver, Duration.ofSeconds(2))
                    .until(ExpectedConditions.alertIsPresent());
            a.accept();
        } catch (TimeoutException ignored) {}
    }

    /**
     * Ürün tablosunda görünen ilk sil butonuna tıkla.
     * 1) data-testid="urun-sil-*" varsa onu kullanır
     * 2) yoksa metni "Sil/Delete/Kaldır" olan ilk butonu bulur
     */
    protected void clickFirstDeleteButtonInTable() {
        // 1) testid ile dene
        try {
            By firstDelete = By.cssSelector("[data-testid^='urun-sil-']");
            WebElement btn = new WebDriverWait(driver, Duration.ofSeconds(3))
                    .until(ExpectedConditions.elementToBeClickable(firstDelete));
            scrollIntoView(btn);
            safeClick(btn);
            return;
        } catch (Exception ignored) {}

        // 2) metin ile fallback
        By silBtn = By.xpath("//button[contains(normalize-space(.),'Sil') or contains(normalize-space(.),'Delete') or contains(normalize-space(.),'Kaldır') or contains(normalize-space(.),'Kaldir')]");
        WebElement btn2 = wait.until(ExpectedConditions.elementToBeClickable(silBtn));
        scrollIntoView(btn2);
        safeClick(btn2);
    }

    // ----------------- Low-level utilities -----------------

    protected void scrollIntoView(WebElement el) {
        try {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", el);
        } catch (Exception ignored) {}
    }

    protected void safeClick(WebElement el) {
        try {
            el.click();
        } catch (ElementClickInterceptedException | StaleElementReferenceException ex) {
            try {
                new Actions(driver).moveToElement(el).click().perform();
            } catch (Exception ex2) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", el);
            }
        }
    }

    protected void debug(String reason) {
        System.out.println("=== DEBUG START ===");
        System.out.println("REASON: " + reason);
        try {
            System.out.println("URL: " + driver.getCurrentUrl());
            System.out.println("TITLE: " + driver.getTitle());
            String html = driver.getPageSource();
            System.out.println("HTML (ilk 1200): " + html.substring(0, Math.min(1200, html.length())));
        } catch (Exception ex) {
            System.out.println("DEBUG ERROR: " + ex.getMessage());
        }
        System.out.println("=== DEBUG END ===");
    }

    protected String getTokenFromLocalStorage() {
        Object t = ((JavascriptExecutor) driver).executeScript(
                "return window.localStorage.getItem('token');"
        );
        return (t == null) ? null : t.toString();
    }

}
