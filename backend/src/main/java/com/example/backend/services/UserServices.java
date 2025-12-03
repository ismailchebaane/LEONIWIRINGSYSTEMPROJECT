package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import com.example.backend.user.*;
import com.example.backend.repository.*;

@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServices(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    //get all user
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    
    //get one user with his username
    public Optional<User> getUser(String userName) {
        return userRepository.findByUsername(userName);
    }

    
    // Add User
    public void addUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalStateException("User already exists");
        }

        // Encrypt matricule
        user.setMatricule(passwordEncoder.encode(user.getMatricule()));

        userRepository.save(user);
    }
    
    // delete 
    public void deleteUser(String userName) {

        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new IllegalStateException("User does not exist"));
        userRepository.delete(user);

    }

    
    
    
    //update 
    @Transactional
    public void updateUser(String userName, String fullName, String username,
                           String matricule, Work work, Role role) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new IllegalStateException("User does not exist"));

        // Update Full Name
        if (fullName != null && !fullName.isEmpty() && !Objects.equals(user.getFullName(), fullName)) {
            user.setFullName(fullName);
        }

        // Update Username (Ensure it's unique)
        if (username != null && !username.isEmpty() && !Objects.equals(user.getUsername(), username)) {
            userRepository.findByUsername(username)
                    .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                    .ifPresent(existingUser -> { throw new IllegalStateException("Username already exists"); });

            user.setUsername(username);
        }

        // Update Matricule (Ensure it's unique)
        if (matricule != null && !matricule.isEmpty() && !Objects.equals(user.getMatricule(), matricule)) {
            userRepository.findByMatricule(matricule)
                    .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                    .ifPresent(existingUser -> { throw new IllegalStateException("Matricule already exists"); });

            user.setMatricule(passwordEncoder.encode(matricule));

        }

        // Update Work
        if (work != null && !Objects.equals(user.getWork(), work)) {
            user.setWork(work);
        }

        // Update Role
        if (role != null && !Objects.equals(user.getRole(), role)) {
            user.setRole(role);
        }

        userRepository.save(user);
    }
}
