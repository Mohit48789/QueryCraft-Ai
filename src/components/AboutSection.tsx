import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Code, Users, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  isDarkMode: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced natural language processing converts your ideas into optimized SQL queries instantly.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate complex queries in seconds with our high-performance AI engine powered by Google Gemini.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays private. API keys are stored locally and queries are processed securely.'
    },
    {
      icon: Code,
      title: 'Multi-Database Support',
      description: 'Works with MySQL, PostgreSQL, SQLite, and SQL Server with optimized syntax for each.'
    },
    {
      icon: Users,
      title: 'Developer Friendly',
      description: 'Built by developers, for developers. Clean interface with detailed explanations and warnings.'
    },
    {
      icon: Sparkles,
      title: 'Smart Suggestions',
      description: 'Get intelligent recommendations and performance tips to improve your SQL queries.'
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About QueryCraft AI
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Transform the way you write SQL with our intelligent AI assistant. 
            No more struggling with complex syntax or spending hours debugging queries. 
            Simply describe what you want in plain English, and watch as our AI creates 
            optimized, production-ready SQL code instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl backdrop-blur-md border transition-colors ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-white/60 border-gray-200 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
              </div>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-2xl backdrop-blur-md border ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20' 
              : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
          }`}
        >
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose QueryCraft AI?
            </h3>
            <p className={`text-lg mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Whether you're a beginner learning SQL or an experienced developer looking to boost productivity, 
              our AI-powered tool adapts to your needs and helps you write better queries faster.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  10x
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Faster Query Development
                </p>
              </div>
              <div>
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  95%
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Query Accuracy Rate
                </p>
              </div>
              <div>
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  Free
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No Hidden Costs
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
