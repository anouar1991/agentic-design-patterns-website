import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import type { LearningObjective } from '../data/types';

interface LearningObjectivesProps {
  objectives: LearningObjective[];
  chapterColor: string;
}

export default function LearningObjectives({ objectives, chapterColor }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold text-dark-50 mb-4">
        <Target className="w-5 h-5 text-primary-400" />
        Learning Objectives
      </h3>
      <p className="text-sm text-dark-400 mb-4">
        After completing this chapter, you will be able to:
      </p>
      <ul className="space-y-3">
        {objectives.map((objective, index) => (
          <motion.li
            key={objective.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            className="flex items-start gap-3"
          >
            <CheckCircle2
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: chapterColor }}
            />
            <span className="text-dark-200">{objective.text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
