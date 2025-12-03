package com.example.backend.controllers;
import com.example.backend.services.chatbotservice;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatbotController {

    private final chatbotservice chatbotService;

    public ChatbotController(chatbotservice chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/api/chat")
    public String chat(@RequestBody String query) {
        return chatbotService.getChatbotResponse(query);
    }
}

