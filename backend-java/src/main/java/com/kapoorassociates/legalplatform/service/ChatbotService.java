package com.kapoorassociates.legalplatform.service;

import com.kapoorassociates.legalplatform.model.ChatbotConversation;
import com.kapoorassociates.legalplatform.model.ChatbotSession;
import com.kapoorassociates.legalplatform.repository.ChatbotConversationRepository;
import com.kapoorassociates.legalplatform.repository.ChatbotSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotSessionRepository sessionRepository;
    private final ChatbotConversationRepository conversationRepository;

    private static final String BAR_COUNCIL_DISCLAIMER = "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner.";

    private static final List<String> ESCALATION_TRIGGERS = Arrays.asList(
        "my case", "my company", "our business", "what should i do", "recommend", "suggest action", 
        "my situation", "advice for me", "help me decide", "my contract", "my dispute", "our problem"
    );

    public Map<String, Object> processMessage(String message, UUID sessionId, String ipAddress, String language) {
        ChatbotSession session = sessionRepository.findBySessionId(sessionId)
                .orElseGet(() -> ChatbotSession.builder()
                        .sessionId(sessionId)
                        .messageCount(0)
                        .adviceCount(0)
                        .isLocked(false)
                        .ipAddress(ipAddress)
                        .build());

        if (Boolean.TRUE.equals(session.getIsLocked())) {
            return generateLockedResponse(language, sessionId);
        }

        String intent = detectIntent(message);
        boolean needsEscalation = requiresEscalation(message);
        boolean isAdviceRequest = !Arrays.asList("greeting", "consultation", "case_status").contains(intent);

        session.setMessageCount(session.getMessageCount() + 1);
        if (isAdviceRequest) {
            session.setAdviceCount(session.getAdviceCount() + 1);
        }
        
        if (session.getAdviceCount() >= 3) { // Increased to 3 for better UX
            session.setIsLocked(true);
        }
        
        sessionRepository.save(session);

        Map<String, Object> response = generateResponse(intent, session.getMessageCount(), session.getIsLocked(), needsEscalation, language);
        response.put("sessionId", sessionId);
        response.put("intent", intent);
        response.put("suggestedActions", getSuggestedActions(intent, language));

        // Save conversation
        conversationRepository.save(ChatbotConversation.builder()
                .sessionId(sessionId)
                .userMessage(message)
                .botResponse(response.get("message").toString())
                .intent(intent)
                .confidence(0.9)
                .escalated(needsEscalation)
                .ipAddress(ipAddress)
                .build());

        return response;
    }

    private Map<String, Object> generateLockedResponse(String lang, UUID sessionId) {
        boolean isHi = "hi".equalsIgnoreCase(lang);
        String msg = isHi ? 
            "नमस्ते! आप सामान्य कानूनी जानकारी की सीमा तक पहुँच गए हैं। विशिष्ट सलाह के लिए, कृपया हमारे अधिवक्ताओं के साथ परामर्श निर्धारित करें।" :
            "You've reached the limit for general legal information. To get specific advice for your situation, please schedule a consultation.";
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", msg);
        resp.put("action", "schedule_consultation");
        resp.put("sessionId", sessionId);
        resp.put("suggestedActions", List.of(isHi ? "परामर्श बुक करें" : "Book Consultation"));
        return resp;
    }

    private List<String> getSuggestedActions(String intent, String lang) {
        boolean isHi = "hi".equalsIgnoreCase(lang);
        if (intent.equals("greeting")) {
            return isHi ? 
                Arrays.asList("परामर्श बुक करें", "मामले की स्थिति", "हमारी सेवाएं") :
                Arrays.asList("Book Consultation", "Check Case Status", "Our Services");
        }
        return isHi ? List.of("मुख्य मेनू") : List.of("Main Menu");
    }

    private String detectIntent(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey") || lower.contains("नमस्ते")) return "greeting";
        if (lower.contains("status") || lower.contains("case") || lower.contains("मेरे मामले") || lower.contains("स्थिति")) return "case_status";
        if (lower.contains("owner") || lower.contains("founder") || lower.contains("anuj kapoor")) return "firm_owners";
        if (lower.contains("corporate") || lower.contains("business") || lower.contains("commercial")) return "corporate_litigation";
        if (lower.contains("consultation") || lower.contains("appointment") || lower.contains("schedule") || lower.contains("परामर्श")) return "consultation";
        return "unknown";
    }

    private boolean requiresEscalation(String message) {
        String lower = message.toLowerCase();
        return ESCALATION_TRIGGERS.stream().anyMatch(lower::contains);
    }

    private Map<String, Object> generateResponse(String intent, int messageCount, boolean isLocked, boolean needsEscalation, String lang) {
        boolean isHi = "hi".equalsIgnoreCase(lang);
        Map<String, Object> resp = new HashMap<>();
        resp.put("barCouncilNotice", isHi ? "बार काउंसिल ऑफ इंडिया के नियमों के अनुसार..." : BAR_COUNCIL_DISCLAIMER);
        
        if (isLocked) {
            resp.put("message", isHi ? "विशिष्ट कानूनी सलाह के लिए, कृपया परामर्श बुक करें।" : "For specific legal advice, please book a consultation.");
            resp.put("action", "schedule_consultation");
            return resp;
        }

        switch (intent) {
            case "greeting":
                resp.put("message", isHi ? "नमस्ते! मैं आपका कानूनी सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?" : "Welcome! I'm your legal assistant. How can I help you today?");
                break;
            case "case_status":
                resp.put("message", isHi ? "अपने मामले की स्थिति जांचने के लिए, कृपया क्लाइंट पोर्टल पर लॉग इन करें।" : "To check your case status, please log in to the Client Portal.");
                resp.put("action", "login_portal");
                break;
            case "consultation":
                resp.put("message", isHi ? "मैं परामर्श निर्धारित करने में आपकी सहायता कर सकता हूँ।" : "I can help you schedule a consultation.");
                resp.put("action", "schedule_consultation");
                break;
            default:
                resp.put("message", isHi ? "मैं मुख्य रूप से कॉर्पोरेट कानून और आपके मामले की स्थिति के बारे में जानकारी दे सकता हूँ।" : "I can provide info on corporate law and case statuses.");
        }
        
        return resp;
    }
}
