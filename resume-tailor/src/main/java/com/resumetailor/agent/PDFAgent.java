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
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Agent responsible for compiling LaTeX into downloadable PDF format.
 * This agent takes LaTeX content and returns a PDF as a byte array.
 */
@Component
@Slf4j
public class PDFAgent implements Agent<String, byte[]> {

    private static final float MARGIN = 50;
    private static final float LINE_HEIGHT = 14;
    private static final float SECTION_SPACING = 20;
    private static final float ITEM_INDENT = 20;

    @Override
    public byte[] process(String latexContent) {
        log.info("{}: Compiling LaTeX content to PDF", getName());
        
        if (latexContent == null || latexContent.isEmpty()) {
            throw new IllegalArgumentException("LaTeX content cannot be empty");
        }
        
        try {
            return createProfessionalPdf(latexContent);
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
     * Create a professional PDF with proper LaTeX parsing and formatting
     */
    private byte[] createProfessionalPdf(String latexContent) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            
            float yPosition = page.getMediaBox().getHeight() - MARGIN;
            float pageWidth = page.getMediaBox().getWidth() - 2 * MARGIN;
            
            // Fonts
            PDFont titleFont = PDType1Font.HELVETICA_BOLD;
            PDFont sectionFont = PDType1Font.HELVETICA_BOLD;
            PDFont regularFont = PDType1Font.HELVETICA;
            PDFont italicFont = PDType1Font.HELVETICA_OBLIQUE;
            PDFont boldFont = PDType1Font.HELVETICA_BOLD;
        
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
        
            try {
                // Parse and render header (name and contact info)
                yPosition = renderHeader(contentStream, latexContent, yPosition, pageWidth, titleFont, regularFont);
                
                // Parse and render sections
                List<Section> sections = parseLatexSections(latexContent);
                
                for (Section section : sections) {
                    // Check if we need a new page
                    if (yPosition < MARGIN + 100) {
                        contentStream.close();
                        page = new PDPage(PDRectangle.A4);
                        document.addPage(page);
                        yPosition = page.getMediaBox().getHeight() - MARGIN;
                        contentStream = new PDPageContentStream(document, page);
                    }
                    
                    yPosition = renderSection(contentStream, section, yPosition, pageWidth, 
                                            sectionFont, regularFont, boldFont, italicFont);
                }
            } finally {
                contentStream.close();
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
    
    /**
     * Render the header section (name and contact info)
     */
    private float renderHeader(PDPageContentStream contentStream, String latexContent, 
                              float yPosition, float pageWidth, PDFont titleFont, PDFont regularFont) throws IOException {
        
        // Extract name
        String name = extractName(latexContent);
        
        // Render name
        contentStream.beginText();
        contentStream.setFont(titleFont, 20);
        float nameWidth = titleFont.getStringWidth(name) / 1000 * 20;
        contentStream.newLineAtOffset(MARGIN + (pageWidth - nameWidth) / 2, yPosition);
        contentStream.showText(name);
        contentStream.endText();
        yPosition -= 25;
        
        // Extract and render contact info
        List<String> contactLines = extractContactInfo(latexContent);
        for (String line : contactLines) {
            contentStream.beginText();
            contentStream.setFont(regularFont, 10);
            float lineWidth = regularFont.getStringWidth(line) / 1000 * 10;
            contentStream.newLineAtOffset(MARGIN + (pageWidth - lineWidth) / 2, yPosition);
            contentStream.showText(line);
            contentStream.endText();
            yPosition -= 12;
        }
        
        return yPosition - SECTION_SPACING;
    }
    
    /**
     * Render a section with proper formatting
     */
    private float renderSection(PDPageContentStream contentStream, Section section, 
                               float yPosition, float pageWidth, PDFont sectionFont, 
                               PDFont regularFont, PDFont boldFont, PDFont italicFont) throws IOException {
        
        // Section title
        contentStream.beginText();
        contentStream.setFont(sectionFont, 14);
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(section.title.toUpperCase());
        contentStream.endText();
        
        // Draw line under section title
        contentStream.setStrokingColor(0, 0, 0);
        contentStream.setLineWidth(1);
        contentStream.moveTo(MARGIN, yPosition - 3);
        contentStream.lineTo(MARGIN + pageWidth, yPosition - 3);
        contentStream.stroke();
        
        yPosition -= 18;
        
        // Render section content
        List<ContentBlock> blocks = parseContentBlocks(section.content);
        
        for (ContentBlock block : blocks) {
            yPosition = renderContentBlock(contentStream, block, yPosition, pageWidth, 
                                         regularFont, boldFont, italicFont);
        }
        
        return yPosition - SECTION_SPACING;
    }
    
    /**
     * Render a content block (paragraph, list, etc.)
     */
    private float renderContentBlock(PDPageContentStream contentStream, ContentBlock block, 
                                   float yPosition, float pageWidth, PDFont regularFont, 
                                   PDFont boldFont, PDFont italicFont) throws IOException {
        
        switch (block.type) {
            case PARAGRAPH:
                return renderParagraph(contentStream, block.content, yPosition, pageWidth, regularFont, boldFont, italicFont);
            case LIST:
                return renderList(contentStream, block.items, yPosition, pageWidth, regularFont, boldFont, italicFont);
            case JOB_ENTRY:
                return renderJobEntry(contentStream, block, yPosition, pageWidth, regularFont, boldFont, italicFont);
            default:
                return yPosition;
        }
    }
    
    /**
     * Render a paragraph with formatting
     */
    private float renderParagraph(PDPageContentStream contentStream, String content, 
                                 float yPosition, float pageWidth, PDFont regularFont, 
                                 PDFont boldFont, PDFont italicFont) throws IOException {
        
        List<String> lines = wrapText(content, pageWidth - MARGIN, regularFont, 11);
        
        for (String line : lines) {
            contentStream.beginText();
            contentStream.setFont(regularFont, 11);
            contentStream.newLineAtOffset(MARGIN, yPosition);
            contentStream.showText(line);
            contentStream.endText();
            yPosition -= LINE_HEIGHT;
        }
        
        return yPosition - 5;
    }
    
    /**
     * Render a bulleted list
     */
    private float renderList(PDPageContentStream contentStream, List<String> items, 
                           float yPosition, float pageWidth, PDFont regularFont, 
                           PDFont boldFont, PDFont italicFont) throws IOException {
        
        for (String item : items) {
            // Render bullet
            contentStream.beginText();
            contentStream.setFont(regularFont, 11);
            contentStream.newLineAtOffset(MARGIN + ITEM_INDENT, yPosition);
            contentStream.showText("•");
            contentStream.endText();
            
            // Render item text with formatting
            List<String> lines = wrapText(item, pageWidth - MARGIN - ITEM_INDENT - 10, regularFont, 11);
            
            for (int i = 0; i < lines.size(); i++) {
                String line = lines.get(i);
                contentStream.beginText();
                contentStream.setFont(regularFont, 11);
                contentStream.newLineAtOffset(MARGIN + ITEM_INDENT + 10, yPosition);
                contentStream.showText(line);
                contentStream.endText();
                
                if (i < lines.size() - 1) {
                    yPosition -= LINE_HEIGHT;
                }
            }
            
            yPosition -= LINE_HEIGHT;
        }
        
        return yPosition - 5;
    }
    
    /**
     * Render a job entry with title, company, and dates
     */
    private float renderJobEntry(PDPageContentStream contentStream, ContentBlock block, 
                               float yPosition, float pageWidth, PDFont regularFont, 
                               PDFont boldFont, PDFont italicFont) throws IOException {
        
        // Job title (bold) and dates (right-aligned)
        contentStream.beginText();
        contentStream.setFont(boldFont, 12);
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(block.jobTitle);
        contentStream.endText();
        
        if (block.dates != null && !block.dates.isEmpty()) {
            float dateWidth = regularFont.getStringWidth(block.dates) / 1000 * 11;
            contentStream.beginText();
            contentStream.setFont(regularFont, 11);
            contentStream.newLineAtOffset(MARGIN + pageWidth - dateWidth, yPosition);
            contentStream.showText(block.dates);
            contentStream.endText();
        }
        
        yPosition -= LINE_HEIGHT;
        
        // Company (italic)
        if (block.company != null && !block.company.isEmpty()) {
            contentStream.beginText();
            contentStream.setFont(italicFont, 11);
            contentStream.newLineAtOffset(MARGIN, yPosition);
            contentStream.showText(block.company);
            contentStream.endText();
            yPosition -= LINE_HEIGHT;
        }
        
        // Job description (bulleted list)
        if (block.items != null && !block.items.isEmpty()) {
            yPosition = renderList(contentStream, block.items, yPosition - 5, pageWidth, regularFont, boldFont, italicFont);
        }
        
        return yPosition - 5;
    }
    
    /**
     * Wrap text to fit within specified width
     */
    private List<String> wrapText(String text, float width, PDFont font, int fontSize) throws IOException {
        List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();
        
        for (String word : words) {
            String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
            float testWidth = font.getStringWidth(testLine) / 1000 * fontSize;
            
            if (testWidth > width && currentLine.length() > 0) {
                lines.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            } else {
                currentLine = new StringBuilder(testLine);
            }
        }
        
        if (currentLine.length() > 0) {
            lines.add(currentLine.toString());
        }
        
        return lines;
    }
    
    /**
     * Extract name from LaTeX content
     */
    private String extractName(String latexContent) {
        Pattern pattern = Pattern.compile("\\{\\\\LARGE\\s*\\\\textbf\\{(.*?)\\}\\}");
        Matcher matcher = pattern.matcher(latexContent);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        // Alternative pattern
        pattern = Pattern.compile("\\\\LARGE\\s*\\\\textbf\\{(.*?)\\}");
        matcher = pattern.matcher(latexContent);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        return "Resume";
    }
    
    /**
     * Extract contact information from LaTeX content
     */
    private List<String> extractContactInfo(String latexContent) {
        List<String> contactLines = new ArrayList<>();
        
        Pattern pattern = Pattern.compile("\\\\begin\\{center\\}(.*?)\\\\end\\{center\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(latexContent);
        
        if (matcher.find()) {
            String centerContent = matcher.group(1);
            
            // Split by \\ and clean up
            String[] lines = centerContent.split("\\\\\\\\");
            
            for (String line : lines) {
                String cleanLine = line
                    .replaceAll("\\{\\\\LARGE\\s*\\\\textbf\\{.*?\\}\\}", "") // Remove name
                    .replaceAll("\\\\LARGE\\s*\\\\textbf\\{.*?\\}", "") // Remove name alternative
                    .replaceAll("\\\\href\\{(.*?)\\}\\{(.*?)\\}", "$2") // Convert links to text
                    .replaceAll("\\|", " • ") // Replace pipes with bullets
                    .trim();
                
                if (!cleanLine.isEmpty() && !cleanLine.matches("\\s*")) {
                    contactLines.add(cleanLine);
                }
            }
        }
        
        return contactLines;
    }
    
    /**
     * Parse LaTeX content into sections
     */
    private List<Section> parseLatexSections(String latexContent) {
        List<Section> sections = new ArrayList<>();
        
        Pattern pattern = Pattern.compile("\\\\section\\{(.*?)\\}(.*?)(?=\\\\section\\{|\\\\end\\{document\\})", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(latexContent);
        
        while (matcher.find()) {
            String title = matcher.group(1);
            String content = matcher.group(2).trim();
            sections.add(new Section(title, content));
        }
        
        return sections;
    }
    
    /**
     * Parse content into blocks (paragraphs, lists, job entries)
     */
    private List<ContentBlock> parseContentBlocks(String content) {
        List<ContentBlock> blocks = new ArrayList<>();
        
        // Check for itemize environment (lists)
        Pattern listPattern = Pattern.compile("\\\\begin\\{itemize\\}(.*?)\\\\end\\{itemize\\}", Pattern.DOTALL);
        Matcher listMatcher = listPattern.matcher(content);
        
        if (listMatcher.find()) {
            String listContent = listMatcher.group(1);
            List<String> items = new ArrayList<>();
            
            Pattern itemPattern = Pattern.compile("\\\\item\\s+(.*?)(?=\\\\item|$)", Pattern.DOTALL);
            Matcher itemMatcher = itemPattern.matcher(listContent);
            
            while (itemMatcher.find()) {
                String item = itemMatcher.group(1).trim()
                    .replaceAll("\\\\textbf\\{(.*?)\\}", "$1")
                    .replaceAll("\\\\textit\\{(.*?)\\}", "$1")
                    .replaceAll("\\\\%", "%");
                items.add(item);
            }
            
            blocks.add(new ContentBlock(ContentType.LIST, "", items));
        } else {
            // Check for job entries (textbf followed by hfill and dates)
            Pattern jobPattern = Pattern.compile("\\\\textbf\\{(.*?)\\}\\s*\\\\hfill\\s*(.*?)\\\\\\\\\\s*\\\\textit\\{(.*?)\\}", Pattern.DOTALL);
            Matcher jobMatcher = jobPattern.matcher(content);
            
            if (jobMatcher.find()) {
                String jobTitle = jobMatcher.group(1);
                String dates = jobMatcher.group(2);
                String company = jobMatcher.group(3);
                
                // Look for associated itemize list
                List<String> items = new ArrayList<>();
                Pattern jobListPattern = Pattern.compile("\\\\textit\\{" + Pattern.quote(company) + "\\}(.*?)\\\\begin\\{itemize\\}(.*?)\\\\end\\{itemize\\}", Pattern.DOTALL);
                Matcher jobListMatcher = jobListPattern.matcher(content);
                
                if (jobListMatcher.find()) {
                    String listContent = jobListMatcher.group(2);
                    Pattern itemPattern = Pattern.compile("\\\\item\\s+(.*?)(?=\\\\item|$)", Pattern.DOTALL);
                    Matcher itemMatcher = itemPattern.matcher(listContent);
                    
                    while (itemMatcher.find()) {
                        String item = itemMatcher.group(1).trim()
                            .replaceAll("\\\\textbf\\{(.*?)\\}", "$1")
                            .replaceAll("\\\\textit\\{(.*?)\\}", "$1")
                            .replaceAll("\\\\%", "%");
                        items.add(item);
                    }
                }
                
                ContentBlock jobBlock = new ContentBlock(ContentType.JOB_ENTRY, "");
                jobBlock.jobTitle = jobTitle;
                jobBlock.company = company;
                jobBlock.dates = dates;
                jobBlock.items = items;
                blocks.add(jobBlock);
            } else {
                // Regular paragraph
                String cleanContent = content
                    .replaceAll("\\\\textbf\\{(.*?)\\}", "$1")
                    .replaceAll("\\\\textit\\{(.*?)\\}", "$1")
                    .replaceAll("\\\\%", "%")
                    .replaceAll("\\\\begin\\{itemize\\}.*?\\\\end\\{itemize\\}", "")
                    .trim();
                
                if (!cleanContent.isEmpty()) {
                    blocks.add(new ContentBlock(ContentType.PARAGRAPH, cleanContent));
                }
            }
        }
        
        return blocks;
    }
    
    // Helper classes
    private static class Section {
        String title;
        String content;
        
        Section(String title, String content) {
            this.title = title;
            this.content = content;
        }
    }
    
    private enum ContentType {
        PARAGRAPH, LIST, JOB_ENTRY
    }
    
    private static class ContentBlock {
        ContentType type;
        String content;
        List<String> items;
        String jobTitle;
        String company;
        String dates;
        
        ContentBlock(ContentType type, String content) {
            this.type = type;
            this.content = content;
            this.items = new ArrayList<>();
        }
        
        ContentBlock(ContentType type, String content, List<String> items) {
            this.type = type;
            this.content = content;
            this.items = items;
        }
    }
}
