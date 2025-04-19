package com.resumetailor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TailorResponse {
    private String tailoredResume;
    private List<Suggestion> suggestions;
    private List<String> keywordsMatched;
    private List<String> keywordsMissing;
    private int matchScore;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Suggestion {
        private String originalText;
        private String suggestedText;
        private String reason;
    }
}
