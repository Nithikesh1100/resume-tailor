package com.resumetailor.service.ai;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component
@Slf4j
public class OpenAIProvider implements AIProvider {

    @Value("${openai.model}")
    private String model;

    @Override
    public String generateResponse(String prompt, String apiKey) {
        log.info("Generating response using OpenAI");
        
        try {
            // Create OpenAI service with user's API key
            OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(60));
            
            // Create chat completion request
            ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(List.of(new ChatMessage("user", prompt)))
                    .maxTokens(2048)
                    .temperature(0.7)
                    .build();
            
            // Call OpenAI API
            return service.createChatCompletion(completionRequest)
                    .getChoices().get(0).getMessage().getContent();
            
        } catch (Exception e) {
            log.error("Error generating OpenAI response", e);
            throw e;
        }
    }

    @Override
    public String getName() {
        return "openai";
    }
}
