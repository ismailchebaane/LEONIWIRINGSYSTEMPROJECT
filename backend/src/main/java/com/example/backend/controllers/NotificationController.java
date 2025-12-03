package com.example.backend.controllers;


import com.example.backend.Notification.Notification;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.NotificationService;
import com.example.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public List<Notification> getNotifications(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationService.getNotifications(user.getId());
    }

    @GetMapping("/count")
    public long getUnreadCount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationService.getUnreadCount(user.getId());
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationService.deleteNotification(id, user.getId());
    }
    @PostMapping("/read/{id}")
    public void markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
    }

    @GetMapping("/unread-overlimit")
    public List<Map<String, Object>> getUsersWithTooManyUnreadNotifications() {
        return notificationService.getUsersWithMoreThanTenUnreadNotifications();
    }

}