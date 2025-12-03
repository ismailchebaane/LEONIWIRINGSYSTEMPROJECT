package com.example.backend.controllers;

import com.example.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.example.backend.user.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import com.example.backend.services.*;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private final UserServices userServices;
    @Autowired
    UserRepository userRepository;
    public UserController(UserServices userServices) {
        this.userServices = userServices;
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/api/user")
    public List<User> getUsers() {
        return userServices.getUsers();
  
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/api/user/{userName}")
    public Optional<User> getUser(@PathVariable("userName") String userName) {

        return userServices.getUser(userName);
    }
    // Get current logged-in user info
    @GetMapping("/api/user/me")
    public User getCurrentUser(Principal principal) {

        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get users by work role
    @GetMapping("/api/user/by-work/{work}")
    public List<User> getUsersByWork(@PathVariable Work work) {
        return userRepository.findByWork(work);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add/user")
    public ResponseEntity<?> addUser(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        userServices.addUser(user);
        return ResponseEntity.ok("User added successfully!");
    }

    
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(path = "/delete/user/{userName}")
    public void deleteUser(@PathVariable("userName") String userName) {
        userServices.deleteUser(userName);
    }



    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(path = "/update/user/{userName}")
    public ResponseEntity<?> updateUser(
            @PathVariable("userName") String userName,
            @RequestBody User updateDTO) {
    System.out.print(updateDTO);
        try {
            userServices.updateUser(
                    userName,
                    updateDTO.getFullName(),
                    updateDTO.getUsername(),
                    updateDTO.getMatricule(),
                    updateDTO.getWork(),
                    updateDTO.getRole()
            );
            return ResponseEntity.ok("User updated successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
