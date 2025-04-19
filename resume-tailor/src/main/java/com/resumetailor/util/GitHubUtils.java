package com.resumetailor.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class GitHubUtils {

    private final WebClient.Builder webClientBuilder;

    /**
     * Check if a repository is relevant to a job description
     *
     * @param repoName Repository name
     * @param repoDescription Repository description
     * @param jobDescription Job description
     * @return Relevance score (0-100)
     */
    public int calculateRelevance(String repoName, String repoDescription, String jobDescription) {
        if (jobDescription == null || jobDescription.isEmpty()) {
            return 50; // Default relevance if no job description
        }
        
        int score = 0;
        
        // Convert to lowercase for case-insensitive comparison
        String lowerRepoName = repoName.toLowerCase();
        String lowerRepoDesc = repoDescription != null ? repoDescription.toLowerCase() : "";
        String lowerJobDesc = jobDescription.toLowerCase();
        
        // Extract keywords from job description (simplified)
        String[] keywords = lowerJobDesc.split("\\W+");
        
        // Check for keyword matches in repository name and description
        for (String keyword : keywords) {
            if (keyword.length() <= 3) continue; // Skip short words
            
            if (lowerRepoName.contains(keyword)) {
                score += 10; // Higher weight for name matches
            }
            
            if (lowerRepoDesc.contains(keyword)) {
                score += 5; // Lower weight for description matches
            }
        }
        
        // Cap score at 100
        return Math.min(score, 100);
    }
}
