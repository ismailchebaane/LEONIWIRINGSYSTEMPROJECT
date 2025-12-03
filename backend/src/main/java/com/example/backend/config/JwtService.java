package com.example.backend.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {
        private static final String SECRET_KEY="yasCZzBTutAPE1U+9NAgWNAlzanohYMGXoLBUjOvopA=";



        public String GenerateToken(UserDetails userDetails){
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", userDetails.getAuthorities().stream()
                                          .map(GrantedAuthority::getAuthority)
                                          .collect(Collectors.toList()));
            return GenerateToken(claims, userDetails);
        }


        public String GenerateToken(Map<String,Object> extraCLaims, UserDetails userDetails){
        return Jwts
                .builder()
                .setClaims(extraCLaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000 * 60 * 60 * 24))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
        }


    public String extractUsername(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    public <T>  T extractClaim(String token, Function<Claims, T> ClaimsResolver){
        final Claims claims=extractAllClaims(token);
        return ClaimsResolver.apply(claims);

    }


    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder().setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Boolean  isTokenValid(String token, UserDetails userDetails){
            final String  username = extractUsername(token);
            return (username.equals(userDetails.getUsername()))&& !isTokenExpired(token)  ;
    }

    private boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
    }
    
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }


    private Date extractExpiration(String token) {
            return extractClaim(token,Claims::getExpiration);
    }
}
