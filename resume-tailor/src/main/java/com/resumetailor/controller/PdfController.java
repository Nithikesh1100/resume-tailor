package com.resumetailor.controller;

import com.resumetailor.dto.PdfRequest;
import com.resumetailor.service.PdfCompilerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class PdfController {

    private final PdfCompilerService pdfCompilerService;

    /**
     * Endpoint to compile LaTeX content to PDF
     *
     * @param request Contains LaTeX content
     * @return Compiled PDF as byte array
     */
    @PostMapping("/compile")
    public ResponseEntity<byte[]> compilePdf(@RequestBody PdfRequest request) {
        log.info("Received request to compile LaTeX to PDF");
        byte[] pdfBytes = pdfCompilerService.compilePdf(request.getLatexContent());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "resume.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
