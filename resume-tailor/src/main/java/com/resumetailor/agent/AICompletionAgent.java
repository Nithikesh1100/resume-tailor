package com.resumetailor.agent;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

/**
 * Agent responsible for making calls to the OpenAI API.
 * This agent takes a prompt and returns the AI-generated response.
 */
@Component
@Slf4j
public class AICompletionAgent implements Agent<AICompletionAgent.AICompletionRequest, String> {

    @Value("${openai.model}")
    private String defaultModel;
    
    @Override
    public String process(AICompletionRequest request) {
        log.info("{}: Making API call to OpenAI with model: {}", getName(), request.getModel());
        
        try {
            // Create OpenAI service with user's API key
            OpenAiService service = new OpenAiService(request.getApiKey(), Duration.ofSeconds(60));
            
            // Create chat completion request
            ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                    .model(request.getModel())
                    .messages(List.of(new ChatMessage("user", request.getPrompt())))
                    .maxTokens(request.getMaxTokens())
                    .temperature(request.getTemperature())
                    .build();
            
            // Call OpenAI API
            return service.createChatCompletion(completionRequest)
                    .getChoices().get(0).getMessage().getContent();
            
        } catch (Exception e) {
            log.error("{}: Error generating AI response: {}", getName(), e.getMessage());
            
            if (request.isFallbackToMock()) {
                log.info("{}: Falling back to mock response", getName());
                return generateMockResponse(request.getPrompt());
            }
            
            throw new RuntimeException("Failed to generate AI response: " + e.getMessage(), e);
        }
    }

    @Override
    public String getName() {
        return "AICompletionAgent";
    }
    
    /**
     * Generate mock AI response for demonstration purposes
     */
    private String generateMockResponse(String prompt) {
        if (prompt.contains("cover letter")) {
            return generateMockCoverLetter();
        } else if (prompt.contains("tailor")) {
            return generateMockTailoringResponse();
        } else {
            return "I'm sorry, I couldn't process your request. Please try again later.";
        }
    }
    
    /**
     * Generate mock cover letter for demonstration purposes
     */
    private String generateMockCoverLetter() {
        return """
                John Doe
                123 Main Street
                City, State 12345
                Phone: (123) 456-7890
                Email: john.doe@email.com
                
                April 13, 2025
                
                Hiring Manager
                Company Name
                City, State 12345
                
                Dear Hiring Manager,
                
                I am writing to express my interest in the Software Engineer position at your company, as advertised on your website. With my strong background in Java development and experience with Spring Boot, I believe I would be a valuable addition to your team.
                
                Throughout my career, I have developed expertise in building scalable web applications and RESTful APIs. In my current role at Tech Solutions Inc., I have successfully led the development of a microservices architecture that improved system reliability by 40%. I have also implemented CI/CD pipelines that reduced deployment time by 60%.
                
                Your job description mentions the need for someone with strong problem-solving skills and experience with cloud technologies. During my time at Previous Company, I designed and implemented cloud-native applications using AWS services, which resulted in a 30% reduction in infrastructure costs. I am also passionate about writing clean, maintainable code and have mentored junior developers to ensure code quality across projects.
                
                I am particularly drawn to your company because of your innovative approach to software development and your commitment to creating products that make a difference. I am excited about the opportunity to contribute to your team and help drive your mission forward.
                
                Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.
                
                Sincerely,
                
                John Doe
                """;
    }
    
    /**
     * Generate mock tailoring response for demonstration purposes
     */
    private String generateMockTailoringResponse() {
        return """
                SUGGESTIONS:
                
                1. Original: Experienced software engineer with a focus on backend development
                   Improved: Experienced software engineer with expertise in full-stack development and cloud technologies
                   Reason: The job description emphasizes full-stack skills and cloud experience
                
                2. Original: Implemented RESTful APIs using Spring Boot
                   Improved: Designed and implemented scalable RESTful APIs using Spring Boot and microservices architecture
                   Reason: The job requires experience with microservices and scalable systems
                
                3. Original: Proficient in Java, Python, and SQL
                   Improved: Proficient in Java, Python, SQL, and JavaScript with React experience
                   Reason: The job description specifically mentions JavaScript and React as required skills
                
                4. Original: Bachelor's degree in Computer Science
                   Improved: Bachelor's degree in Computer Science with continuous learning through relevant certifications
                   Reason: The job values continuous learning and professional development
                
                5. Original: Worked on database optimization
                   Improved: Optimized database performance resulting in 40% faster query response times and improved application scalability
                   Reason: Quantifying achievements makes your experience more impactful
                
                MISSING KEYWORDS:
                - React
                - JavaScript
                - CI/CD
                - Docker
                - Kubernetes
                - Agile
                - Scrum
                
                SKILLS TO EMPHASIZE:
                - Java
                - Spring Boot
                - Microservices
                - REST APIs
                - Cloud technologies
                
                MATCH SCORE: 65
                """;
    }
    
    /**
     * Request class for AICompletionAgent
     */
    public static class AICompletionRequest {
        private final String prompt;
        private final String apiKey;
        private final String model;
        private final int maxTokens;
        private final double temperature;
        private final boolean fallbackToMock;
        
        private AICompletionRequest(Builder builder) {
            this.prompt = builder.prompt;
            this.apiKey = builder.apiKey;
            this.model = builder.model;
            this.maxTokens = builder.maxTokens;
            this.temperature = builder.temperature;
            this.fallbackToMock = builder.fallbackToMock;
        }
        
        public String getPrompt() {
            return prompt;
        }
        
        public String getApiKey() {
            return apiKey;
        }
        
        public String getModel() {
            return model;
        }
        
        public int getMaxTokens() {
            return maxTokens;
        }
        
        public double getTemperature() {
            return temperature;
        }
        
        public boolean isFallbackToMock() {
            return fallbackToMock;
        }
        
        public static class Builder {
            private String prompt;
            private String apiKey;
            private String model = "gpt-4";
            private int maxTokens = 2048;
            private double temperature = 0.7;
            private boolean fallbackToMock = true;
            
            public Builder prompt(String prompt) {
                this.prompt = prompt;
                return this;
            }
            
            public Builder apiKey(String apiKey) {
                this.apiKey = apiKey;
                return this;
            }
            
            public Builder model(String model) {
                this.model = model;
                return this;
            }
            
            public Builder maxTokens(int maxTokens) {
                this.maxTokens = maxTokens;
                return this;
            }
            
            public Builder temperature(double temperature) {
                this.temperature = temperature;
                return this;
            }
            
            public Builder fallbackToMock(boolean fallbackToMock) {
                this.fallbackToMock = fallbackToMock;
                return this;
            }
            
            public AICompletionRequest build() {
                return new AICompletionRequest(this);
            }
        }
    }
}
