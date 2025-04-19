package com.resumetailor.service;

import com.resumetailor.agent.AgentOrchestrator;
import com.resumetailor.dto.CoverLetterRequest;
import com.resumetailor.dto.CoverLetterResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterService {

    private final AgentOrchestrator agentOrchestrator;

    /**
     * Generate a cover letter based on resume and job description using AI
     *
     * @param request Contains resume content, job description, additional info, and API key
     * @return Generated cover letter
     */
    public CoverLetterResponse generateCoverLetter(CoverLetterRequest request) {
        log.info("Generating cover letter based on resume and job description");
        
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
        return agentOrchestrator.generateCoverLetter(request);
    }
}
