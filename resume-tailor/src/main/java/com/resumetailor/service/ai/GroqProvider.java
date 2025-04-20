package com.resumetailor.service.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class GroqProvider implements AIProvider {

    private final WebClient webClient;
    
    @Value("${groq.model:llama3-70b-8192}")
    private String model;
    
    public GroqProvider(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.groq.com/openai/v1").build();
    }

    @Override
    public String generateResponse(String prompt, String apiKey) {
        log.info("Generating response using Groq with model: {}", model);
        
        try {
            // Create request body
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.7,
                "max_tokens", 2048
            );
            
            // Call Groq API
            Map<String, Object> response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            
            throw new RuntimeException("Invalid response from Groq API");
            
        } catch (Exception e) {
            log.error("Error generating Groq response", e);
            throw e;
        }
    }

    @Override
    public String getName() {
        return "groq";
    }
}
