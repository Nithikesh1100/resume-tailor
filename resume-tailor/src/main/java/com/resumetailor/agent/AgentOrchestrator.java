package com.resumetailor.agent;

import com.resumetailor.dto.AgentContext;
import com.resumetailor.dto.CoverLetterRequest;
import com.resumetailor.dto.CoverLetterResponse;
import com.resumetailor.dto.FormattingTask;
import com.resumetailor.dto.TailorRequest;
import com.resumetailor.dto.TailorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
* Orchestrator that coordinates the flow between different agents.
* This component manages the execution of the agent pipeline for different tasks.
*/
@Component
@RequiredArgsConstructor
@Slf4j
public class AgentOrchestrator {

   private final PromptingAgent promptingAgent;
   private final AICompletionAgent aiCompletionAgent;
   private final FormattingAgent formattingAgent;
   private final PDFAgent pdfAgent;
   
   /**
    * Orchestrate the resume tailoring process
    *
    * @param request The tailor request
    * @return The tailor response
    */
   public TailorResponse tailorResume(TailorRequest request) {
       log.info("Orchestrating resume tailoring process");
       
       // Step 1: Create context for the agents
       AgentContext context = AgentContext.builder()
               .taskType("resume_tailoring")
               .resumeContent(request.getResumeContent())
               .jobDescription(request.getJobDescription())
               .build();
       
       // Step 2: Generate prompt using PromptingAgent
       String prompt = promptingAgent.process(context);
       log.debug("Generated prompt: {}", prompt);
       
       // Step 3: Get AI completion using AICompletionAgent
       AICompletionAgent.AICompletionRequest completionRequest = new AICompletionAgent.AICompletionRequest.Builder()
               .prompt(prompt)
               .apiKey(request.getApiKey())
               .provider(request.getProvider() != null ? request.getProvider() : "openai") // Use provider from request
               .build();
       
       String aiResponse = aiCompletionAgent.process(completionRequest);
       log.debug("AI response: {}", aiResponse);
       
       // Step 4: Format the response using FormattingAgent
       FormattingTask formattingTask = FormattingTask.builder()
               .taskType("resume_tailoring")
               .rawOutput(aiResponse)
               .build();
       
       TailorResponse response = (TailorResponse) formattingAgent.process(formattingTask);
       
       return response;
   }
   
   /**
    * Orchestrate the cover letter generation process
    *
    * @param request The cover letter request
    * @return The cover letter response
    */
   public CoverLetterResponse generateCoverLetter(CoverLetterRequest request) {
       log.info("Orchestrating cover letter generation process");
       
       // Step 1: Create context for the agents
       AgentContext context = AgentContext.builder()
               .taskType("cover_letter")
               .resumeContent(request.getResumeContent())
               .jobDescription(request.getJobDescription())
               .additionalInfo(request.getAdditionalInfo())
               .build();
       
       // Step 2: Generate prompt using PromptingAgent
       String prompt = promptingAgent.process(context);
       log.debug("Generated prompt: {}", prompt);
       
       // Step 3: Get AI completion using AICompletionAgent
       AICompletionAgent.AICompletionRequest completionRequest = new AICompletionAgent.AICompletionRequest.Builder()
               .prompt(prompt)
               .apiKey(request.getApiKey())
               .provider(request.getProvider() != null ? request.getProvider() : "openai") // Use provider from request
               .maxTokens(2500) // Cover letters might need more tokens
               .build();
       
       String aiResponse = aiCompletionAgent.process(completionRequest);
       log.debug("AI response: {}", aiResponse);
       
       // Step 4: Format the response using FormattingAgent
       FormattingTask formattingTask = FormattingTask.builder()
               .taskType("cover_letter")
               .rawOutput(aiResponse)
               .build();
       
       CoverLetterResponse response = (CoverLetterResponse) formattingAgent.process(formattingTask);
       
       return response;
   }
   
   /**
    * Orchestrate the PDF compilation process
    *
    * @param latexContent The LaTeX content
    * @return The compiled PDF as byte array
    */
   public byte[] compilePdf(String latexContent) {
       log.info("Orchestrating PDF compilation process");
       
       // Use PDFAgent to compile LaTeX to PDF
       return pdfAgent.process(latexContent);
   }
}
