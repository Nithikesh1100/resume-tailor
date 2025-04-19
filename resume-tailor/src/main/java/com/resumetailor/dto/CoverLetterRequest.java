package com.resumetailor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterRequest {
    private String resumeContent;
    private String jobDescription;
    private String additionalInfo;
    private String apiKey;
}
