package com.resumetailor.agent;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

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
            // For demonstration purposes, we'll create a simple PDF using PDFBox
            
            // Option 1: Use ProcessBuilder to call pdflatex (commented out)
            // return compilePdfWithLatex(latexContent);
            
            // Option 2: Create a simple PDF using PDFBox (for demonstration)
            return createSimplePdf(latexContent);
            
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
     * Compile LaTeX to PDF using pdflatex (via ProcessBuilder)
     * This is commented out as it requires pdflatex to be installed on the system
     */
    private byte[] compilePdfWithLatex(String latexContent) throws IOException, InterruptedException {
        // Create temporary directory
        Path tempDir = Files.createTempDirectory("latex_" + UUID.randomUUID());
        
        // Create temporary LaTeX file
        Path latexFile = tempDir.resolve("resume.tex");
        Files.writeString(latexFile, latexContent);
        
        // Run pdflatex command
        ProcessBuilder processBuilder = new ProcessBuilder(
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory=" + tempDir,
                latexFile.toString()
        );
        
        Process process = processBuilder.start();
        int exitCode = process.waitFor();
        
        if (exitCode != 0) {
            throw new RuntimeException("LaTeX compilation failed with exit code: " + exitCode);
        }
        
        // Read compiled PDF
        Path pdfFile = tempDir.resolve("resume.pdf");
        byte[] pdfBytes = Files.readAllBytes(pdfFile);
        
        // Clean up temporary files
        Files.deleteIfExists(pdfFile);
        Files.deleteIfExists(latexFile);
        Files.deleteIfExists(tempDir);
        
        return pdfBytes;
    }
    
    /**
     * Create a simple PDF using PDFBox (for demonstration purposes)
     */
    private byte[] createSimplePdf(String latexContent) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText("Resume Preview (LaTeX Compilation Simulation)");
                
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(0, -30);
                
                // Split LaTeX content into lines and show first 30 lines
                List<String> lines = Arrays.asList(latexContent.split("\n"));
                int lineCount = Math.min(lines.size(), 30);
                
                for (int i = 0; i < lineCount; i++) {
                    String line = lines.get(i);
                    // Truncate long lines
                    if (line.length() > 80) {
                        line = line.substring(0, 77) + "...";
                    }
                    contentStream.showText(line);
                    contentStream.newLineAtOffset(0, -12);
                }
                
                if (lines.size() > 30) {
                    contentStream.showText("... (content truncated for preview)");
                }
                
                contentStream.endText();
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
