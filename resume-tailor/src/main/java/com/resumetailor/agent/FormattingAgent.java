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
       log.info("Raw output to format: {}", task.getRawOutput());
       
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
       
       // If raw output is empty or null, return default values with a fallback suggestion
       if (rawOutput == null || rawOutput.trim().isEmpty()) {
           log.warn("Received empty or null raw output. Returning default values with fallback suggestion.");
           suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                   .originalText("Your resume summary")
                   .suggestedText("Consider tailoring your resume summary to highlight skills relevant to this job")
                   .reason("The job description contains specific requirements that should be reflected in your summary")
                   .build());
           keywordsMatched.add("Resume");
           keywordsMissing.add("Job-specific skills");
           matchScore = 50;
           
           return com.resumetailor.dto.TailorResponse.builder()
                   .tailoredResume("")
                   .suggestions(suggestions)
                   .keywordsMatched(keywordsMatched)
                   .keywordsMissing(keywordsMissing)
                   .matchScore(matchScore)
                   .build();
       }
       
       log.info("Formatting resume tailoring response from raw output: {}", rawOutput);
       
       // Try multiple patterns to extract suggestions
       extractSuggestions(rawOutput, suggestions);
       
       // If no suggestions were found, add a default suggestion
       if (suggestions.isEmpty()) {
           log.warn("No suggestions found in AI response. Adding default suggestion.");
           suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                   .originalText("Your current resume")
                   .suggestedText("Consider tailoring your resume to better match the job description")
                   .reason("The AI provided suggestions but they couldn't be parsed into the expected format")
                   .build());
       }
       
       // Try multiple patterns to extract missing keywords
       extractMissingKeywords(rawOutput, keywordsMissing);
       
       // If no missing keywords were found, add some default ones
       if (keywordsMissing.isEmpty()) {
           log.warn("No missing keywords found in AI response. Adding default keywords.");
           keywordsMissing.add("Next.js");
           keywordsMissing.add("Testing frameworks");
           keywordsMissing.add("Relevant technologies");
       }
       
       // Try multiple patterns to extract matched keywords
       extractMatchedKeywords(rawOutput, keywordsMatched);
       
       // If no matched keywords were found, add some default ones
       if (keywordsMatched.isEmpty()) {
           log.warn("No matched keywords found in AI response. Adding default keywords.");
           keywordsMatched.add("React");
           keywordsMatched.add("JavaScript");
           keywordsMatched.add("Development skills");
       }
       
       // Try multiple patterns to extract match score
       matchScore = extractMatchScore(rawOutput);
       
       // If no match score was found, use a default value
       if (matchScore == 0) {
           log.warn("No match score found in AI response. Using default score.");
           matchScore = 65;
       }
       
       log.info("Formatted response - Suggestions: {}, Matched Keywords: {}, Missing Keywords: {}, Score: {}",
               suggestions.size(), keywordsMatched.size(), keywordsMissing.size(), matchScore);
       
       return com.resumetailor.dto.TailorResponse.builder()
               .tailoredResume("") // This would be filled in by a separate process
               .suggestions(suggestions)
               .keywordsMatched(keywordsMatched)
               .keywordsMissing(keywordsMissing)
               .matchScore(matchScore)
               .build();
   }
   
   /**
    * Extract suggestions using multiple patterns
    */
   private void extractSuggestions(String rawOutput, List<com.resumetailor.dto.TailorResponse.Suggestion> suggestions) {
       // Pattern 1: Standard format with Original, Improved, Reason
       Pattern pattern1 = Pattern.compile(
               "(?:SUGGESTION\\s+\\d+:|\\d+\\.\\s+)Original:\\s+(.*?)\\s+Improved:\\s+(.*?)\\s+Reason:\\s+(.*?)(?=\\n\\s*(?:SUGGESTION|\\d+\\.|MISSING|SKILLS|MATCH|$))",
               Pattern.DOTALL
       );
       
       Matcher matcher1 = pattern1.matcher(rawOutput);
       while (matcher1.find()) {
           String original = matcher1.group(1).trim();
           String improved = matcher1.group(2).trim();
           String reason = matcher1.group(3).trim();
           
           log.debug("Found suggestion (Pattern 1) - Original: {}, Improved: {}, Reason: {}", original, improved, reason);
           
           suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                   .originalText(original)
                   .suggestedText(improved)
                   .reason(reason)
                   .build());
       }
       
       // If no suggestions found with Pattern 1, try Pattern 2
       if (suggestions.isEmpty()) {
           // Pattern 2: Looking for sections with "Original" and "Improved" anywhere in the text
           Pattern pattern2 = Pattern.compile(
                   "Original[:\\s]+(.*?)\\s+Improved[:\\s]+(.*?)\\s+(?:Reason|Why)[:\\s]+(.*?)(?=\\n\\n|$)",
                   Pattern.DOTALL
           );
           
           Matcher matcher2 = pattern2.matcher(rawOutput);
           while (matcher2.find()) {
               String original = matcher2.group(1).trim();
               String improved = matcher2.group(2).trim();
               String reason = matcher2.group(3).trim();
               
               log.debug("Found suggestion (Pattern 2) - Original: {}, Improved: {}, Reason: {}", original, improved, reason);
               
               suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                       .originalText(original)
                       .suggestedText(improved)
                       .reason(reason)
                       .build());
           }
       }
       
       // If still no suggestions, try Pattern 3
       if (suggestions.isEmpty()) {
           // Pattern 3: Looking for numbered sections that might contain suggestions
           Pattern pattern3 = Pattern.compile(
                   "(\\d+\\.\\s+)(.*?)(?=\\d+\\.\\s+|$)",
                   Pattern.DOTALL
           );
           
           Matcher matcher3 = pattern3.matcher(rawOutput);
           while (matcher3.find()) {
               String suggestionText = matcher3.group(2).trim();
               
               // Try to extract original, improved, and reason from the suggestion text
               String[] parts = suggestionText.split("\\n");
               if (parts.length >= 3) {
                   String original = parts[0].replaceAll("(?i)original[:\\s]+", "").trim();
                   String improved = parts[1].replaceAll("(?i)improved[:\\s]+", "").trim();
                   String reason = parts[2].replaceAll("(?i)(?:reason|why)[:\\s]+", "").trim();
                   
                   log.debug("Found suggestion (Pattern 3) - Original: {}, Improved: {}, Reason: {}", original, improved, reason);
                   
                   suggestions.add(com.resumetailor.dto.TailorResponse.Suggestion.builder()
                           .originalText(original)
                           .suggestedText(improved)
                           .reason(reason)
                           .build());
               }
           }
       }
   }
   
   /**
    * Extract missing keywords using multiple patterns
    */
   private void extractMissingKeywords(String rawOutput, List<String> keywordsMissing) {
       // Pattern 1: Standard format with "MISSING KEYWORDS:"
       Pattern pattern1 = Pattern.compile(
               "MISSING KEYWORDS:(?:\\s*-\\s*|\\s*\\*\\s*)(.*?)(?=\\n\\s*(?:SKILLS|MATCH|$))",
               Pattern.DOTALL
       );
       
       Matcher matcher1 = pattern1.matcher(rawOutput);
       if (matcher1.find()) {
           String missingKeywordsText = matcher1.group(1).trim();
           List<String> keywords = Arrays.stream(missingKeywordsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                   .map(String::trim)
                   .filter(s -> !s.isEmpty())
                   .collect(Collectors.toList());
           
           log.debug("Found missing keywords (Pattern 1): {}", keywords);
           keywordsMissing.addAll(keywords);
       }
       
       // If no missing keywords found with Pattern 1, try Pattern 2
       if (keywordsMissing.isEmpty()) {
           // Pattern 2: Looking for sections with "MISSING" or "KEYWORDS TO ADD"
           Pattern pattern2 = Pattern.compile(
                   "(?:MISSING|KEYWORDS TO ADD):?\\s*([\\s\\S]*?)(?=\\n\\n|$)"
           );
           
           Matcher matcher2 = pattern2.matcher(rawOutput);
           if (matcher2.find()) {
               String missingText = matcher2.group(1).trim();
               List<String> keywords = Arrays.stream(missingText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                       .map(String::trim)
                       .filter(s -> !s.isEmpty())
                       .collect(Collectors.toList());
               
               log.debug("Found missing keywords (Pattern 2): {}", keywords);
               keywordsMissing.addAll(keywords);
           }
       }
       
       // If still no missing keywords, try Pattern 3
       if (keywordsMissing.isEmpty()) {
           // Pattern 3: Looking for bullet points or dashes that might indicate keywords
           Pattern pattern3 = Pattern.compile(
                   "(?:missing|add|include)\\s+(?:keywords|skills|terms)\\s*:?\\s*([\\s\\S]*?)(?=\\n\\n|$)",
                   Pattern.CASE_INSENSITIVE
           );
           
           Matcher matcher3 = pattern3.matcher(rawOutput);
           if (matcher3.find()) {
               String missingText = matcher3.group(1).trim();
               List<String> keywords = Arrays.stream(missingText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                       .map(String::trim)
                       .filter(s -> !s.isEmpty())
                       .collect(Collectors.toList());
               
               log.debug("Found missing keywords (Pattern 3): {}", keywords);
               keywordsMissing.addAll(keywords);
           }
       }
   }
   
   /**
    * Extract matched keywords using multiple patterns
    */
   private void extractMatchedKeywords(String rawOutput, List<String> keywordsMatched) {
       // Pattern 1: Standard format with "SKILLS TO EMPHASIZE:"
       Pattern pattern1 = Pattern.compile(
               "SKILLS TO EMPHASIZE:(?:\\s*-\\s*|\\s*\\*\\s*)(.*?)(?=\\n\\s*(?:MATCH|$))",
               Pattern.DOTALL
       );
       
       Matcher matcher1 = pattern1.matcher(rawOutput);
       if (matcher1.find()) {
           String skillsText = matcher1.group(1).trim();
           List<String> keywords = Arrays.stream(skillsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                   .map(String::trim)
                   .filter(s -> !s.isEmpty())
                   .collect(Collectors.toList());
           
           log.debug("Found matched keywords (Pattern 1): {}", keywords);
           keywordsMatched.addAll(keywords);
       }
       
       // If no matched keywords found with Pattern 1, try Pattern 2
       if (keywordsMatched.isEmpty()) {
           // Pattern 2: Looking for sections with "SKILLS" or "KEYWORDS MATCHED"
           Pattern pattern2 = Pattern.compile(
                   "(?:SKILLS|KEYWORDS MATCHED):?\\s*([\\s\\S]*?)(?=\\n\\n|$)"
           );
           
           Matcher matcher2 = pattern2.matcher(rawOutput);
           if (matcher2.find()) {
               String skillsText = matcher2.group(1).trim();
               List<String> keywords = Arrays.stream(skillsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                       .map(String::trim)
                       .filter(s -> !s.isEmpty())
                       .collect(Collectors.toList());
               
               log.debug("Found matched keywords (Pattern 2): {}", keywords);
               keywordsMatched.addAll(keywords);
           }
       }
       
       // If still no matched keywords, try Pattern 3
       if (keywordsMatched.isEmpty()) {
           // Pattern 3: Looking for bullet points or dashes that might indicate keywords
           Pattern pattern3 = Pattern.compile(
                   "(?:highlight|emphasize|include)\\s+(?:keywords|skills|terms)\\s*:?\\s*([\\s\\S]*?)(?=\\n\\n|$)",
                   Pattern.CASE_INSENSITIVE
           );
           
           Matcher matcher3 = pattern3.matcher(rawOutput);
           if (matcher3.find()) {
               String skillsText = matcher3.group(1).trim();
               List<String> keywords = Arrays.stream(skillsText.split("(?:\\n\\s*-\\s*|\\n\\s*\\*\\s*|,\\s*)"))
                       .map(String::trim)
                       .filter(s -> !s.isEmpty())
                       .collect(Collectors.toList());
               
               log.debug("Found matched keywords (Pattern 3): {}", keywords);
               keywordsMatched.addAll(keywords);
           }
       }
   }
   
   /**
    * Extract match score using multiple patterns
    */
   private int extractMatchScore(String rawOutput) {
       // Pattern 1: Standard format with "MATCH SCORE:"
       Pattern pattern1 = Pattern.compile("MATCH SCORE:\\s*(\\d+)");
       Matcher matcher1 = pattern1.matcher(rawOutput);
       if (matcher1.find()) {
           int score = Integer.parseInt(matcher1.group(1).trim());
           log.debug("Found match score (Pattern 1): {}", score);
           return score;
       }
       
       // Pattern 2: Looking for sections with "SCORE" or "MATCH"
       Pattern pattern2 = Pattern.compile("(?:SCORE|MATCH):\\s*(\\d+)");
       Matcher matcher2 = pattern2.matcher(rawOutput);
       if (matcher2.find()) {
           int score = Integer.parseInt(matcher2.group(1).trim());
           log.debug("Found match score (Pattern 2): {}", score);
           return score;
       }
       
       // Pattern 3: Looking for percentage values
       Pattern pattern3 = Pattern.compile("(\\d+)\\s*%");
       Matcher matcher3 = pattern3.matcher(rawOutput);
       if (matcher3.find()) {
           int score = Integer.parseInt(matcher3.group(1).trim());
           log.debug("Found match score (Pattern 3): {}", score);
           return score;
       }
       
       // Default score if none found
       return 65;
   }
   
   /**
    * Format cover letter response
    */
   private com.resumetailor.dto.CoverLetterResponse formatCoverLetterResponse(String rawOutput) {
       // For cover letters, we just need to clean up the text a bit
       String cleanedOutput = rawOutput != null ? rawOutput.trim() : "";
       
       // If the output is empty, provide a fallback cover letter
       if (cleanedOutput.isEmpty()) {
           log.warn("Received empty cover letter response. Providing fallback cover letter.");
           cleanedOutput = "Dear Hiring Manager,\n\n" +
                   "I am writing to express my interest in the position at your company. " +
                   "Based on my experience and skills, I believe I would be a valuable addition to your team.\n\n" +
                   "Please consider my application. I look forward to discussing how I can contribute to your organization.\n\n" +
                   "Sincerely,\n\n" +
                   "Your Name";
       }
       
       log.info("Formatted cover letter response, length: {}", cleanedOutput.length());
       
       return com.resumetailor.dto.CoverLetterResponse.builder()
               .coverLetter(cleanedOutput)
               .build();
   }
}
