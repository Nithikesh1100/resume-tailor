package com.resumetailor.service;

import com.resumetailor.agent.AgentOrchestrator;
import com.resumetailor.dto.TailorRequest;
import com.resumetailor.dto.TailorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeTailorService {

    private final AgentOrchestrator agentOrchestrator;

    /**
     * Tailor a resume based on a job description using AI
     *
     * @param request Contains resume content, job description, and API key
     * @return Tailored resume suggestions
     */
    public TailorResponse tailorResume(TailorRequest request) {
        log.info("Tailoring resume based on job description");
        
        if (request.getResumeContent() == null || request.getResumeContent().isEmpty()) {
            throw new IllegalArgumentException("Resume content cannot be empty");
        }
        
        if (request.getJobDescription() == null || request.getJobDescription().isEmpty()) {
            throw new IllegalArgumentException("Job description cannot be empty");
        }
        
        if (request.getApiKey() == null || request.getApiKey().isEmpty()) {
            throw new IllegalArgumentException("API key cannot be empty");
        }
        
        // Delegate to the agent orchestrator
        return agentOrchestrator.tailorResume(request);
    }
}
