import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  ScaleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const HighCourtPractice = () => {
  const courtExpertise = [
    {
      icon: ScaleIcon,
      title: 'Corporate Litigation',
      description: 'Complex corporate disputes, shareholder conflicts, and commercial litigation before Delhi High Court.',
      cases: ['Corporate governance disputes', 'Shareholder derivative actions', 'Director liability cases', 'Corporate fraud matters']
    },
    {
      icon: DocumentTextIcon,
      title: 'Commercial Disputes',
      description: 'High-value commercial disputes, contract breaches, and business conflicts requiring High Court intervention.',
      cases: ['Contract enforcement', 'Business partnership disputes', 'Commercial fraud cases', 'Trade and commerce matters']
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Regulatory Matters',
      description: 'Regulatory compliance disputes, statutory appeals, and administrative law matters before Delhi High Court.',
      cases: ['SEBI enforcement actions', 'RBI regulatory matters', 'Competition law disputes', 'Administrative appeals']
    },
    {
      icon: ShieldCheckIcon,
      title: 'Arbitration-Related Proceedings',
      description: 'Court proceedings related to arbitration, including enforcement and challenge of arbitral awards.',
      cases: ['Award enforcement', 'Section 34 challenges', 'Interim relief applications', 'Arbitration appointment matters']
    }
  ];

  const practiceHighlights = [
    {
      icon: ClockIcon,
      title: '20 Years Experience',
      description: 'Two decades of specialized practice before Delhi High Court in corporate and commercial matters.'
    },
    {
      icon: StarIcon,
      title: 'Strategic Approach',
      description: 'Comprehensive case strategy development with focus on achieving favorable outcomes.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Procedural Expertise',
      description: 'Deep understanding of Delhi High Court procedures, rules, and judicial preferences.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Meticulous Preparation',
      description: 'Thorough case preparation with attention to legal precedents and factual analysis.'
    }
  ];

  const courtServices = [
    'Original jurisdiction matters',
    'Appellate proceedings',
    'Writ petitions and constitutional matters',
    'Interim relief applications',
    'Execution proceedings',
    'Arbitration-related court matters',
    'Regulatory appeals and challenges',
    'Commercial court proceedings'
  ];

  return (
    <>
      <Helmet>
        <title>Delhi High Court Practice - Kapoor & Associates | Corporate Litigation Experts</title>
        <meta name="description" content="Specialized Delhi High Court practice by Advocate Anuj Kapoor with 20 years experience in corporate litigation, commercial disputes, and regulatory matters." />
        <meta name="keywords" content="Delhi High Court lawyer, corporate litigation Delhi, commercial disputes High Court, regulatory matters Delhi, arbitration court proceedings" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/high-court-practice" />
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
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Delhi High Court Practice
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Specialized expertise in corporate and commercial litigation before Delhi High Court
            </p>
            <div className="inline-flex items-center bg-gold-500/10 border border-gold-500/20 rounded-full px-6 py-3">
              <ClockIcon className="h-5 w-5 text-gold-400 mr-2" />
              <span className="text-gold-400 font-semibold">20 Years of Delhi High Court Experience</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Practice Overview */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Excellence in Delhi High Court Advocacy
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our firm specializes in Delhi High Court practice with a focus on corporate and commercial 
                litigation. With over 20 years of experience, Advocate Anuj Kapoor brings strategic thinking, 
                meticulous preparation, and courtroom precision to every matter handled before the Delhi High Court.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Strategic case development and litigation planning',
                  'Expert Delhi High Court representation and advocacy',
                  'Complex commercial dispute resolution',
                  'Regulatory compliance and administrative matters',
                  'Arbitration-related court proceedings'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-gold-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/contact"
                className="btn-primary inline-flex items-center"
              >
                Schedule Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-dark p-8 bg-dark-800/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BuildingOfficeIcon className="h-10 w-10 text-dark-900" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    Delhi High Court Specialization
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Focused practice in corporate and commercial matters with deep understanding of 
                    Delhi High Court procedures, judicial preferences, and case management systems.
                  </p>
                  <div className="bg-primary-900/30 rounded-lg p-4">
                    <p className="text-gold-400 font-semibold text-sm">
                      "Precision in preparation, excellence in advocacy"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Court Expertise Areas */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Areas of Delhi High Court Expertise
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Comprehensive representation across various types of corporate and commercial matters 
              before Delhi High Court with proven track record of success.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {courtExpertise.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-8 group hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <area.icon className="h-6 w-6 text-dark-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white mb-3">
                      {area.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {area.description}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3">Typical Matters Include:</h4>
                  <div className="space-y-2">
                    {area.cases.map((caseType, caseIndex) => (
                      <div key={caseIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-gold-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 text-sm">{caseType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Highlights */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              What Sets Our Practice Apart
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Distinguished by experience, expertise, and unwavering commitment to achieving 
              favorable outcomes for our corporate clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-6 text-center group hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-gold-500 group-hover:to-gold-600 transition-all duration-300">
                  <highlight.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3">
                  {highlight.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Court Services */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Comprehensive Court Services
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our Delhi High Court practice encompasses the full spectrum of court proceedings, 
                from original jurisdiction matters to complex appellate cases, ensuring comprehensive 
                representation for all corporate legal needs.
              </p>
              
              <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-gold-400 mr-2" />
                  Professional Commitment
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Every matter is handled with meticulous attention to detail, strategic planning, 
                  and unwavering commitment to achieving the best possible outcome for our clients 
                  within the framework of professional ethics and legal excellence.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-dark p-8">
                <h3 className="text-xl font-display font-semibold text-white mb-6">
                  Delhi High Court Services
                </h3>
                <div className="grid gap-3">
                  {courtServices.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors duration-300"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-gold-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="card-dark p-8 border-gold-500/20 mb-8">
              <ShieldCheckIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-white mb-4">
                Professional Practice Notice
              </h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>This website does not seek to advertise or solicit work in any manner as per 
                Bar Council of India rules. Information provided is for general purposes only.</strong>
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Our Delhi High Court practice is conducted in strict compliance with professional conduct rules 
                and ethical guidelines prescribed by the Bar Council of India.
              </p>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Experience Delhi High Court Excellence
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Schedule a consultation to discuss your corporate legal matter requiring Delhi High Court representation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4"
              >
                Schedule Consultation
              </Link>
              <Link
                to="/practice-areas"
                className="btn-secondary text-lg px-8 py-4"
              >
                View All Practice Areas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HighCourtPractice;