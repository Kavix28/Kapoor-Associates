const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');

const router = express.Router();

const LEGAL_KNOWLEDGE = {
  // Firm Information - MANDATORY KNOWLEDGE
  firmInfo: {
    name: "KAPOOR & ASSOCIATES, ADVOCATES & LEGAL ADVISORS",
    advocates: [
      {
        name: "Anuj Kapoor",
        title: "Founder & Principal Advocate", 
        experience: "20+ years",
        court: "Delhi High Court",
        role: "founder"
      },
      {
        name: "Kirti Kapoor",
        title: "Advocate & Core Partner",
        experience: "10+ years", 
        court: "Delhi High Court",
        role: "core advocate"
      }
    ],
    practiceAreas: [
      "Family & Divorce Law",
      "Property & Land Disputes", 
      "Civil & Criminal Litigation",
      "Consumer & Labor Disputes",
      "Commercial & Business Law",
      "Legal Advisory Services"
    ],
    offices: [
      "Tis Hazari Courts, Delhi",
      "Preet Vihar, Delhi"
    ]
  },

  intents: {
    greeting: {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'namaste', 'start'],
      responses: [
        "Welcome to Kapoor & Associates. I'm your legal information assistant and can help explain corporate law concepts, court processes, and firm information. What would you like to know?",
        "Good day! I can provide general guidance on corporate legal matters, explain court procedures, and share information about our Delhi High Court practice. How may I assist you?"
      ],
      followUp: "You can ask me about corporate law, litigation processes, our advocates, or schedule a consultation."
    },

    // FIRM OWNER/ADVOCATE QUESTIONS - MANDATORY
    firm_owners: {
      patterns: ['owner', 'who owns', 'who runs', 'founder', 'principal', 'advocates', 'lawyers', 'who are the advocates', 'anuj kapoor', 'kirti kapoor', 'team'],
      responses: [
        "Kapoor & Associates is led by Advocate Anuj Kapoor, Founder & Principal Advocate with over 20 years of experience before the Delhi High Court, along with Advocate Kirti Kapoor, who has over 10 years of experience and serves as a core partner of the firm."
      ],
      followUp: "Both advocates represent clients across all areas of law including family matters, property disputes, civil & criminal litigation, and commercial law. Would you like to know more about their practice areas or schedule a consultation?"
    },

    // SMART LEGAL GUIDANCE - HIGH LEVEL EXPLANATIONS
    family_law: {
      patterns: ['divorce', 'family law', 'child custody', 'alimony', 'maintenance', 'matrimonial', 'family dispute', 'separation'],
      responses: [
        "Family law matters typically involve divorce proceedings, child custody arrangements, alimony and maintenance issues, and property division. The process generally includes filing petitions, mediation attempts, evidence presentation, and court hearings. Delhi High Court handles complex matrimonial matters with specific procedural requirements."
      ],
      limitation: "Each family matter depends on specific circumstances and applicable personal laws, so this is general information only.",
      followUp: "Would you like me to explain the typical process for divorce proceedings, or would you prefer to discuss your specific family matter in a confidential consultation?"
    },

    property_disputes: {
      patterns: ['property dispute', 'land dispute', 'real estate', 'property title', 'landlord tenant', 'property inheritance'],
      responses: [
        "Property disputes usually involve title conflicts, boundary issues, landlord-tenant disagreements, or inheritance matters. Resolution typically requires examining property documents, conducting title searches, and pursuing legal remedies through civil courts. Key factors include clear documentation, possession rights, and applicable property laws."
      ],
      limitation: "Property law depends heavily on specific documents and local regulations, so this is general guidance only.",
      followUp: "I can explain more about property title verification procedures, or you might want to discuss your specific property matter in a consultation."
    },

    criminal_defense: {
      patterns: ['criminal case', 'criminal defense', 'police case', 'FIR', 'bail', 'criminal charges', 'arrest'],
      responses: [
        "Criminal defense involves protecting the rights of accused persons through various stages including investigation, trial, and appeals. The process typically includes bail applications, evidence examination, witness cross-examination, and legal arguments. Delhi High Court handles serious criminal matters and appeals from lower courts."
      ],
      limitation: "Criminal law procedures vary significantly based on the nature of charges and specific circumstances.",
      followUp: "Criminal matters require immediate legal attention. Would you like to understand more about bail procedures, or discuss your specific criminal matter in an urgent consultation?"
    },

    corporate_litigation: {
      patterns: ['corporate litigation', 'commercial litigation', 'business dispute', 'company lawsuit', 'corporate case', 'high court litigation', 'court case'],
      responses: [
        "Corporate litigation typically involves disputes between businesses, breach of commercial contracts, shareholder conflicts, or regulatory compliance issues. The process generally includes case assessment, evidence gathering, legal strategy development, and court proceedings. Delhi High Court handles complex commercial matters with specific procedural requirements."
      ],
      limitation: "Each case depends on its specific facts and applicable laws, so this is general information only.",
      followUp: "Would you like me to explain the typical timeline for corporate litigation, or would you prefer to discuss your specific situation in a consultation?"
    },

    contract_disputes: {
      patterns: ['contract', 'agreement', 'contract breach', 'contract dispute', 'breach of contract', 'commercial contract', 'contract violation'],
      responses: [
        "Contract disputes usually arise from disagreements over terms, non-performance, or breach of obligations. The resolution process typically involves reviewing the contract terms, assessing damages, attempting negotiation, and if necessary, pursuing legal remedies through courts or arbitration. Key factors include contract validity, performance obligations, and available remedies."
      ],
      limitation: "Contract law depends heavily on specific terms and circumstances, so this is general guidance only.",
      followUp: "I can explain more about contract enforcement procedures, or you might want to discuss your specific contract matter in a confidential consultation."
    },

    corporate_compliance: {
      patterns: ['compliance', 'corporate governance', 'regulatory compliance', 'company law', 'corporate advisory', 'regulations', 'legal requirements'],
      responses: [
        "Corporate compliance involves adhering to various laws including the Companies Act, SEBI regulations, labor laws, and tax requirements. This typically includes maintaining proper corporate records, conducting board meetings, filing regulatory returns, and ensuring governance standards. Non-compliance can result in penalties, legal action, or regulatory sanctions."
      ],
      limitation: "Compliance requirements vary by company type and business activities, so this is general information only.",
      followUp: "Would you like to understand specific compliance areas, or discuss your company's compliance needs in a consultation?"
    },

    court_process: {
      patterns: ['court process', 'litigation process', 'how does court work', 'court proceedings', 'legal process', 'lawsuit process', 'high court process'],
      responses: [
        "Court proceedings generally follow these stages: case filing, service of notice, written statements, evidence presentation, arguments, and judgment. Delhi High Court commercial matters typically involve case management hearings, discovery processes, and detailed legal arguments. The timeline varies but commercial cases often take 1-3 years depending on complexity."
      ],
      limitation: "Court procedures can vary significantly based on case type and specific circumstances.",
      followUp: "I can explain more about specific court procedures, or you might want to discuss your legal matter's likely process in a consultation."
    },

    shareholder_disputes: {
      patterns: ['shareholder dispute', 'director dispute', 'corporate governance dispute', 'minority shareholder', 'board disputes', 'company disputes'],
      responses: [
        "Shareholder disputes often involve disagreements over company management, dividend distribution, board decisions, or minority shareholder rights. Resolution typically requires examining company articles, board resolutions, and applicable company law provisions. Remedies may include derivative suits, oppression petitions, or winding-up proceedings."
      ],
      limitation: "Shareholder rights and remedies depend on specific company structure and circumstances.",
      followUp: "Would you like to understand more about minority shareholder protections, or discuss your specific corporate governance concern in a consultation?"
    },

    arbitration: {
      patterns: ['arbitration', 'commercial arbitration', 'dispute resolution', 'mediation', 'alternative dispute resolution', 'adr'],
      responses: [
        "Arbitration provides a private alternative to court litigation for commercial disputes. The process typically involves appointing arbitrators, presenting evidence and arguments, and receiving a binding award. It's often faster than court proceedings and allows parties to choose specialized arbitrators. Indian arbitration follows the Arbitration and Conciliation Act."
      ],
      limitation: "Arbitration suitability depends on contract terms and dispute nature.",
      followUp: "I can explain more about arbitration procedures, or you might want to discuss whether arbitration suits your specific dispute in a consultation."
    },

    consultation: {
      patterns: ['consultation', 'appointment', 'meeting', 'schedule', 'book consultation', 'legal advice', 'meet advocate'],
      responses: [
        "I'd be happy to help you schedule a confidential consultation. Our advocates provide detailed case analysis, strategic advice, and practical solutions tailored to your specific legal matter. Consultations can be arranged at our Delhi offices or online as per your preference."
      ],
      followUp: "Would you like to schedule a consultation now, or do you have other questions about our services?"
    },

    fees: {
      patterns: ['fees', 'cost', 'charges', 'pricing', 'how much', 'consultation fee', 'legal fees'],
      responses: [
        "Legal fees are structured based on case complexity, time requirements, and matter type. We provide transparent fee discussions during consultation, including options for fixed fees, hourly rates, or success-based arrangements where appropriate. Initial consultation fees are discussed when scheduling."
      ],
      limitation: "Specific fee information depends on your particular legal matter and requirements.",
      followUp: "Fee structures are best discussed during consultation where we can understand your specific needs. Would you like to schedule a consultation?"
    },

    urgent_legal: {
      patterns: ['urgent', 'emergency', 'immediate', 'asap', 'quickly', 'time sensitive', 'deadline'],
      responses: [
        "For time-sensitive legal matters, immediate consultation is advisable to understand your options and deadlines. Legal deadlines are often strict, and early intervention can significantly impact outcomes. We can arrange priority consultations for urgent corporate matters."
      ],
      limitation: "Urgent matters require immediate professional assessment of your specific situation.",
      followUp: "I recommend scheduling an immediate consultation to discuss your urgent legal matter. Would you like me to help arrange this?"
    }
  },
  
  // SINGLE DISCLAIMER - APPEARS ONCE
  disclaimer: "This assistant provides general legal information only and does not constitute legal advice or create a lawyer-client relationship.",
  
  // ESCALATION TRIGGERS
  escalation_triggers: [
    'my case', 'my company', 'our business', 'what should i do', 'recommend', 'suggest action', 
    'my situation', 'advice for me', 'help me decide', 'my contract', 'my dispute', 'our problem'
  ],
  
  // BAR COUNCIL COMPLIANCE
  bar_council_disclaimer: "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner."
};

// Enhanced intent detection with better matching
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  let bestMatch = { intent: 'unknown', confidence: 0 };
  
  // Check for firm owner/advocate questions first (highest priority)
  const ownerPatterns = LEGAL_KNOWLEDGE.intents.firm_owners.patterns;
  for (const pattern of ownerPatterns) {
    if (lowerMessage.includes(pattern.toLowerCase())) {
      return { intent: 'firm_owners', confidence: 0.9 };
    }
  }
  
  // Check other intents
  for (const [intent, data] of Object.entries(LEGAL_KNOWLEDGE.intents)) {
    if (intent === 'firm_owners') continue; // Already checked above
    
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        // Calculate confidence based on pattern match quality
        const words = lowerMessage.split(' ');
        const patternWords = pattern.toLowerCase().split(' ');
        const matchScore = patternWords.filter(word => 
          words.some(msgWord => msgWord.includes(word) || word.includes(msgWord))
        ).length / patternWords.length;
        
        if (matchScore > bestMatch.confidence) {
          bestMatch = { intent, confidence: matchScore };
        }
      }
    }
  }
  
  return bestMatch;
}

// Check if message requires escalation to consultation
function requiresEscalation(message) {
  const lowerMessage = message.toLowerCase();
  return LEGAL_KNOWLEDGE.escalation_triggers.some(trigger => 
    lowerMessage.includes(trigger.toLowerCase())
  );
}

// Smart response generation with structured format
function generateResponse(intent, messageCount, isAdviceLimit = false, needsEscalation = false) {
  // Handle advice limit reached
  if (isAdviceLimit) {
    return {
      message: "I've provided general legal information to help you understand these concepts. For specific advice tailored to your situation, I recommend scheduling a confidential consultation with our advocates. They can provide detailed analysis and strategic guidance for your particular matter.",
      action: 'schedule_consultation',
      disclaimer: messageCount === 1 ? LEGAL_KNOWLEDGE.disclaimer : null,
      barCouncilNotice: LEGAL_KNOWLEDGE.bar_council_disclaimer
    };
  }
  
  // Handle escalation needed
  if (needsEscalation) {
    return {
      message: "I understand you're looking for specific guidance for your situation. While I can explain general legal concepts, your matter requires personalized legal analysis. I'd recommend scheduling a consultation where our advocates can review your specific circumstances and provide tailored advice.",
      action: 'schedule_consultation',
      disclaimer: messageCount === 1 ? LEGAL_KNOWLEDGE.disclaimer : null,
      barCouncilNotice: LEGAL_KNOWLEDGE.bar_council_disclaimer
    };
  }
  
  // Handle unknown intent
  if (intent === 'unknown') {
    return {
      message: "I can help explain corporate law concepts, court processes, litigation procedures, compliance requirements, and information about our firm and advocates. I can also help you schedule a consultation for specific legal matters. What would you like to know more about?",
      disclaimer: messageCount === 1 ? LEGAL_KNOWLEDGE.disclaimer : null,
      barCouncilNotice: LEGAL_KNOWLEDGE.bar_council_disclaimer
    };
  }
  
  // Generate structured response for known intents
  const intentData = LEGAL_KNOWLEDGE.intents[intent];
  if (!intentData) {
    return generateResponse('unknown', messageCount);
  }
  
  const responses = intentData.responses || [];
  const mainMessage = responses[Math.floor(Math.random() * responses.length)];
  
  // Build structured response
  let fullMessage = mainMessage;
  
  // Add limitation statement for legal topics (not for greetings/firm info)
  if (intentData.limitation && !['greeting', 'firm_owners', 'consultation'].includes(intent)) {
    fullMessage += `\n\n${intentData.limitation}`;
  }
  
  // Add smart follow-up
  if (intentData.followUp) {
    fullMessage += `\n\n${intentData.followUp}`;
  }
  
  return { 
    message: fullMessage,
    disclaimer: messageCount === 1 ? LEGAL_KNOWLEDGE.disclaimer : null,
    barCouncilNotice: LEGAL_KNOWLEDGE.bar_council_disclaimer,
    action: ['consultation', 'urgent_legal'].includes(intent) ? 'schedule_consultation' : null
  };
}

// Validation middleware
const validateChatMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('sessionId')
    .optional()
    .isUUID()
    .withMessage('Invalid session ID format')
];

// Chat endpoint
router.post('/chat', validateChatMessage, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { message, sessionId: providedSessionId } = req.body;
  const sessionId = providedSessionId || uuidv4();
  const clientIP = req.ip || req.connection.remoteAddress;
  
  try {
    console.log('🤖 Chat message received:', { sessionId, message: message.substring(0, 50) + '...' });
    
    // Get or create session
    const { data: session, error: sessionError } = await supabase
      .from('chatbot_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    let currentSession = session;
    if (sessionError || !session) {
      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('chatbot_sessions')
        .insert([{
          session_id: sessionId,
          message_count: 0,
          advice_count: 0,
          is_locked: false,
          ip_address: clientIP
        }])
        .select()
        .single();
      
      if (createError) {
        throw createError;
      }
      
      currentSession = newSession;
    }
    
    // Check if session is locked (too many advice requests)
    if (currentSession.is_locked) {
      const response = {
        message: "You've reached the limit for general legal information. To get specific advice for your situation, please schedule a consultation with our advocates.",
        action: 'schedule_consultation',
        sessionId,
        disclaimer: "This chatbot is limited to general information only. Specific legal advice requires professional consultation."
      };
      
      return res.json(response);
    }
    
    // Detect intent and check for escalation
    const intentResult = detectIntent(message);
    const needsEscalation = requiresEscalation(message);
    const isAdviceRequest = !['greeting', 'consultation'].includes(intentResult.intent);
    
    // Update session counters
    const newMessageCount = currentSession.message_count + 1;
    const newAdviceCount = currentSession.advice_count + (isAdviceRequest ? 1 : 0);
    const shouldLock = newAdviceCount >= 2; // Lock after 2 advice responses
    
    await supabase
      .from('chatbot_sessions')
      .update({
        message_count: newMessageCount,
        advice_count: newAdviceCount,
        is_locked: shouldLock,
        last_activity: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    // Generate intelligent response
    const botResponse = generateResponse(
      intentResult.intent, 
      newMessageCount,
      shouldLock,
      needsEscalation
    );
    
    // Log conversation
    await supabase
      .from('chatbot_conversations')
      .insert([{
        session_id: sessionId,
        user_message: message,
        bot_response: botResponse,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        escalated: needsEscalation,
        ip_address: clientIP
      }]);
    
    // Prepare response
    const response = {
      ...botResponse,
      sessionId,
      intent: intentResult.intent,
      remainingAdviceCount: Math.max(0, 2 - newAdviceCount)
    };
    
    // Add consultation CTA if needed
    if (shouldLock || needsEscalation || intentResult.intent === 'consultation') {
      response.action = 'schedule_consultation';
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Chatbot service temporarily unavailable',
      message: 'Please try again later or contact us directly for assistance',
      sessionId,
      response: {
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or feel free to contact our office directly for immediate assistance.",
        intent: 'error',
        confidence: 1.0,
        escalateToConsultation: true,
        disclaimer: "This chatbot provides general legal information only and does not constitute legal advice or create a lawyer-client relationship."
      }
    });
  }
});

// Get session info
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessionId) {
    return res.status(400).json({
      error: 'Session ID required'
    });
  }
  
  try {
    const { data: session, error } = await supabase
      .from('chatbot_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error || !session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }
    
    res.json({
      sessionId: session.session_id,
      messageCount: session.message_count,
      adviceCount: session.advice_count,
      isLocked: session.is_locked,
      remainingAdviceCount: Math.max(0, 2 - session.advice_count),
      createdAt: session.created_at,
      lastActivity: session.last_activity
    });
    
  } catch (error) {
    console.error('Session lookup error:', error);
    res.status(500).json({
      error: 'Failed to retrieve session information'
    });
  }
});

// Reset session (for testing purposes)
router.post('/session/:sessionId/reset', async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    await supabase
      .from('chatbot_sessions')
      .update({
        message_count: 0,
        advice_count: 0,
        is_locked: false,
        last_activity: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    res.json({
      message: 'Session reset successfully',
      sessionId
    });
    
  } catch (error) {
    console.error('Session reset error:', error);
    res.status(500).json({
      error: 'Failed to reset session'
    });
  }
});

module.exports = router;