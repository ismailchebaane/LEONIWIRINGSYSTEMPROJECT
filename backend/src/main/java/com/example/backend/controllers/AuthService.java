package com.example.backend.controllers;


import com.example.backend.config.JwtService;
import com.example.backend.repository.UserRepository;
import com.example.backend.user.Role;
import lombok.RequiredArgsConstructor;
import com.example.backend.user.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final JwtService jwtService;
private final AuthenticationManager authenticationManager;
    public AuthenticationResponse register(signinRequest request) {
       var user = User.builder()
               .fullName(request.getFullName())
               .username(request.getUsername())
               .matricule(passwordEncoder.encode(request.getMatricule()))  // Hash the password
               .work(request.getWork())
               .role(request.getRole())
               .build();
       userRepository.save(user);
       var jwtToken =jwtService.GenerateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the password matches
        if (!passwordEncoder.matches(request.getMatricule(), user.getMatricule())) {
            throw new RuntimeException("Invalid credentials");
        }

        var jwtToken = jwtService.GenerateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

}
