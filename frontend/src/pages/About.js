import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  ScaleIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const About = () => {
  const credentials = [
    {
      icon: AcademicCapIcon,
      title: 'Legal Education',
      description: 'Bachelor of Laws (LL.B.) from prestigious law institutions'
    },
    {
      icon: ScaleIcon,
      title: 'Bar Council Enrollment',
      description: 'Enrolled with Bar Council of Delhi'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Delhi High Court Practice',
      description: 'Decades of combined experience in Delhi High Court proceedings'
    },
    {
      icon: ClockIcon,
      title: 'Experience',
      description: '30+ years of combined legal expertise across all areas of law'
    }
  ];

  const achievements = [
    {
      icon: StarIcon,
      title: 'Delhi High Court Expertise',
      description: '30+ years of combined experience representing clients across all areas of law'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Professional Ethics',
      description: 'Unwavering commitment to Bar Council of India guidelines and professional conduct'
    },
    {
      icon: UserIcon,
      title: 'Client-Centric Approach',
      description: 'Personalized legal strategies tailored to each client\'s unique needs and circumstances'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Our Advocates - Kapoor & Associates | Anuj Kapoor & Kirti Kapoor</title>
        <meta name="description" content="Meet our experienced advocates: Anuj Kapoor (20+ years) and Kirti Kapoor (10+ years) representing clients across all court matters in Delhi High Court practice." />
        <meta name="keywords" content="Anuj Kapoor advocate, Kirti Kapoor advocate, Delhi High Court lawyers, family law experts, property dispute lawyers, civil litigation advocates" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/about" />
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
              Our Legal Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experienced advocates dedicated to providing exceptional legal services across all areas of law
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advocate Profiles */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          {/* Advocate Anuj Kapoor */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-dark p-8 text-center">
                <div className="w-64 h-80 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {/* Professional photograph placeholder - replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <UserIcon className="h-32 w-32 text-white opacity-50" />
                  </div>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Advocate Anuj Kapoor
                </h2>
                <p className="text-gold-400 font-semibold mb-4">
                  Founder & Principal Advocate
                </p>
                <p className="text-gray-300 text-sm">
                  Delhi High Court Practice | 20+ Years Experience
                </p>
              </div>
            </motion.div>

            {/* Profile Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Professional Profile
              </h2>
              
              <div className="mb-8">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  <strong>Advocate Anuj Kapoor is a seasoned legal professional with over 20 years of 
                  experience representing clients across all areas of law before the Delhi High Court.</strong>
                </p>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  His practice encompasses family law, property disputes, civil and criminal litigation, 
                  commercial matters, and legal advisory services. Advocate Kapoor believes in providing 
                  comprehensive legal solutions while maintaining the highest standards of ethical conduct 
                  as prescribed by the Bar Council of India.
                </p>
                
                <p className="text-gray-300 leading-relaxed">
                  With extensive experience in Delhi High Court proceedings, Advocate Kapoor has established 
                  himself as a trusted legal counsel known for his strategic approach, meticulous preparation, 
                  and unwavering commitment to achieving favorable outcomes for his clients across all types of legal matters.
                </p>
              </div>

              {/* Areas of Practice */}
              <div className="mb-8">
                <h3 className="text-xl font-display font-semibold text-white mb-4">
                  Areas of Practice
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Family & Divorce Law',
                    'Property & Land Disputes', 
                    'Civil Litigation',
                    'Criminal Defense',
                    'Commercial Law',
                    'Legal Advisory'
                  ].map((area, index) => (
                    <span
                      key={index}
                      className="bg-gold-500/10 text-gold-400 px-4 py-2 rounded-full text-sm font-medium border border-gold-500/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Advocate Kirti Kapoor */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Profile Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Professional Profile
              </h2>
              
              <div className="mb-8">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  <strong>Advocate Kirti Kapoor is an accomplished legal professional with over 10 years of 
                  experience representing clients across diverse areas of law before the Delhi High Court.</strong>
                </p>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  Her practice covers family law matters, property disputes, civil litigation, consumer protection, 
                  labor disputes, and commercial legal issues. Advocate Kirti Kapoor is committed to providing 
                  personalized legal representation while upholding the highest standards of professional ethics 
                  and client service.
                </p>
                
                <p className="text-gray-300 leading-relaxed">
                  As a core member of Kapoor & Associates, Advocate Kirti Kapoor brings a client-focused approach 
                  to legal practice, combining thorough legal research with compassionate advocacy to ensure 
                  effective representation for individuals, families, and businesses in all types of legal proceedings.
                </p>
              </div>

              {/* Areas of Practice */}
              <div className="mb-8">
                <h3 className="text-xl font-display font-semibold text-white mb-4">
                  Areas of Practice
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Family & Divorce Law',
                    'Property & Land Disputes', 
                    'Civil Litigation',
                    'Consumer Protection',
                    'Labor Disputes',
                    'Commercial Law'
                  ].map((area, index) => (
                    <span
                      key={index}
                      className="bg-gold-500/10 text-gold-400 px-4 py-2 rounded-full text-sm font-medium border border-gold-500/20"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-dark p-8 text-center">
                <div className="w-64 h-80 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {/* Professional photograph placeholder - replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <UserIcon className="h-32 w-32 text-white opacity-50" />
                  </div>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Advocate Kirti Kapoor
                </h2>
                <p className="text-gold-400 font-semibold mb-4">
                  Advocate & Core Partner
                </p>
                <p className="text-gray-300 text-sm">
                  Delhi High Court Practice | 10+ Years Experience
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Credentials */}
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
              Professional Credentials
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Established expertise backed by formal qualifications and extensive Delhi High Court experience across all areas of law.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-dark p-6 text-center group hover:border-gold-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <credential.icon className="h-8 w-8 text-dark-900" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3">
                  {credential.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {credential.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Firm Philosophy */}
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
                Our Approach to Legal Practice
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                At Kapoor & Associates, we believe that exceptional legal service stems from a deep understanding 
                of our clients' needs combined with strategic legal expertise and unwavering ethical standards. 
                Whether representing individuals in family matters or businesses in commercial disputes, we approach 
                every case with equal dedication and professionalism.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-gold-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Client-Centric Focus</h4>
                    <p className="text-gray-400">Every legal matter is approached with the client's interests at heart, ensuring personalized strategies for each case.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-gold-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Ethical Excellence</h4>
                    <p className="text-gray-400">Strict adherence to Bar Council guidelines and professional ethics forms the foundation of our practice.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-gold-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Strategic Precision</h4>
                    <p className="text-gray-400">Meticulous case preparation and strategic thinking ensure optimal outcomes in Delhi High Court proceedings.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid gap-6"
            >
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.title}
                  className="card-dark p-6 group hover:border-gold-500/50 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-4 group-hover:from-gold-500 group-hover:to-gold-600 transition-all duration-300">
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-white mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bar Council Compliance Notice */}
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
              Professional Compliance Notice
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <strong>This website does not seek to advertise or solicit work in any manner as per 
              Bar Council of India rules. Information provided is for general purposes only.</strong>
            </p>
            <p className="text-gray-400 text-sm mt-4">
              All legal services are provided in strict compliance with Bar Council of India guidelines 
              and professional conduct rules.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Experience the Difference of Professional Excellence
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Schedule a consultation to discuss your legal requirements with our experienced advocates.
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
                View Practice Areas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;