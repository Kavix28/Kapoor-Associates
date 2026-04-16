import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Kapoor & Associates | Data Protection & Privacy</title>
        <meta name="description" content="Privacy policy for Kapoor & Associates. Learn how we protect your personal information and maintain confidentiality in our legal services." />
        <meta name="keywords" content="privacy policy, data protection, confidentiality, Kapoor Associates privacy" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/privacy-policy" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzQxNTEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LockClosedIcon className="h-16 w-16 text-gold-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy and confidentiality are our highest priorities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-dark p-8"
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-sm mb-8">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center">
                    <EyeIcon className="h-6 w-6 text-gold-500 mr-3" />
                    1. Information We Collect
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Kapoor & Associates collects information that you provide directly to us when you:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Submit consultation booking requests</li>
                    <li>Contact us through our website forms</li>
                    <li>Interact with our AI chatbot</li>
                    <li>Subscribe to our communications</li>
                    <li>Visit our website (through cookies and analytics)</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Types of Information:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, company name</li>
                    <li><strong>Legal Matter Information:</strong> Description of legal issues or consultation requests</li>
                    <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
                    <li><strong>Usage Information:</strong> Pages visited, time spent on site, interaction patterns</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>To schedule and manage consultation appointments</li>
                    <li>To respond to your inquiries and provide legal services</li>
                    <li>To improve our website and services</li>
                    <li>To send appointment confirmations and reminders</li>
                    <li>To comply with legal and regulatory requirements</li>
                    <li>To protect our rights and prevent fraud</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    3. Attorney-Client Privilege & Confidentiality
                  </h2>
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-6 mb-4">
                    <div className="flex items-start">
                      <ShieldCheckIcon className="h-6 w-6 text-gold-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gold-400 font-semibold mb-2">Professional Confidentiality</p>
                        <p className="text-gray-300 leading-relaxed">
                          All communications with Kapoor & Associates are protected by attorney-client privilege 
                          once a formal attorney-client relationship is established. We maintain the highest 
                          standards of confidentiality in accordance with Bar Council of India guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    4. Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                    <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our website and services</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                    <li><strong>Professional Consultants:</strong> Other legal professionals when necessary for your representation</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    6. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Our website uses cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve website functionality and user experience</li>
                    <li>Provide personalized content and services</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    7. Your Rights and Choices
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong>Access:</strong> Request access to your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your information</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    8. Data Retention
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services 
                    and comply with legal obligations. Client files and communications are retained in 
                    accordance with professional conduct rules and applicable law.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    9. Third-Party Links
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our website may contain links to third-party websites. We are not responsible for 
                    the privacy practices of these external sites. We encourage you to review their 
                    privacy policies before providing any personal information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    10. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any 
                    material changes by posting the new Privacy Policy on this page and updating 
                    the "Last Updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    11. Contact Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-dark-700 rounded-lg p-6">
                    <p className="text-white font-semibold mb-2">Kapoor & Associates, Advocates & Legal Advisors</p>
                    <p className="text-gray-300 text-sm mb-1">Email: kapoorandassociatesadv@gmail.com</p>
                    <p className="text-gray-300 text-sm mb-1">Phone: +91 98916 56411 | +91 98103 16427</p>
                    <p className="text-gray-300 text-sm mb-1">
                      Tis Hazari Office: 257, Civil Wing, Tis Hazari Courts, Delhi – 110054
                    </p>
                    <p className="text-gray-300 text-sm">
                      Preet Vihar Office: 103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bar Council Compliance */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-dark p-8 text-center border-gold-500/20"
          >
            <ScaleIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-4">
              Professional Compliance
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
              This privacy policy is maintained in strict compliance with the Bar Council of India guidelines 
              and applicable data protection laws. All client information is handled with the utmost 
              confidentiality and professional ethics.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;