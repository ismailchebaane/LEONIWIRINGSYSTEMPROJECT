package com.example.backend.repository;


import com.example.backend.Notification.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientUserIdOrderByTimestampDesc(String recipientUserId);
    long countByRecipientUserIdAndReadFalse(String recipientUserId);

    @Query(value = "{}", fields = "{ 'recipientUserId' : 1 }")


    List<Notification> findByRecipientUserIdAndReadFalse(String userId);

}
