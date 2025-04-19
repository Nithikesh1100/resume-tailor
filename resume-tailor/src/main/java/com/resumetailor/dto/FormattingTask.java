package com.resumetailor.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Task object for the FormattingAgent.
 * Contains the raw output from the AI and the task type.
 */
@Data
@Builder
public class FormattingTask {
    private String taskType;
    private String rawOutput;
}
