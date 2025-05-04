package com.resumetailor.controller;

import com.resumetailor.dto.GitHubResponse;
import com.resumetailor.service.GitHubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
@Slf4j
public class GitHubController {

    private final GitHubService gitHubService;

    /**
     * Endpoint to fetch GitHub projects for a user
     *
     * @param username GitHub username
     * @param jobDescription Optional job description to filter relevant repositories
     * @param githubToken Optional GitHub token for authentication
     * @return List of GitHub repositories
     */
    @GetMapping("/projects")
    public ResponseEntity<GitHubResponse> getProjects(
            @RequestParam String username,
            @RequestParam(required = false) String jobDescription,
            @RequestHeader(value = "X-GitHub-Token", required = false) String githubToken) {
        log.info("Received request to fetch GitHub projects for user: {}", username);
        log.info("GitHub token provided: {}", githubToken != null && !githubToken.isEmpty() ? "Yes" : "No");
        
        GitHubResponse response = gitHubService.getProjects(username, jobDescription, githubToken);
        return ResponseEntity.ok(response);
    }
}
