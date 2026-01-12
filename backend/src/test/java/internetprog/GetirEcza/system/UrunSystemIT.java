package internetprog.GetirEcza.system;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.*;

public class UrunSystemIT {

    static HttpClient client;

    // ✅ Tek kaynaktan BASE (Jenkins’te/yerelde override edebilirsin)
    // Örn: mvn -DAPP_API_BASE=http://localhost:8081 verify
    static String BASE;

    // ✅ Seed edilen kullanıcılar (logda bunlar görünüyor)
    static final String ADMIN_EMAIL = "admin@getirecza.com";
    static final String ADMIN_PASS  = "Test123!";

    static final String USER_EMAIL  = "user@getirecza.com";
    static final String USER_PASS   = "Test123!";


    @BeforeAll
    static void setup() {
        client = HttpClient.newHttpClient();
        String v = System.getProperty("APP_API_BASE");
        BASE = (v == null || v.isBlank()) ? "http://localhost:8082" : v.trim();
        if (BASE.endsWith("/")) BASE = BASE.substring(0, BASE.length() - 1);
        System.out.println("APP_API_BASE=" + BASE);
    }

    // ---------------- SENARYO 1 ----------------
    // Token olmadan ürün ekleme -> 403
    @Test
    void senaryo1_tokenOlmadanUrunEkle_403Donmeli() throws Exception {

        String json = """
        {
          "ad": "Yetkisiz Urun",
          "aciklama": "Token yok",
          "fiyat": 5,
          "stokDurumu": 1,
          "gorselUrl": "img",
          "kategoriId": 1
        }
        """;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE + "/api/urunler"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("S1 status=" + response.statusCode() + " body=" + response.body());
        assertEquals(403, response.statusCode(), "Token olmadan 403 dönmeli");
    }

    // ---------------- SENARYO 2 ----------------
    // Admin login -> 200 + token dönmeli
    @Test
    void senaryo2_adminLogin_tokenAlinmali() throws Exception {

        String loginJson = """
        {
          "email": "%s",
          "sifre": "%s"
        }
        """.formatted(ADMIN_EMAIL, ADMIN_PASS);

        HttpResponse<String> response = postJson("/api/auth/login", loginJson);

        System.out.println("S2 status=" + response.statusCode() + " body=" + response.body());
        assertEquals(200, response.statusCode(), "Login 200 dönmeli");

        String token = extractString(response.body(), "token");
        assertNotNull(token, "JWT token alınmalı");
        assertFalse(token.isBlank(), "JWT token boş olamaz");
    }

    // ---------------- SENARYO 3 ----------------
    // Admin login -> ürün ekle (201 + id) -> ürünü sil (204)
    @Test
    void senaryo3_adminIleUrunEkle_201_ve_sonraSil_204() throws Exception {

        String token = adminLoginAndGetToken();
        assertNotNull(token);
        assertFalse(token.isBlank());

        String createJson = """
        {
          "ad": "System Parol",
          "aciklama": "JWT ile eklendi",
          "fiyat": 10.50,
          "stokDurumu": 5,
          "gorselUrl": "img",
          "kategoriId": 1
        }
        """;

        HttpRequest createReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE + "/api/urunler"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(createJson))
                .build();

        HttpResponse<String> createRes = client.send(createReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("S3-CREATE status=" + createRes.statusCode() + " body=" + createRes.body());
        assertEquals(201, createRes.statusCode(), "Admin ile ürün ekleme 201 dönmeli");

        Long createdId = extractLong(createRes.body(), "id");
        assertNotNull(createdId, "Response içinde id olmalı");
        assertTrue(createdId > 0, "id pozitif olmalı");

        HttpRequest deleteReq = HttpRequest.newBuilder()
                .uri(URI.create(BASE + "/api/urunler/" + createdId))
                .header("Authorization", "Bearer " + token)
                .DELETE()
                .build();

        HttpResponse<String> deleteRes = client.send(deleteReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("S3-DELETE status=" + deleteRes.statusCode() + " body=" + deleteRes.body());
        assertEquals(204, deleteRes.statusCode(), "Admin ile ürün silme 204 dönmeli");
    }

    // ---------------- yardımcılar ----------------

    private static HttpResponse<String> postJson(String path, String json) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE + path))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private static String adminLoginAndGetToken() throws Exception {
        String loginJson = """
        {
          "email": "%s",
          "sifre": "%s"
        }
        """.formatted(ADMIN_EMAIL, ADMIN_PASS);

        HttpResponse<String> response = postJson("/api/auth/login", loginJson);

        System.out.println("LOGIN status=" + response.statusCode() + " body=" + response.body());
        assertEquals(200, response.statusCode(), "Login 200 dönmeli");

        return extractString(response.body(), "token");
    }

    // {"id":44,...} gibi basit JSON'dan long çeker
    private static Long extractLong(String json, String key) {
        if (json == null) return null;

        int i = json.indexOf("\"" + key + "\"");
        if (i < 0) return null;

        int colon = json.indexOf(":", i);
        if (colon < 0) return null;

        int j = colon + 1;
        while (j < json.length() && Character.isWhitespace(json.charAt(j))) j++;

        int end = j;
        while (end < json.length() && Character.isDigit(json.charAt(end))) end++;

        if (end == j) return null;
        return Long.parseLong(json.substring(j, end));
    }

    // {"token":"...."} gibi basit JSON'dan string çeker
    private static String extractString(String json, String key) {
        if (json == null) return null;

        int i = json.indexOf("\"" + key + "\"");
        if (i < 0) return null;

        int colon = json.indexOf(":", i);
        if (colon < 0) return null;

        int firstQuote = json.indexOf("\"", colon + 1);
        if (firstQuote < 0) return null;

        int secondQuote = json.indexOf("\"", firstQuote + 1);
        if (secondQuote < 0) return null;

        return json.substring(firstQuote + 1, secondQuote);
    }
}
