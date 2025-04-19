package com.resumetailor.controller;

import com.resumetailor.dto.TailorRequest;
import com.resumetailor.dto.TailorResponse;
import com.resumetailor.service.ResumeTailorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class ResumeTailorController {

    private final ResumeTailorService resumeTailorService;

    /**
     * Endpoint to tailor a resume based on a job description using AI
     *
     * @param request Contains resume content, job description, and API key
     * @return Tailored resume suggestions
     */
    @PostMapping("/tailor")
    public ResponseEntity<TailorResponse> tailorResume(@RequestBody TailorRequest request) {
        log.info("Received request to tailor resume");
        TailorResponse response = resumeTailorService.tailorResume(request);
        return ResponseEntity.ok(response);
    }
}
