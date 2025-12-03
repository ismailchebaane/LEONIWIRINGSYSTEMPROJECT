package com.example.backend.Equipment;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "documents")
public class DocumentEntity {

    @Id
    private String id;
    private String name;
    private String filePath;
    private boolean homologated = false;

    private LocalDateTime uploadDate;
}

