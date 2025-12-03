package com.example.backend.config;




import ch.qos.logback.classic.encoder.JsonEncoder;
import com.example.backend.repository.UserRepository;
import com.example.backend.user.Role;
import com.example.backend.user.User;
import com.example.backend.user.Work;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
@RequiredArgsConstructor
public class AdminInit {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {

            // If a user exists, don't create anything.
            if (userRepository.count() > 0) {
                return;
            }

            // Encode the matricule exactly like register()
            String rawPassword = "admin123";
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User admin = User.builder()
                    .fullName("System Administrator")
                    .username("admin")
                    .matricule(encodedPassword)   // store encoded matricule
                    .work(Work.QM)               // any default
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);

            System.out.println("=========================================");
            System.out.println("✅ DEFAULT ADMIN CREATED");
            System.out.println("Username: admin");
            System.out.println("Password (matricule): " + rawPassword);
            System.out.println("=========================================");
        };
    }
}