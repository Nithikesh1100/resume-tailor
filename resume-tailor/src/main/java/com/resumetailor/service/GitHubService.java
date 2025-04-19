package com.resumetailor.service;

import com.resumetailor.dto.GitHubResponse;
import com.resumetailor.util.GitHubUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubService {

    private final WebClient.Builder webClientBuilder;
    private final GitHubUtils gitHubUtils;
    
    @Value("${github.api.url}")
    private String githubApiUrl;

    /**
     * Fetch GitHub projects for a user
     *
     * @param username GitHub username
     * @param jobDescription Optional job description to filter relevant repositories
     * @return List of GitHub repositories
     */
    public GitHubResponse getProjects(String username, String jobDescription) {
        log.info("Fetching GitHub projects for user: {}", username);
        
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("GitHub username cannot be empty");
        }
        
        try {
            // Fetch repositories from GitHub API
            List<Map<String, Object>> repositories = fetchRepositories(username);
            
            // Convert to GitHubResponse.Repository objects
            List<GitHubResponse.Repository> repoList = repositories.stream()
                    .map(this::mapToRepository)
                    .collect(Collectors.toList());
            
            // If job description is provided, calculate relevance scores and sort
            if (jobDescription != null && !jobDescription.isEmpty()) {
                List<String> keywords = extractKeywords(jobDescription);
                repoList.forEach(repo -> {
                    double score = calculateRelevanceScore(repo, keywords);
                    repo.setRelevanceScore(score);
                });
                
                // Sort by relevance score (descending)
                repoList.sort((r1, r2) -> Double.compare(r2.getRelevanceScore(), r1.getRelevanceScore()));
            } else {
                // Sort by stars (descending) if no job description
                repoList.sort((r1, r2) -> Integer.compare(r2.getStars(), r1.getStars()));
            }
            
            return GitHubResponse.builder()
                    .repositories(repoList)
                    .build();
            
        } catch (Exception e) {
            log.error("Error fetching GitHub projects", e);
            throw new RuntimeException("Failed to fetch GitHub projects: " + e.getMessage(), e);
        }
    }
    
    /**
     * Fetch repositories from GitHub API
     */
    private List<Map<String, Object>> fetchRepositories(String username) {
        // For demonstration purposes, return mock data
        // In a real application, you would call the GitHub API
        
        if ("error".equalsIgnoreCase(username)) {
            throw new RuntimeException("GitHub API error");
        }
        
        if ("empty".equalsIgnoreCase(username)) {
            return new ArrayList<>();
        }
        
        // Mock data for demonstration
        return List.of(
                Map.of(
                        "id", 1L,
                        "name", "spring-boot-api",
                        "description", "RESTful API built with Spring Boot and PostgreSQL",
                        "html_url", "https://github.com/" + username + "/spring-boot-api",
                        "language", "Java",
                        "stargazers_count", 42,
                        "forks_count", 15,
                        "topics", List.of("spring-boot", "rest-api", "java", "postgresql"),
                        "created_at", "2022-01-15T10:30:00Z",
                        "updated_at", "2023-11-20T14:22:00Z"
                ),
                Map.of(
                        "id", 2L,
                        "name", "react-dashboard",
                        "description", "Admin dashboard built with React and Material UI",
                        "html_url", "https://github.com/" + username + "/react-dashboard",
                        "language", "JavaScript",
                        "stargazers_count", 28,
                        "forks_count", 8,
                        "topics", List.of("react", "javascript", "material-ui", "dashboard"),
                        "created_at", "2022-03-10T09:15:00Z",
                        "updated_at", "2023-10-05T11:45:00Z"
                ),
                Map.of(
                        "id", 3L,
                        "name", "python-data-analysis",
                        "description", "Data analysis scripts using Python, Pandas, and Matplotlib",
                        "html_url", "https://github.com/" + username + "/python-data-analysis",
                        "language", "Python",
                        "stargazers_count", 15,
                        "forks_count", 5,
                        "topics", List.of("python", "pandas", "data-analysis", "matplotlib"),
                        "created_at", "2022-05-20T14:50:00Z",
                        "updated_at", "2023-09-12T08:30:00Z"
                )
        );
    }
    
    /**
     * Map GitHub API response to Repository object
     */
    private GitHubResponse.Repository mapToRepository(Map<String, Object> repoData) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        
        // Extract topics
        List<String> topics = new ArrayList<>();
        if (repoData.get("topics") instanceof List) {
            topics = (List<String>) repoData.get("topics");
        }
        
        return GitHubResponse.Repository.builder()
                .id(Long.valueOf(repoData.get("id").toString()))
                .name((String) repoData.get("name"))
                .description((String) repoData.get("description"))
                .htmlUrl((String) repoData.get("html_url"))
                .language((String) repoData.get("language"))
                .stars(Integer.parseInt(repoData.get("stargazers_count").toString()))
                .forks(Integer.parseInt(repoData.get("forks_count").toString()))
                .topics(topics)
                .createdAt(LocalDateTime.parse(((String) repoData.get("created_at")).replace("Z", "")))
                .updatedAt(LocalDateTime.parse(((String) repoData.get("updated_at")).replace("Z", "")))
                .relevanceScore(0.0) // Default score, will be calculated later if job description is provided
                .build();
    }
    
    /**
     * Extract keywords from job description
     */
    private List<String> extractKeywords(String jobDescription) {
        // Simple keyword extraction - split by spaces and filter common words
        return Arrays.stream(jobDescription.toLowerCase().split("\\W+"))
                .filter(word -> word.length() > 3) // Filter short words
                .filter(word -> !isCommonWord(word)) // Filter common words
                .distinct()
                .toList();
    }
    
    /**
     * Check if a word is a common word (stop word)
     */
    private boolean isCommonWord(String word) {
        List<String> commonWords = List.of("the", "and", "that", "have", "for", "not", "with", "you", "this", "but");
        return commonWords.contains(word);
    }
    
    /**
     * Calculate relevance score for a repository based on job description keywords
     */
    private double calculateRelevanceScore(GitHubResponse.Repository repo, List<String> keywords) {
        int matches = 0;
        
        // Check repository name
        for (String keyword : keywords) {
            if (repo.getName().toLowerCase().contains(keyword)) {
                matches++;
            }
        }
        
        // Check repository description
        if (repo.getDescription() != null) {
            for (String keyword : keywords) {
                if (repo.getDescription().toLowerCase().contains(keyword)) {
                    matches++;
                }
            }
        }
        
        // Check repository topics
        for (String topic : repo.getTopics()) {
            for (String keyword : keywords) {
                if (topic.toLowerCase().contains(keyword)) {
                    matches += 2; // Topics are more relevant, so give them more weight
                }
            }
        }
        
        // Calculate score based on matches and repository popularity
        return matches * 10.0 + repo.getStars() * 0.5 + repo.getForks() * 0.3;
    }
}
