import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ScaleIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const PracticeAreas = () => {
  const practiceAreas = [
    {
      id: 'family-law',
      icon: UserGroupIcon,
      title: 'Family & Divorce Law',
      description: 'Compassionate representation in family disputes, divorce proceedings, child custody, and matrimonial matters.',
      services: [
        'Divorce and separation proceedings',
        'Child custody and visitation rights',
        'Alimony and maintenance disputes',
        'Property division in divorce',
        'Domestic violence protection',
        'Adoption and guardianship matters'
      ],
      approach: 'Sensitive handling of family matters with focus on protecting client interests while seeking amicable resolutions wherever possible, ensuring the welfare of all family members involved.'
    },
    {
      id: 'property-law',
      icon: BuildingOfficeIcon,
      title: 'Property & Land Disputes',
      description: 'Expert advocacy in property disputes, land acquisition, real estate transactions, and property-related litigation.',
      services: [
        'Property title disputes',
        'Land acquisition matters',
        'Real estate transaction disputes',
        'Landlord-tenant conflicts',
        'Property inheritance issues',
        'Construction and development disputes'
      ],
      approach: 'Thorough investigation of property records and legal documentation to build strong cases, ensuring clear title and protecting property rights through strategic litigation.'
    },
    {
      id: 'litigation',
      icon: ScaleIcon,
      title: 'Civil & Criminal Litigation',
      description: 'Comprehensive representation in civil suits and criminal defense matters across all courts.',
      services: [
        'Civil litigation and disputes',
        'Criminal defense representation',
        'Recovery and debt collection',
        'Defamation and reputation protection',
        'Personal injury claims',
        'Constitutional and writ petitions'
      ],
      approach: 'Strategic case preparation with meticulous attention to legal precedents and procedural requirements, ensuring robust representation in both civil and criminal proceedings.'
    },
    {
      id: 'consumer-labor',
      icon: ShieldCheckIcon,
      title: 'Consumer & Labor Disputes',
      description: 'Protection of consumer rights and resolution of employment-related conflicts and labor disputes.',
      services: [
        'Consumer protection cases',
        'Employment and labor disputes',
        'Service deficiency complaints',
        'Workplace harassment issues',
        'Wrongful termination cases',
        'Industrial and labor law matters'
      ],
      approach: 'Dedicated advocacy for individual rights against institutional powers, ensuring fair treatment and appropriate compensation for consumer and labor grievances.'
    },
    {
      id: 'commercial',
      icon: BriefcaseIcon,
      title: 'Commercial & Business Law',
      description: 'Legal counsel for businesses, commercial transactions, and business-related dispute resolution.',
      services: [
        'Commercial contract disputes',
        'Business partnership conflicts',
        'Corporate compliance matters',
        'Commercial arbitration',
        'Business formation and advisory',
        'Intellectual property disputes'
      ],
      approach: 'Business-focused legal solutions that balance commercial objectives with legal compliance, providing practical advice for sustainable business operations and growth.'
    },
    {
      id: 'advisory',
      icon: DocumentTextIcon,
      title: 'Legal Advisory Services',
      description: 'Comprehensive legal guidance and advisory services across all areas of law and legal matters.',
      services: [
        'Legal consultation and advice',
        'Document drafting and review',
        'Legal compliance guidance',
        'Risk assessment and mitigation',
        'Legal research and opinions',
        'Preventive legal counseling'
      ],
      approach: 'Proactive legal guidance designed to prevent disputes and ensure compliance, providing clients with clear understanding of their legal rights and obligations.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Legal Services - Kapoor & Associates | All Court Matters | Delhi High Court</title>
        <meta name="description" content="Comprehensive legal services by Kapoor & Associates. Expert representation in family law, property disputes, civil & criminal litigation, commercial law, and all court matters." />
        <meta name="keywords" content="family law Delhi, property dispute lawyer, civil litigation Delhi, criminal defense lawyer, commercial law Delhi, divorce lawyer, legal services Delhi" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/practice-areas" />
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
              Legal Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive legal representation across all areas of law with specialized Delhi High Court expertise
            </p>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas Content */}
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
              Comprehensive Legal Practice Areas
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our firm provides expert legal representation across all areas of law, serving individuals, 
              families, and businesses with equal dedication and professional excellence.
            </p>
          </motion.div>

          <div className="space-y-16">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.id}
                id={area.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-8 lg:p-12"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Header */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mr-6">
                        <area.icon className="h-8 w-8 text-dark-900" />
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">
                          {area.title}
                        </h3>
                        <p className="text-gray-400 text-lg">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xl font-display font-semibold text-white mb-4">
                      Our Services Include:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {area.services.map((service, serviceIndex) => (
                        <div
                          key={serviceIndex}
                          className="flex items-center"
                        >
                          <CheckCircleIcon className="h-5 w-5 text-gold-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approach */}
                  <div>
                    <h4 className="text-xl font-display font-semibold text-white mb-4">
                      Our Approach:
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {area.approach}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Corporate Practice */}
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
              Why Choose Kapoor & Associates
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experienced legal representation with proven Delhi High Court expertise and commitment to client success across all areas of law.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ScaleIcon,
                title: 'Delhi High Court Expertise',
                description: '30+ years of combined experience representing clients across all areas of law before Delhi High Court.'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Comprehensive Practice',
                description: 'Full-service legal representation covering family law, property disputes, civil & criminal litigation, and commercial matters.'
              },
              {
                icon: UserGroupIcon,
                title: 'Client-Focused Approach',
                description: 'Personalized legal strategies tailored to individual, family, and business needs with compassionate advocacy.'
              },
              {
                icon: DocumentTextIcon,
                title: 'Proven Track Record',
                description: 'Successful representation across diverse legal matters with consistent favorable outcomes for clients.'
              },
              {
                icon: BriefcaseIcon,
                title: 'Practical Solutions',
                description: 'Realistic legal advice that considers both legal requirements and practical implications for clients.'
              },
              {
                icon: BuildingOfficeIcon,
                title: 'Professional Excellence',
                description: 'Unwavering commitment to professional ethics and Bar Council compliance standards in all matters.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-6 text-center group hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-gold-500 group-hover:to-gold-600 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Need Expert Legal Counsel?
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Schedule a confidential consultation to discuss your legal requirements 
              with our experienced advocates specializing in Delhi High Court practice.
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
                className="btn-primary text-lg px-8 py-4 group"
              >
                Schedule Legal Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/high-court-practice"
                className="btn-secondary text-lg px-8 py-4"
              >
                Delhi High Court Practice
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PracticeAreas;