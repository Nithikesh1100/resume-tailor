package com.resumetailor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TailorRequest {
    private String resumeContent;
    private String jobDescription;
    private String apiKey;
}
