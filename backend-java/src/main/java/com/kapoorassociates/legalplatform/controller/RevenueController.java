/**
 * Kapoor & Associates Legal Platform
 * Controller for Revenue management
 */
package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.model.Revenue;
import com.kapoorassociates.legalplatform.repository.RevenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RevenueController {

    private final RevenueRepository revenueRepository;

    @GetMapping
    public ResponseEntity<List<Revenue>> getAll(@RequestParam(required = false) UUID clientId) {
        if (clientId != null) {
            return ResponseEntity.ok(revenueRepository.findByClientIdOrderByReceivedAtDesc(clientId));
        }
        return ResponseEntity.ok(revenueRepository.findAllByOrderByReceivedAtDesc());
    }

    @PostMapping
    public ResponseEntity<Revenue> create(@RequestBody Revenue revenue) {
        return ResponseEntity.ok(revenueRepository.save(revenue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        revenueRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
