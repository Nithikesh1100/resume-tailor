package com.resumetailor.service.ai;

/**
 * Interface for AI providers
 */
public interface AIProvider {
    /**
     * Generate AI response for a given prompt
     *
     * @param prompt The prompt to send to the AI
     * @param apiKey The API key for the AI provider
     * @return The AI-generated response
     */
    String generateResponse(String prompt, String apiKey);
    
    /**
     * Get the name of the AI provider
     *
     * @return The provider name
     */
    String getName();
}
