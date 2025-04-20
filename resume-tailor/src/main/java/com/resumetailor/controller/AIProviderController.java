package com.resumetailor.controller;

import com.resumetailor.service.ai.AIProviderFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai/providers")
@RequiredArgsConstructor
@Slf4j
public class AIProviderController {

    private final AIProviderFactory providerFactory;
    
    /**
     * Get available AI providers
     *
     * @return List of available AI provider names
     */
    @GetMapping
    public ResponseEntity<List<String>> getProviders() {
        log.info("Received request to get available AI providers");
        List<String> providers = providerFactory.getAvailableProviders();
        return ResponseEntity.ok(providers);
    }
}
