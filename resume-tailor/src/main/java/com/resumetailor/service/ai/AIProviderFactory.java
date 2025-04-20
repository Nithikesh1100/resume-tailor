package com.resumetailor.service.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AIProviderFactory {
    
    private final List<AIProvider> providers;
    
    // Remove this field initialization and constructor
    // private final Map<String, AIProvider> providerMap;
    
    // public AIProviderFactory(List<AIProvider> providers) {
    //     this.providers = providers;
    //     this.providerMap = providers.stream()
    //             .collect(Collectors.toMap(AIProvider::getName, Function.identity()));
    // }
    
    public AIProvider getProvider(String providerName) {
        // Create the map on-demand instead of at construction time
        Map<String, AIProvider> providerMap = providers.stream()
                .collect(Collectors.toMap(AIProvider::getName, Function.identity()));
                
        AIProvider provider = providerMap.get(providerName.toLowerCase());
        if (provider == null) {
            throw new IllegalArgumentException("Unsupported AI provider: " + providerName);
        }
        return provider;
    }
    
    public List<String> getAvailableProviders() {
        return providers.stream()
                .map(AIProvider::getName)
                .collect(Collectors.toList());
    }
}
