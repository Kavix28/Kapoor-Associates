package com.kapoorassociates.legalplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    private String companyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\).]{10,20}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Legal matter is required")
    @Size(min = 10, max = 1000)
    private String legalMatter;

    @NotBlank(message = "Consultation type is required")
    @Pattern(regexp = "office|online")
    private String consultationType;

    @Builder.Default
    private String officeLocation = "tis_hazari";

    @NotBlank(message = "Date is required")
    private String preferredDate;

    @NotBlank(message = "Time is required")
    private String preferredTime;

    @NotBlank(message = "Session ID is required")
    private String sessionId;

    @NotBlank(message = "Slot ID is required")
    private String slotId;
}
