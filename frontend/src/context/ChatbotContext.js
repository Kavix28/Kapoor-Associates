import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      type: 'bot',
      message: 'Welcome to Kapoor & Associates. I\'m your legal information assistant and can help explain corporate law concepts, court processes, and firm information. What would you like to know?',
      timestamp: new Date(),
      disclaimer: 'This assistant provides general legal information only and does not constitute legal advice or create a lawyer-client relationship.'
    }
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAdviceCount, setRemainingAdviceCount] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'

  const openChatbot = useCallback(() => {
    setIsOpen(true);
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    const currentSessionId = sessionId || uuidv4();
    if (!sessionId) {
      setSessionId(currentSessionId);
    }

    // Add user message
    const userMessageObj = {
      id: uuidv4(),
      type: 'user',
      message: userMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
        message: userMessage.trim(),
        sessionId: currentSessionId,
        language
      });

      const { message, disclaimer, action, remainingAdviceCount: remaining, suggestedActions } = response.data.data;

      // Add bot response
      const botMessageObj = {
        id: uuidv4(),
        type: 'bot',
        message,
        disclaimer,
        action,
        suggestedActions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessageObj]);
      
      if (typeof remaining === 'number') {
        setRemainingAdviceCount(remaining);
      }

      // Check if session is locked
      if (remaining === 0 || action === 'schedule_consultation') {
        setIsLocked(true);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = {
        id: uuidv4(),
        type: 'bot',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact us directly for assistance.',
        action: 'contact_firm',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  const resetSession = useCallback(() => {
    setMessages([
      {
        id: uuidv4(),
        type: 'bot',
        message: 'Welcome to Kapoor & Associates. I\'m your legal information assistant and can help explain corporate law concepts, court processes, and firm information. What would you like to know?',
        timestamp: new Date(),
        disclaimer: 'This assistant provides general legal information only and does not constitute legal advice or create a lawyer-client relationship.'
      }
    ]);
    setSessionId(uuidv4());
    setRemainingAdviceCount(2);
    setIsLocked(false);
  }, []);

  const value = {
    isOpen,
    messages,
    sessionId,
    isLoading,
    remainingAdviceCount,
    isLocked,
    openChatbot,
    closeChatbot,
    sendMessage,
    resetSession,
    language,
    setLanguage,
    sendFeedback: (type, msgId) => api.post('/chatbot/feedback', { type, msgId, sessionId })
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};