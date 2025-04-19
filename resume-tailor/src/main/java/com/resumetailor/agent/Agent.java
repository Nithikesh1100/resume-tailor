package com.resumetailor.agent;

/**
 * Base interface for all agents in the system.
 * Agents are specialized components that handle specific tasks in the AI workflow.
 *
 * @param <I> Input type
 * @param <O> Output type
 */
public interface Agent<I, O> {
    
    /**
     * Process the input and produce an output
     *
     * @param input The input to process
     * @return The processed output
     */
    O process(I input);
    
    /**
     * Get the name of the agent
     *
     * @return The agent name
     */
    String getName();
}
