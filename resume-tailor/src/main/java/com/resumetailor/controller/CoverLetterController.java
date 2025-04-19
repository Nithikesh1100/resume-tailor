package com.resumetailor.controller;

import com.resumetailor.dto.CoverLetterRequest;
import com.resumetailor.dto.CoverLetterResponse;
import com.resumetailor.service.CoverLetterService;
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
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    /**
     * Endpoint to generate a cover letter based on resume and job description using AI
     *
     * @param request Contains resume content, job description, additional info, and API key
     * @return Generated cover letter
     */
    @PostMapping("/cover-letter")
    public ResponseEntity<CoverLetterResponse> generateCoverLetter(@RequestBody CoverLetterRequest request) {
        log.info("Received request to generate cover letter");
        CoverLetterResponse response = coverLetterService.generateCoverLetter(request);
        return ResponseEntity.ok(response);
    }
}
