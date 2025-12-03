package com.example.backend.Notification;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;
    private String recipientUserId;
    private String senderUserId;
    private String message;
    private boolean read = false;
    private LocalDateTime timestamp;
    private String equipmentId;
    private String equipmentSerialNumber;

}
