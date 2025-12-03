package com.example.backend.controllers;

import com.example.backend.user.Role;
import com.example.backend.user.Work;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class signinRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Matricule is required")
    private String matricule;

    @NotNull(message = "Work is required")
    private Work work;
    @NotNull(message = "Role is required")
    private Role role;
    // Constructor, getters, and setters are automatically handled by Lombok (@Getter, @Setter)
}