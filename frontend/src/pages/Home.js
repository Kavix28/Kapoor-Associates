import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ScaleIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Components
import Chatbot from '../components/Chatbot';

const Home = () => {
  const practiceAreas = [
    {
      icon: ScaleIcon,
      title: 'Family & Divorce Law',
      description: 'Compassionate representation in divorce proceedings, child custody, and family disputes.',
      href: '/practice-areas#family-law'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Property & Land Disputes',
      description: 'Expert advocacy in property disputes, land acquisition, and real estate litigation.',
      href: '/practice-areas#property-law'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Civil & Criminal Litigation',
      description: 'Comprehensive representation in civil suits and criminal defense matters.',
      href: '/practice-areas#litigation'
    },
    {
      icon: UserGroupIcon,
      title: 'Consumer & Labor Disputes',
      description: 'Protection of consumer rights and resolution of employment-related conflicts.',
      href: '/practice-areas#consumer-labor'
    },
    {
      icon: DocumentTextIcon,
      title: 'Commercial & Business Law',
      description: 'Legal counsel for businesses, contracts, and commercial dispute resolution.',
      href: '/practice-areas#commercial'
    },
    {
      icon: BanknotesIcon,
      title: 'Legal Advisory Services',
      description: 'Comprehensive legal guidance across all areas of law and court proceedings.',
      href: '/practice-areas#advisory'
    }
  ];

  const trustPillars = [
    {
      icon: ShieldCheckIcon,
      title: 'Integrity & Trust',
      description: 'Unwavering commitment to ethical practice and client confidentiality in all legal matters.'
    },
    {
      icon: ScaleIcon,
      title: 'Experienced Advocacy',
      description: 'Decades of combined experience representing clients across all types of court proceedings.'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Delhi High Court Practice',
      description: 'Specialized expertise in Delhi High Court proceedings across diverse areas of law.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kapoor & Associates - Advocates & Legal Advisors | Delhi High Court Practice</title>
        <meta name="description" content="Experienced legal advocates representing individuals, families, and businesses across all court matters. Expert counsel by Advocate Anuj Kapoor and Advocate Kirti Kapoor in Delhi High Court practice." />
        <meta name="keywords" content="Delhi High Court advocates, family law lawyer Delhi, property dispute lawyer, civil litigation Delhi, criminal defense lawyer, commercial law Delhi, legal advisors" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzQxNTEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        </div>

        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              <span className="block text-white mb-2">Legal Advocacy.</span>
              <span className="block text-gold-500 mb-2">Every Court Matter.</span>
              <span className="block text-white">Trusted Representation.</span>
            </h1>

            {/* Advocate Highlight */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                KAPOOR & ASSOCIATES
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-medium mb-2">
                <span className="text-gold-400">Advocate Anuj Kapoor</span> & <span className="text-gold-400">Advocate Kirti Kapoor</span>
              </p>
              <p className="text-md text-gray-400">
                Advocates & Legal Advisors - Delhi High Court Practice
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experienced legal advocates representing individuals, families, and businesses across all court matters. 
              From family disputes to commercial litigation, we provide trusted legal counsel with integrity and dedication.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4 group"
              >
                Schedule Legal Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/high-court-practice"
                className="btn-secondary text-lg px-8 py-4"
              >
                High Court Practice
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Firm Introduction */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Excellence in Legal Practice
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Kapoor & Associates is a trusted legal practice founded on the principles of 
              integrity, dedication, and unwavering commitment to justice. Led by 
              <span className="text-gold-400 font-semibold"> Advocate Anuj Kapoor</span> and 
              <span className="text-gold-400 font-semibold"> Advocate Kirti Kapoor</span>, 
              our firm provides comprehensive legal representation across all court matters, 
              serving individuals, families, and businesses with equal dedication and expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Pillars */}
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
              Our Foundation of Trust
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Built on the pillars of professional excellence and unwavering commitment to client success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-dark p-8 text-center group hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="h-8 w-8 text-dark-900" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas Preview */}
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
              Legal Services Across All Courts
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Comprehensive legal representation for individuals, families, and businesses across 
              all areas of law, with specialized expertise in Delhi High Court proceedings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-6 group hover:border-gold-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mb-4 group-hover:from-gold-500 group-hover:to-gold-600 transition-all duration-300">
                  <area.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {area.description}
                </p>
                <Link
                  to={area.href}
                  className="inline-flex items-center text-gold-500 hover:text-gold-400 font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                >
                  Learn More
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/practice-areas"
              className="btn-primary inline-flex items-center"
            >
              View All Practice Areas
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* High Court Expertise */}
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Delhi High Court Practice Excellence
              </h2>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Our advocates bring extensive experience in Delhi High Court proceedings across diverse 
                areas of law. From family disputes to commercial litigation, we provide skilled representation 
                with meticulous preparation and strategic advocacy for every type of legal matter.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Family law and divorce proceedings',
                  'Property and land dispute resolution',
                  'Civil and criminal litigation matters',
                  'Commercial and business legal disputes'
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
                    <span className="text-gray-200">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/high-court-practice"
                className="btn-secondary"
              >
                Learn About Our Delhi High Court Practice
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
                    <ScaleIcon className="h-10 w-10 text-dark-900" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    Our Legal Team
                  </h3>
                  <p className="text-gold-400 font-semibold mb-4">
                    Advocate Anuj Kapoor & Advocate Kirti Kapoor
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Our experienced advocates bring decades of combined expertise in Delhi High Court practice, 
                    representing clients across all areas of law with dedication, integrity, and unwavering 
                    commitment to achieving justice for every client we serve.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Discuss Your Legal Matter?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Schedule a confidential consultation to discuss your legal requirements 
              with our experienced advocates.
            </p>
            
            <div className="bg-dark-800/50 border border-gold-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-gold-500 mr-2" />
                <span className="text-gold-400 font-semibold">Confidentiality Assured</span>
              </div>
              <p className="text-gray-300 text-sm">
                All consultations are handled with strict confidentiality and attorney-client privilege.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4"
              >
                Schedule Legal Consultation
              </Link>
              <Link
                to="/about"
                className="btn-ghost text-lg px-8 py-4"
              >
                Learn About Our Firm
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
};

export default Home;