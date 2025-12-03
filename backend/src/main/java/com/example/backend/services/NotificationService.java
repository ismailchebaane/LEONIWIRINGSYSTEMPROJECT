package com.example.backend.services;

import com.example.backend.Notification.Notification;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.user.Role;
import com.example.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    @Autowired
    private    UserRepository userRepository;
    public void sendNotification(String senderId, String recipientId, String message, String equipmentId ,String equipmentSerialNumber) {
        Notification notification = Notification.builder()
                .senderUserId(senderId)
                .recipientUserId(recipientId)
                .message(message)
                .equipmentId(equipmentId)
                .equipmentSerialNumber(equipmentSerialNumber)
                .timestamp(LocalDateTime.now())
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByRecipientUserIdOrderByTimestampDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }


    public void deleteNotification(String notificationId, String userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notif.getRecipientUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: cannot delete this notification.");
        }

        notificationRepository.deleteById(notificationId);
    }

    public List<Map<String, Object>> getUsersWithMoreThanTenUnreadNotifications() {
        // Get all unread notifications
        List<Notification> unreadNotifications = notificationRepository.findAll()
                .stream()
                .filter(notif -> !notif.isRead())
                .collect(Collectors.toList());

        // Group by recipientUserId
        Map<String, List<Notification>> grouped = unreadNotifications.stream()
                .collect(Collectors.groupingBy(Notification::getRecipientUserId));

        // Filter groups with size > 10 and build the response
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<String, List<Notification>> entry : grouped.entrySet()) {
            if (entry.getValue().size() > 10) {
                String userId = entry.getKey();

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Map<String, Object> userNotifications = new HashMap<>();
                userNotifications.put("userThatDidntSign", user.getUsername());
                userNotifications.put("list", entry.getValue());

                result.add(userNotifications);
            }
        }

        return result;
    }




}