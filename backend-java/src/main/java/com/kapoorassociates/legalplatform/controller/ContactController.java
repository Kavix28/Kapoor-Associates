package com.kapoorassociates.legalplatform.controller;

import com.kapoorassociates.legalplatform.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {

    @GetMapping("/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFirmInfo() {
        Map<String, Object> firm = new HashMap<>();
        firm.put("name", "Kapoor & Associates, Advocates & Legal Advisors");
        firm.put("email", "kapoorandassociatesadv@gmail.com");
        firm.put("phonePrimary", "+91 98916 56411");
        firm.put("phoneSecondary", "+91 98103 16427");

        Map<String, Object> officeHours = new HashMap<>();
        officeHours.put("weekdays", "Monday - Friday: 10:00 AM - 6:00 PM");

        Map<String, Object> consultationInfo = new HashMap<>();
        consultationInfo.put("duration", "30 minutes");
        consultationInfo.put("mode", "Office & Online");
        consultationInfo.put("workingDays", "Monday - Friday");
        consultationInfo.put("timeSlots", "11:00 AM - 5:00 PM");

        Map<String, Object> data = new HashMap<>();
        data.put("firm", firm);
        data.put("officeHours", officeHours);
        data.put("consultationInfo", consultationInfo);
        data.put("disclaimer", "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner.");

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(data)
                .build());
    }
}
