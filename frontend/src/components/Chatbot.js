import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  PhoneIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { useChatbot } from '../context/ChatbotContext';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const {
    sendMessage,
    resetSession,
    language,
    setLanguage,
    sendFeedback
  } = useChatbot();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleActionClick = (action) => {
    switch (action) {
      case 'schedule_consultation':
        window.open('/contact', '_blank');
        break;
      case 'contact_firm':
        window.open('/contact', '_blank');
        break;
      default:
        break;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={openChatbot}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-dark-900 rounded-full shadow-gold-lg hover:shadow-gold transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open legal assistance chat"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-dark-800 border border-dark-600 rounded-xl shadow-dark-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-800 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center mr-3">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-dark-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Legal Assistant</h3>
                  <p className="text-xs text-gray-300">Kapoor & Associates</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                  className="flex items-center px-2 py-1 bg-dark-700 rounded text-[10px] font-bold text-gold-400 hover:bg-dark-600 transition-colors"
                >
                  <LanguageIcon className="h-3 w-3 mr-1" />
                  {language === 'en' ? 'हिन्दी' : 'English'}
                </button>

                {/* Advice Counter */}
                {!isLocked && (
                  <div className="text-xs text-gray-300 bg-dark-700 px-2 py-1 rounded">
                    {remainingAdviceCount}/3
                  </div>
                )}
                
                <button
                  onClick={closeChatbot}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-gold-500 text-dark-900'
                        : 'bg-dark-700 text-gray-100'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {message.message}
                    </div>
                    
                    {/* Bot message disclaimer - only show if present */}
                    {message.type === 'bot' && message.disclaimer && (
                      <div className="mt-3 pt-2 border-t border-dark-600">
                        <div className="flex items-start">
                          <ExclamationTriangleIcon className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-400 leading-tight">
                            {message.disclaimer}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Action chips/links for complex actions */}
                    {message.action && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.action === 'schedule_consultation' && (
                          <Link
                            to="/contact"
                            className="inline-flex items-center px-3 py-1 bg-gold-500 text-dark-900 text-xs font-medium rounded hover:bg-gold-600 transition-colors duration-200"
                          >
                            <CalendarDaysIcon className="h-3 w-3 mr-1" />
                            {language === 'hi' ? 'परामर्श बुक करें' : 'Schedule Consultation'}
                          </Link>
                        )}
                        {(message.action === 'login_portal' || message.action === 'case_status') && (
                          <Link
                            to="/client/login"
                            className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors duration-200"
                          >
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            {language === 'hi' ? 'लॉग इन करें' : 'Client Login'}
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Suggested Action Chips (Quick Replies) */}
                    {message.type === 'bot' && message.suggestedActions?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dark-600 flex flex-wrap gap-2">
                        {message.suggestedActions.map((actionText, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(actionText)}
                            className="text-[10px] px-2 py-1 bg-dark-800 text-gold-500 border border-gold-500/30 rounded-lg hover:bg-gold-500/10 transition-colors"
                          >
                            {actionText}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                      
                      {message.type === 'bot' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { sendFeedback('up', message.id); toast.success('Thanks for feedback!'); }}
                            className="text-gray-500 hover:text-green-500 transition-colors"
                          >
                            <HandThumbUpIcon className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => { sendFeedback('down', message.id); toast.success('Thanks! We will improve.'); }}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <HandThumbDownIcon className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-700 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-600 bg-dark-800">
              {isLocked ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-400">
                    Chat limit reached. For specific legal advice:
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/contact"
                      className="btn-primary text-sm py-2 px-4 w-full"
                    >
                      Schedule Consultation
                    </Link>
                    <button
                      onClick={resetSession}
                      className="text-sm py-2 px-4 w-full bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors duration-200"
                    >
                      Start New Conversation
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about our advocates, corporate law, court processes..."
                    className="flex-1 input-dark text-sm py-2 px-3"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-dark-900 p-2 rounded-lg transition-colors duration-200"
                    aria-label="Send message"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </form>
              )}
              
              {/* Character count */}
              {!isLocked && inputMessage.length > 400 && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {inputMessage.length}/500
                </p>
              )}
            </div>

            {/* Legal Notice */}
            <div className="px-4 py-2 bg-dark-700 border-t border-dark-600">
              <p className="text-xs text-gray-500 text-center">
                This chat provides general information only. Not legal advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;