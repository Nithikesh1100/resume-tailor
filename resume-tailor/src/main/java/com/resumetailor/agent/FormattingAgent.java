package com.resumetailor.agent;

import com.resumetailor.dto.AgentContext;
import com.resumetailor.dto.FormattingTask;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Agent responsible for cleaning and structuring the output from the AI.
 * This agent takes the raw AI output and formats it into a structured response.
 */
@Component
@Slf4j
public class FormattingAgent implements Agent<FormattingTask, Object> {

    @Override
    public Object process(FormattingTask task) {
        log.info("{}: Formatting output for task: {}", getName(), task.getTaskType());
        
        switch (task.getTaskType()) {
            case "resume_tailoring":
                return formatResumeTailoringResponse(task.getRawOutput());
            case "cover_letter":
                return formatCoverLetterResponse(task.getRawOutput());
            default:
                return task.getRawOutput();
        }
    }

    @Override
    public String getName() {
        return "FormattingAgent";
    }
    
    /**
     * Format resume tailoring response
     */
    private com.resumetailor.dto.TailorResponse formatResumeTailoringResponse(String rawOutput) {
        List<com.resumetailor.dto.TailorResponse.Suggestion> suggestions = new ArrayList<>();
        List<String> keywordsMatched = new ArrayList<>();
        List<String> keywordsMissing = new ArrayList<>();
        int matchScore = 0;
        
        // Extract suggestions
        Pattern suggestionPattern = Pattern.compile(
                "(?:SUGGESTION\\s+\\d+:|\\d+\\.\\s+)Original:\\s+(.*?)\\s+Improved:\\s+(.*?)\\s+Reason:\\s+(.*?)(?=\\n\\s*(?:SUGGESTION|\\d+\\.|MISSING|SKILLS|MATCH|$))",
                Pattern.DOTALL
        );
        
        Matcher suggestionMatcher = suggestionPattern.matcher(rawOutput);
        while (suggestionMatcher.find()) {
            String original = suggestionMatcher.group(1).trim();
            String improved = suggestionMatcher.group(2).trim();
            String reason = suggestionMatcher.group(3).trim();
            
            suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                    .originalText(original)
                    .suggestedText(improved)
                    .reason(reason)
                    .build());
        }
        
        // Extract missing keywords
        Pattern missingPattern = Pattern.compile(
                "MISSING KEYWORDS:(?:\\s*-\\s*|\\s*\\*\\s*)(.*?)(?=\\n\\s*(?:SKILLS|MATCH|$))",
                Pattern.DOTALL
        );
        
        Matcher missingMatcher = missingPattern.matcher(rawOutput);
        if (missingMatcher.find()) {
            String missingKeywordsText = missingMatcher.group(1).trim();
            keywordsMissing = Arrays.stream(missingKeywordsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
        
        // Extract skills to emphasize
        Pattern skillsPattern = Pattern.compile(
                "SKILLS TO EMPHASIZE:(?:\\s*-\\s*|\\s*\\*\\s*)(.*?)(?=\\n\\s*(?:MATCH|$))",
                Pattern.DOTALL
        );
        
        Matcher skillsMatcher = skillsPattern.matcher(rawOutput);
        if (skillsMatcher.find()) {
            String skillsText = skillsMatcher.group(1).trim();
            keywordsMatched = Arrays.stream(skillsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
        
        // Extract match score
        Pattern scorePattern = Pattern.compile("MATCH SCORE:\\s*(\\d+)");
        Matcher scoreMatcher = scorePattern.matcher(rawOutput);
        if (scoreMatcher.find()) {
            matchScore = Integer.parseInt(scoreMatcher.group(1).trim());
        }
        
        return com.resumetailor.dto.TailorResponse.builder()
                .tailoredResume("") // This would be filled in by a separate process
                .suggestions(suggestions)
                .keywordsMatched(keywordsMatched)
                .keywordsMissing(keywordsMissing)
                .matchScore(matchScore)
                .build();
    }
    
    /**
     * Format cover letter response
     */
    private com.resumetailor.dto.CoverLetterResponse formatCoverLetterResponse(String rawOutput) {
        // For cover letters, we just need to clean up the text a bit
        String cleanedOutput = rawOutput.trim();
        
        return com.resumetailor.dto.CoverLetterResponse.builder()
                .coverLetter(cleanedOutput)
                .build();
    }
}
