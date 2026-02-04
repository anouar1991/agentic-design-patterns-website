import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Cpu,
  MessageSquare,
  Wrench,
  Brain,
  GitBranch,
  Zap,
  CheckCircle,
  AlertCircle,
  Code,
  Terminal
} from 'lucide-react';

export default function Introduction() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useDocumentMeta({
    title: 'Introduction to AI Agents',
    description: 'Learn the fundamentals of AI agents and agentic design patterns. Understand what makes AI agents different from simple LLMs and why design patterns matter.',
    ogType: 'article',
    keywords: 'AI agents, introduction, LLM, agentic systems, design patterns fundamentals',
  });

  // Get translated arrays
  const simpleLLMPoints = t('introduction.simpleLLMPoints', { returnObjects: true }) as string[];
  const aiAgentPoints = t('introduction.aiAgentPoints', { returnObjects: true }) as string[];
  const shouldKnowPoints = t('introduction.shouldKnowPoints', { returnObjects: true }) as string[];
  const needPoints = t('introduction.needPoints', { returnObjects: true }) as string[];

  const terms = [
    { key: 'llm', icon: Brain },
    { key: 'prompt', icon: MessageSquare },
    { key: 'tool', icon: Wrench },
    { key: 'chain', icon: GitBranch },
    { key: 'token', icon: Zap }
  ];

  const frameworks = [
    { key: 'langchain', color: '#3b82f6' },
    { key: 'langgraph', color: '#8b5cf6' },
    { key: 'adk', color: '#22c55e' },
    { key: 'crewai', color: '#f59e0b' }
  ];

  const patternExamples = [
    { key: 'promptChaining' },
    { key: 'routing' },
    { key: 'toolUse' },
    { key: 'memory' },
    { key: 'multiAgent' }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-dark-700 text-sm mb-6">
            <BookOpen className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300">{t('introduction.badge')}</span>
          </div>

          <h1 className="text-4xl font-bold text-dark-50 mb-4">
            {t('introduction.title')}
          </h1>

          <p className="text-lg text-dark-400 max-w-2xl mx-auto">
            {t('introduction.subtitle')}
          </p>
        </motion.div>

        {/* Section 1: What is an AI Agent */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center gap-3">
              <Brain className="w-7 h-7 text-primary-400" />
              {t('introduction.whatIsAgent')}
            </h2>

            <div className="space-y-4 text-dark-300">
              <p dangerouslySetInnerHTML={{ __html: t('introduction.whatIsAgentDesc') }} />

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-dark-800/50 rounded-xl p-6">
                  <h3 className="text-dark-50 font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    {t('introduction.simpleLLM')}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {simpleLLMPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-dark-500">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-6 border border-primary-500/30">
                  <h3 className="text-dark-50 font-semibold mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary-400" />
                    {t('introduction.aiAgent')}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {aiAgentPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p>
                {t('introduction.analogy')}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Key Terminology */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-accent-400" />
              {t('introduction.keyTerms')}
            </h2>

            <div className="space-y-4">
              {terms.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-dark-800/50 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-dark-50 font-semibold">{t(`introduction.terms.${item.key}.term`)}</h3>
                    <p className="text-dark-400 text-sm mt-1">{t(`introduction.terms.${item.key}.definition`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section 3: Frameworks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center gap-3">
              <Code className="w-7 h-7 text-green-400" />
              {t('introduction.frameworksTitle')}
            </h2>

            <p className="text-dark-300 mb-6">
              {t('introduction.frameworksDesc')}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.key}
                  className={`p-4 bg-dark-800/50 rounded-xl ${isRTL ? 'border-r-4' : 'border-l-4'}`}
                  style={{ borderColor: framework.color }}
                >
                  <h3 className="text-dark-50 font-semibold">{t(`introduction.frameworks.${framework.key}.name`)}</h3>
                  <p className="text-dark-400 text-sm mt-1">{t(`introduction.frameworks.${framework.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section 4: Prerequisites */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center gap-3">
              <Terminal className="w-7 h-7 text-amber-400" />
              {t('introduction.prerequisites')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-dark-50 font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {t('introduction.whatYouShouldKnow')}
                </h3>
                <ul className="space-y-2 text-dark-300 text-sm">
                  {shouldKnowPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-dark-50 font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  {t('introduction.whatYoullNeed')}
                </h3>
                <ul className="space-y-2 text-dark-300 text-sm">
                  {needPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.1 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              {t('introduction.quickStart')}
            </h2>

            <p className="text-dark-300 mb-6">
              {t('introduction.quickStartDesc')}
            </p>

            <div className="space-y-4" dir="ltr">
              {/* Step 1: Install */}
              <div className="bg-dark-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500 text-dark-50 flex items-center justify-center text-xs font-bold">1</span>
                  {t('introduction.step1')}
                </div>
                <pre className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 text-sm">pip install langchain langchain-openai</code>
                </pre>
              </div>

              {/* Step 2: Set API Key */}
              <div className="bg-dark-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500 text-dark-50 flex items-center justify-center text-xs font-bold">2</span>
                  {t('introduction.step2')}{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                    platform.openai.com
                  </a>)
                </div>
                <pre className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 text-sm">export OPENAI_API_KEY="sk-your-key-here"</code>
                </pre>
              </div>

              {/* Step 3: Run Code */}
              <div className="bg-dark-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500 text-dark-50 flex items-center justify-center text-xs font-bold">3</span>
                  {t('introduction.step3')}
                </div>
                <pre className="bg-dark-900 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{`from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Create the LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Create a simple chain
prompt = PromptTemplate.from_template(
    "You are a helpful assistant. Answer: {question}"
)
chain = LLMChain(llm=llm, prompt=prompt)

# Run it!
result = chain.invoke({"question": "What is an AI agent?"})
print(result["text"])`}</code>
                </pre>
              </div>

              {/* Step 4: Run */}
              <div className="bg-dark-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-dark-50 flex items-center justify-center text-xs font-bold">4</span>
                  {t('introduction.step4')}
                </div>
                <pre className="bg-dark-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 text-sm">python agent.py</code>
                </pre>
              </div>
            </div>

            <p className="text-dark-400 mt-6 text-sm">
              {t('introduction.quickStartSuccess')}
            </p>
          </div>
        </motion.section>

        {/* Section 6: Why Design Patterns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-6">
              {t('introduction.whyPatterns')}
            </h2>

            <p className="text-dark-300 mb-6">
              {t('introduction.whyPatternsDesc')}
            </p>

            <div className="space-y-3">
              {patternExamples.map((item) => (
                <div key={item.key} className="flex items-center gap-4 text-sm">
                  <span className="text-primary-400 font-medium w-36">{t(`introduction.patternExamples.${item.key}.pattern`)}</span>
                  <span className="text-dark-500">→</span>
                  <span className="text-dark-300">{t(`introduction.patternExamples.${item.key}.problem`)}</span>
                </div>
              ))}
            </div>

            <p className="text-dark-300 mt-6">
              {t('introduction.patternsSummary')}
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-50 mb-4">
              {t('introduction.readyToStart')}
            </h2>
            <p className="text-dark-400 mb-6">
              {t('introduction.readyToStartDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chapter/1"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {t('introduction.startChapter1')}
                <ArrowIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/learning-path"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-dark-800 border border-dark-700 text-dark-50 font-semibold hover:bg-dark-700 transition-colors"
              >
                {t('introduction.viewLearningPath')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
