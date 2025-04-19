package com.resumetailor.dto;

/**
 * Functional interface for prompt templates.
 * This allows for different prompt templates to be defined for different tasks.
 */
@FunctionalInterface
public interface PromptTemplate {
    /**
     * Format the prompt using the given context
     *
     * @param context The agent context
     * @return The formatted prompt
     */
    String format(AgentContext context);
}
