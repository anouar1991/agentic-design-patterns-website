import { motion } from 'framer-motion';

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700/50 ${className ?? ''}`}
    />
  );
}

export default function PageLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl px-4 py-8"
    >
      {/* Title skeleton */}
      <SkeletonBlock className="mb-4 h-10 w-2/3" />
      {/* Subtitle skeleton */}
      <SkeletonBlock className="mb-8 h-5 w-1/2" />

      {/* Content blocks */}
      <div className="space-y-6">
        <SkeletonBlock className="h-48 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-32" />
        </div>
        <SkeletonBlock className="h-64 w-full" />
      </div>
    </motion.div>
  );
}

export function ChapterLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl px-4 py-8"
    >
      {/* Breadcrumb skeleton */}
      <SkeletonBlock className="mb-6 h-4 w-48" />

      {/* Chapter title */}
      <SkeletonBlock className="mb-3 h-12 w-3/4" />
      <SkeletonBlock className="mb-8 h-5 w-1/2" />

      {/* Tab bar skeleton */}
      <div className="mb-8 flex gap-4">
        <SkeletonBlock className="h-10 w-28" />
        <SkeletonBlock className="h-10 w-28" />
        <SkeletonBlock className="h-10 w-28" />
        <SkeletonBlock className="h-10 w-28" />
      </div>

      {/* Content area */}
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-6 w-5/6" />
        <SkeletonBlock className="h-6 w-4/5" />
        <SkeletonBlock className="h-40 w-full" />
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-6 w-3/4" />
      </div>
    </motion.div>
  );
}
