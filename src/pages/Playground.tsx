import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Code, Play, Sparkles, Wrench, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Playground() {
  const { t } = useTranslation();

  const features = [
    { icon: Play, key: 'liveCode' },
    { icon: Wrench, key: 'templates' },
    { icon: Zap, key: 'visualization' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-dark-700 text-sm mb-6"
          >
            <Code className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300">{t('playground.badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-dark-50 mb-4"
          >
            {t('playground.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-dark-400 max-w-2xl mx-auto"
          >
            {t('playground.subtitle')}
          </motion.p>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-400" />
          </div>

          <h2 className="text-2xl font-bold text-dark-50 mb-4">
            {t('playground.comingSoon')}
          </h2>

          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            {t('playground.comingSoonDesc')}
          </p>

          {/* Features preview */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 rounded-xl bg-dark-800/50">
                  <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-dark-50 mb-1">
                    {t(`playground.features.${feature.key}.title`)}
                  </div>
                  <div className="text-xs text-dark-400">
                    {t(`playground.features.${feature.key}.description`)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chapters"
              className="px-6 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-50 font-medium hover:bg-dark-700 transition-colors"
            >
              {t('playground.browseChapters')}
            </Link>
            <a
              href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              {t('playground.viewOnGithub')}
            </a>
          </div>
        </motion.div>

        {/* Notebook Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-dark-50 mb-4 text-center">
            {t('playground.meantime')}
          </h3>
          <div className="glass rounded-xl p-6">
            <pre className="text-sm text-dark-300 overflow-x-auto" dir="ltr">
              <code>{`# Clone the repository
git clone https://github.com/sarwarbeing-ai/Agentic_Design_Patterns.git

# Navigate to notebooks
cd Agentic_Design_Patterns/notebooks

# Start Jupyter
jupyter notebook`}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
