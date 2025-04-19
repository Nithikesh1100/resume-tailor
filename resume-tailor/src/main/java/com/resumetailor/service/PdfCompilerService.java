package com.resumetailor.service;

import com.resumetailor.agent.AgentOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfCompilerService {

    private final AgentOrchestrator agentOrchestrator;

    /**
     * Compile LaTeX content to PDF
     *
     * @param latexContent LaTeX content to compile
     * @return Compiled PDF as byte array
     */
    public byte[] compilePdf(String latexContent) {
        log.info("Compiling LaTeX content to PDF");
        
        if (latexContent == null || latexContent.isEmpty()) {
            throw new IllegalArgumentException("LaTeX content cannot be empty");
        }
        
        // Delegate to the agent orchestrator
        return agentOrchestrator.compilePdf(latexContent);
    }
}
