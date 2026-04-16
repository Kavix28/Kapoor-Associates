package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.CaseDocument;
import com.kapoorassociates.legalplatform.model.CaseRecord;
import com.kapoorassociates.legalplatform.repository.CaseDocumentRepository;
import com.kapoorassociates.legalplatform.repository.CaseRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Controller for managing case documents and file uploads.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminDocumentController {

    private final CaseRecordRepository caseRecordRepository;
    private final CaseDocumentRepository caseDocumentRepository;

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    @PostMapping("/clients/{clientId}/cases/{caseId}/documents")
    public ResponseEntity<CaseDocument> uploadDocument(
            @PathVariable UUID clientId,
            @PathVariable UUID caseId,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty() || !"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().build();
        }

        CaseRecord caseRecord = caseRecordRepository.findById(caseId).orElseThrow();

        Path clientPath = Paths.get(uploadDir, clientId.toString(), caseId.toString());
        if (!Files.exists(clientPath)) {
            Files.createDirectories(clientPath);
        }

        String fileName = file.getOriginalFilename();
        Path filePath = clientPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        CaseDocument document = CaseDocument.builder()
                .caseRecord(caseRecord)
                .fileName(fileName)
                .fileUrl("/uploads/" + clientId + "/" + caseId + "/" + fileName)
                .documentType("PDF")
                .uploadedAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(caseDocumentRepository.save(document));
    }

    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID documentId) throws IOException {
        CaseDocument document = caseDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete physical file
        String relativePath = document.getFileUrl().replace("/uploads/", "");
        Path filePath = Paths.get(uploadDir, relativePath);
        Files.deleteIfExists(filePath);

        // Delete record
        caseDocumentRepository.delete(document);

        return ResponseEntity.noContent().build();
    }
}
