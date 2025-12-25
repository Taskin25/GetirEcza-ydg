package internetprog.GetirEcza.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;

import java.util.*;

@Component
public class JwtUtil {

    private final String SECRET = "4d1c8825db28a353bb13c5a52edfe9ae9a6e24c3d4225cd4fbdd5fd9870761a4511f30026725c7e573166270d62a091c400e8f26493ad410f358328673b08b3d4ff75cfe0ae659674446a53b9a6dcdb51063f85007f281cf791347553616065c514724de8117a6ebe0c4b5a917a40920bcb08fd85638ad71ce60efaed2f34bf02de20a145ec2169f118494920669fd9b793d4be0e26c7b0078cd2248ddd75c4628a6833442b6400cd71ae682c892fc1dd1460d4dcbd3c0df39230747110fb6c0107c74104b03e9de9c24f23791bbefeec0286c18c4e13b248934c8549fabb7e1178c2fe1b70a571fef7d2fd4178cd24e356cf80d803aa272eccdf4df2b91bfe2"; // application.properties ile entegre edebilirsin

    public String generateToken(UserDetails userDetails, Long kullaniciId) {
        Map<String, Object> claims = new HashMap<>();


        claims.put("kullaniciId", kullaniciId);
        claims.put("role", userDetails.getAuthorities()
                .stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("ROLE_USER"));

        claims.put("authorities", userDetails.getAuthorities()
                .stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .toList()); // 🌟 asıl eksik olan bu!

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        // "kullaniciId" olarak claim'e koymuştuk, şimdi onu alıyoruz
        Object id = claims.get("kullaniciId");
        return Long.valueOf(id.toString());
    }



    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername());
    }
    public String getSecret() {
        return SECRET;
    }

}
