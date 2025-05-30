package com.resumetailor.agent;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
// import java.io.File;
import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.util.Arrays;
import java.util.List;
// import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Agent responsible for compiling LaTeX into downloadable PDF format.
 * This agent takes LaTeX content and returns a PDF as a byte array.
 */
@Component
@Slf4j
public class PDFAgent implements Agent<String, byte[]> {

    @Override
    public byte[] process(String latexContent) {
        log.info("{}: Compiling LaTeX content to PDF", getName());
        
        if (latexContent == null || latexContent.isEmpty()) {
            throw new IllegalArgumentException("LaTeX content cannot be empty");
        }
        
        try {
            // In a real application, you would use a LaTeX compiler like pdflatex
            // For demonstration purposes, we'll create an improved PDF using PDFBox
            return createImprovedPdf(latexContent);
            
        } catch (Exception e) {
            log.error("{}: Error compiling LaTeX to PDF: {}", getName(), e.getMessage());
            throw new RuntimeException("Failed to compile LaTeX to PDF: " + e.getMessage(), e);
        }
    }

    @Override
    public String getName() {
        return "PDFAgent";
    }
    
    /**
     * Create an improved PDF using PDFBox with better LaTeX parsing
     */
    private byte[] createImprovedPdf(String latexContent) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            
            // Extract sections from LaTeX
            List<Section> sections = parseLatexSections(latexContent);
            
            // Create content stream
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float margin = 50;
                float yPosition = page.getMediaBox().getHeight() - margin;
                float width = page.getMediaBox().getWidth() - 2 * margin;
                
                // Set fonts
                PDFont titleFont = PDType1Font.HELVETICA_BOLD;
                PDFont regularFont = PDType1Font.HELVETICA;
                PDFont italicFont = PDType1Font.HELVETICA_OBLIQUE;
                PDFont boldFont = PDType1Font.HELVETICA_BOLD;
                
                // Extract name from LaTeX (assuming it's in \LARGE \textbf{...})
                String name = extractName(latexContent);
                
                // Start content
                contentStream.beginText();
                contentStream.setFont(titleFont, 18);
                contentStream.newLineAtOffset(margin, yPosition);
                
                // Add name
                contentStream.showText(name);
                yPosition -= 20;
                contentStream.endText();
                
                // Add contact info
                String contactInfo = extractContactInfo(latexContent);
                contentStream.beginText();
                contentStream.setFont(regularFont, 10);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText(contactInfo);
                yPosition -= 30;
                contentStream.endText();
                
                // Add sections
                for (Section section : sections) {
                    // Section title
                    contentStream.beginText();
                    contentStream.setFont(boldFont, 12);
                    contentStream.newLineAtOffset(margin, yPosition);
                    contentStream.showText(section.title);
                    contentStream.endText();
                    
                    // Add line under section title
                    contentStream.setStrokingColor(0, 0, 0);
                    contentStream.moveTo(margin, yPosition - 5);
                    contentStream.lineTo(page.getMediaBox().getWidth() - margin, yPosition - 5);
                    contentStream.stroke();
                    
                    yPosition -= 20;
                    
                    // Section content
                    String[] contentLines = section.content.split("\n");
                    for (String line : contentLines) {
                        // Check if we need a new page
                        if (yPosition < margin + 50) {
                            contentStream.close();
                            page = new PDPage(PDRectangle.A4);
                            document.addPage(page);
                            contentStream = new PDPageContentStream(document, page);
                            yPosition = page.getMediaBox().getHeight() - margin;
                        }
                        
                        if (!line.trim().isEmpty()) {
                            contentStream.beginText();
                            contentStream.setFont(regularFont, 10);
                            contentStream.newLineAtOffset(margin, yPosition);
                            
                            // Handle bold text
                            if (line.contains("\\textbf{")) {
                                String[] parts = line.split("\\\\textbf\\{|\\}");
                                float xOffset = 0;
                                for (int i = 0; i < parts.length; i++) {
                                    if (i % 2 == 0) {
                                        // Regular text
                                        contentStream.setFont(regularFont, 10);
                                        contentStream.showText(parts[i]);
                                        xOffset += regularFont.getStringWidth(parts[i]) / 1000 * 10;
                                    } else {
                                        // Bold text
                                        contentStream.setFont(boldFont, 10);
                                        contentStream.showText(parts[i]);
                                        xOffset += boldFont.getStringWidth(parts[i]) / 1000 * 10;
                                    }
                                }
                            } else {
                                contentStream.showText(line);
                            }
                            
                            contentStream.endText();
                            yPosition -= 12;
                        }
                    }
                    
                    yPosition -= 10; // Extra space between sections
                }
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
    
    /**
     * Extract name from LaTeX content
     */
    private String extractName(String latexContent) {
        Pattern pattern = Pattern.compile("\\\\LARGE\\s*\\\\textbf\\{(.*?)\\}");
        Matcher matcher = pattern.matcher(latexContent);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Resume";
    }
    
    /**
     * Extract contact info from LaTeX content
     */
    private String extractContactInfo(String latexContent) {
        Pattern pattern = Pattern.compile("\\\\begin\\{center\\}.*?\\\\LARGE.*?\\\\\\\\(.*?)\\\\end\\{center\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(latexContent);
        if (matcher.find()) {
            String contactInfo = matcher.group(1)
                    .replaceAll("\\\\\\\\", ", ")
                    .replaceAll("\\\\href\\{.*?\\}\\{(.*?)\\}", "$1")
                    .replaceAll("\\|", "•");
            return contactInfo;
        }
        return "";
    }
    
    /**
     * Parse LaTeX content into sections
     */
    private List<Section> parseLatexSections(String latexContent) {
        // Split by section
        String[] sectionBlocks = latexContent.split("\\\\section\\{");
        
        // Skip the first block (before first section)
        List<Section> sections = new java.util.ArrayList<>();
        
        for (int i = 1; i < sectionBlocks.length; i++) {
            String block = sectionBlocks[i];
            int titleEnd = block.indexOf('}');
            if (titleEnd > 0) {
                String title = block.substring(0, titleEnd);
                String content = block.substring(titleEnd + 1).trim();
                
                // Clean up content
                content = content
                        .replaceAll("\\\\begin\\{itemize\\}.*?\\\\end\\{itemize\\}", "")
                        .replaceAll("\\\\item", "• ")
                        .replaceAll("\\\\textit\\{(.*?)\\}", "$1")
                        .replaceAll("\\\\hfill", " - ")
                        .replaceAll("\\\\\\\\", "\n");
                
                sections.add(new Section(title, content));
            }
        }
        
        return sections;
    }
    
    /**
     * Section class to hold title and content
     */
    private static class Section {
        String title;
        String content;
        
        Section(String title, String content) {
            this.title = title;
            this.content = content;
        }
    }
}
