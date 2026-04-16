import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const TermsOfUse = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Use - Kapoor & Associates | Legal Website Terms</title>
        <meta name="description" content="Terms of use for Kapoor & Associates website. Legal terms and conditions for using our corporate law firm's website and services." />
        <meta name="keywords" content="terms of use, legal terms, website conditions, Kapoor Associates terms" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/terms-of-use" />
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
            <DocumentTextIcon className="h-16 w-16 text-gold-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Legal terms and conditions for using the Kapoor & Associates website
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
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
                    <ScaleIcon className="h-6 w-6 text-gold-500 mr-3" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    By accessing and using the Kapoor & Associates website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    2. Website Purpose and Scope
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    This website is maintained by Kapoor & Associates, Advocates & Legal Advisors, for informational purposes only. The content provided on this website:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Does not constitute legal advice</li>
                    <li>Is not intended to create an attorney-client relationship</li>
                    <li>Should not be relied upon for making legal decisions</li>
                    <li>May not reflect the most current legal developments</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    3. Bar Council Compliance
                  </h2>
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-6 mb-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-6 w-6 text-gold-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gold-400 font-semibold mb-2">Important Legal Notice</p>
                        <p className="text-gray-300 leading-relaxed">
                          <strong>As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner.</strong> Information provided is for general purposes only and does not constitute legal advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    4. Use License
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of the materials on Kapoor & Associates' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    5. Disclaimer
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    The materials on Kapoor & Associates' website are provided on an 'as is' basis. Kapoor & Associates makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    6. Limitations
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    In no event shall Kapoor & Associates or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kapoor & Associates' website, even if Kapoor & Associates or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    7. Privacy and Data Protection
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Your privacy is important to us. Any personal information collected through this website will be handled in accordance with our Privacy Policy. By using this website, you consent to the collection and use of information as outlined in our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    8. Consultation Booking Terms
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When booking consultations through our website:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>All consultations are subject to availability and confirmation</li>
                    <li>Consultation fees and terms will be discussed during the appointment</li>
                    <li>Cancellation policy will be communicated upon booking confirmation</li>
                    <li>No attorney-client relationship is established until formal engagement</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    9. Modifications
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Kapoor & Associates may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    10. Governing Law
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Delhi, India.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    11. Contact Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have any questions about these Terms of Use, please contact us:
                  </p>
                  <div className="bg-dark-700 rounded-lg p-6">
                    <p className="text-white font-semibold mb-2">Kapoor & Associates, Advocates & Legal Advisors</p>
                    <p className="text-gray-300 text-sm mb-1">Email: kapoorandassociatesadv@gmail.com</p>
                    <p className="text-gray-300 text-sm mb-1">Phone: +91 98916 56411 | +91 98103 16427</p>
                    <p className="text-gray-300 text-sm">
                      Office: 257, Civil Wing, Tis Hazari Courts, Delhi – 110054
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Notice */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-dark p-8 text-center border-gold-500/20"
          >
            <ShieldCheckIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-4">
              Professional Compliance
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
              This website is maintained in strict compliance with the Bar Council of India guidelines. 
              All legal services are provided in accordance with professional conduct rules and ethical standards.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TermsOfUse;