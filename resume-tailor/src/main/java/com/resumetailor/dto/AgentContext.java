package com.resumetailor.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Context object that contains all the information needed by agents.
 * This is passed between agents to maintain state throughout the process.
 */
@Data
@Builder
public class AgentContext {
    private String taskType;
    private String resumeContent;
    private String jobDescription;
    private String additionalInfo;
    private String apiKey;
}
