# Project Migration Summary: Kapoor & Associates Legal Platform

This document provides a comprehensive overview of the architectural migration performed on the **Kapoor & Associates** platform. It is designed to help another AI model or developer understand the project structure, tech stack, and key implementation details.

---

## 🏗️ Architecture Overview
Originally, the platform used a **Node.js (Express)** backend with **Supabase (PostgreSQL)** for data storage and authentication.

Due to connectivity issues and the need for a self-contained local environment, the backend has been migrated to **Java Spring Boot**, and the database has been switched to a local **SQLite** file.

### Backend Specs:
- **Framework:** Spring Boot 3.2.1 (Java 17)
- **Database:** SQLite (`/backend/database/kapoor_associates.db`)
- **Persistence:** Spring Data JPA (Hibernate)
- **Security:** Spring Security (Stateless, CORS enabled for local dev)
- **Port:** Configured to **8081** (Localhost)

### Frontend Specs:
- **Framework:** React 18+ (Vite/CRA)
- **API Client:** Axios (configured in `frontend/src/services/api.js`)
- **Styling:** Vanilla CSS + TailwindCSS (for utility)
- **Port:** **3000** (Localhost)

---

## 📂 Project Structure

### 1. `backend-java/` (New Spring Boot Backend)
- **`model/`**: JPA Entities (`Advocate`, `ConsultationBooking`, `AvailableSlot`, `AdminUser`, `ContactQuery`, `ChatbotSession`, `ChatbotConversation`).
- **`repository/`**: Spring Data JPA interfaces for database operations.
- **`service/`**: Business logic, specifically the rule-based **ChatbotService**.
- **`controller/`**: REST Endpoints for Consultations, Contact, and Chatbot.
- **`dto/`**: Data Transfer Objects for API requests/responses (e.g., `ApiResponse`, `BookingRequest`).
- **`config/`**:
  - `SecurityConfig`: Handles CORS and public API permissions.
  - `DataInitializer`: Seeds initial `available_slots` into the SQLite database.
- **`resources/application.yml`**: Database URI and server port configuration.

### 2. `frontend/` (Modern React Frontend)
- **`src/services/api.js`**: Point of integration. Axios base URL points to `http://localhost:8081/api`.
- **`src/pages/Contact.js`**: Main page for consultation booking and viewing available dates.
- **`src/components/Chatbot/`**: Interactive legal chatbot interface.

---

## 🤖 Key Feature Implementations

### 1. Legal Information Chatbot (with Limit)
- **Logic:** Rule-based intent detection in `ChatbotService.java`.
- **Compliance:** As per Bar Council of India rules, the chatbot is limited to **2 general legal information responses** (advice count) per session.
- **Locking:** Once the limit is reached, the session is locked, and the user is prompted to schedule a consultation.

### 2. Consultation Booking
- **Slots:** Fetching available slots from the `available_slots` table.
- **Validation:** Server-side validation using Jakarta Validation (`@NotBlank`, `@Pattern`, `@Size`).
- **Flow:** User selects a date → selects a time → submits booking → database record created → slot marked as unavailable.

### 3. SQLite Database Integration
- **File:** `database/kapoor_associates.db`.
- **Driver:** `sqlite-jdbc`.
- **Dialect:** Hibernate Community SQLite Dialect.
- **Persistence:** Tables are automatically managed via JPA, ensuring consistent data across restarts.

---

## 🚀 How to Run

### Backend (Spring Boot):
1. Navigate to `backend-java/`.
2. Run `mvn spring-boot:run` (Ensure Port 8081 is free).
3. Initialization: On first run, `DataInitializer` seeds 30 days of slots.

### Frontend (React):
1. Navigate to `frontend/`.
2. Run `npm start`.
3. Connectivity: Ensure Port 3000 is used for the frontend browser access.

---

## 📝 Important Notes for Handover
- **CORS:** The backend is configured to accept requests from `localhost:3000` and `localhost:3001`.
- **Environment:** The project is running in a **Windows** environment using **PowerShell**.
- **Security:** In the initial migration phase, Spring Security is set to `permitAll()` for most API routes to facilitate testing of the new architecture.
