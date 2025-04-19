package com.resumetailor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubResponse {
    private List<Repository> repositories;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Repository {
        private Long id;
        private String name;
        private String description;
        private String htmlUrl;
        private String language;
        private int stars;
        private int forks;
        private List<String> topics;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private double relevanceScore;
    }
}
