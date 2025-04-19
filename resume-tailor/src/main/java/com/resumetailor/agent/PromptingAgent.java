package com.resumetailor.agent;

import com.resumetailor.dto.AgentContext;
import com.resumetailor.dto.PromptTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Agent responsible for constructing effective prompts from user inputs.
 * This agent takes the raw user inputs and creates well-structured prompts
 * that will yield the best results from the AI model.
 */
@Component
@Slf4j
public class PromptingAgent implements Agent<AgentContext, String> {

    private final Map<String, PromptTemplate> promptTemplates;

    public PromptingAgent() {
        this.promptTemplates = initializePromptTemplates();
    }

    @Override
    public String process(AgentContext context) {
        log.info("{}: Constructing prompt for task: {}", getName(), context.getTaskType());
        
        PromptTemplate template = promptTemplates.getOrDefault(
                context.getTaskType(), 
                promptTemplates.get("default")
        );
        
        return template.format(context);
    }

    @Override
    public String getName() {
        return "PromptingAgent";
    }
    
    /**
     * Initialize prompt templates for different tasks
     */
    private Map<String, PromptTemplate> initializePromptTemplates() {
        Map<String, PromptTemplate> templates = new HashMap<>();
        
        // Template for resume tailoring
        templates.put("resume_tailoring", context -> {
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("You are an expert resume consultant with years of experience helping people land their dream jobs.\n\n");
            promptBuilder.append("RESUME:\n").append(context.getResumeContent()).append("\n\n");
            promptBuilder.append("JOB DESCRIPTION:\n").append(context.getJobDescription()).append("\n\n");
            promptBuilder.append("TASK: Analyze the resume and job description, then provide the following:\n");
            promptBuilder.append("1. A list of 3-5 specific suggestions to tailor the resume for this job\n");
            promptBuilder.append("2. For each suggestion, include: the original text, the improved version, and the reason for the change\n");
            promptBuilder.append("3. A list of keywords from the job description that are missing in the resume\n");
            promptBuilder.append("4. A list of skills in the resume that should be emphasized for this job\n");
            promptBuilder.append("5. An overall match score (0-100) indicating how well the resume matches the job description\n\n");
            promptBuilder.append("Format your response in a structured way that can be easily parsed. Use clear section headers.");
            
            return promptBuilder.toString();
        });
        
        // Template for cover letter generation
        templates.put("cover_letter", context -> {
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("You are an expert cover letter writer with years of experience in professional writing and career coaching.\n\n");
            promptBuilder.append("RESUME:\n").append(context.getResumeContent()).append("\n\n");
            promptBuilder.append("JOB DESCRIPTION:\n").append(context.getJobDescription()).append("\n\n");
            
            if (context.getAdditionalInfo() != null && !context.getAdditionalInfo().isEmpty()) {
                promptBuilder.append("ADDITIONAL INFORMATION:\n").append(context.getAdditionalInfo()).append("\n\n");
            }
            
            promptBuilder.append("TASK: Write a professional, compelling cover letter that:\n");
            promptBuilder.append("1. Is tailored specifically to this job description\n");
            promptBuilder.append("2. Highlights the most relevant skills and experiences from the resume\n");
            promptBuilder.append("3. Follows a standard cover letter format with proper greeting, introduction, body, and conclusion\n");
            promptBuilder.append("4. Is approximately 300-400 words in length\n");
            promptBuilder.append("5. Has a professional but conversational tone\n");
            promptBuilder.append("6. Includes a call to action in the closing paragraph\n\n");
            promptBuilder.append("Write the complete cover letter text only, without any explanations or meta-commentary.");
            
            return promptBuilder.toString();
        });
        
        // Default template
        templates.put("default", context -> {
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("You are an AI assistant helping with career-related tasks.\n\n");
            
            if (context.getResumeContent() != null) {
                promptBuilder.append("RESUME:\n").append(context.getResumeContent()).append("\n\n");
            }
            
            if (context.getJobDescription() != null) {
                promptBuilder.append("JOB DESCRIPTION:\n").append(context.getJobDescription()).append("\n\n");
            }
            
            if (context.getAdditionalInfo() != null) {
                promptBuilder.append("ADDITIONAL INFORMATION:\n").append(context.getAdditionalInfo()).append("\n\n");
            }
            
            promptBuilder.append("Please provide helpful insights based on the information provided.");
            
            return promptBuilder.toString();
        });
        
        return templates;
    }
}
