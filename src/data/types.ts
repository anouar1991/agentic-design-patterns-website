export interface Notebook {
  filename: string;
  topic: string;
  type: 'notebook' | 'python' | 'code';
  size?: number;
  path?: string;
}

export interface Chapter {
  num?: number;
  id?: string;
  title: string;
  icon: string;
  color?: string;
  notebooks?: Notebook[];
  pages?: number;
  start?: number;
  end?: number;
  filename?: string;
  actual_pages?: number;
  type?: string;
}

export interface Part {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  chapters: Chapter[];
}

export interface LearningPhase {
  phase: number;
  name: string;
  description: string;
  chapters: number[];
  color: string;
}

export interface BookMeta {
  title: string;
  subtitle: string;
  author: string;
  totalChapters: number;
  totalAppendices: number;
  totalPages: number;
}

export interface WebsiteData {
  meta: BookMeta;
  parts: Part[];
  notebooks: Record<string, Notebook[]>;
  learningPath: LearningPhase[];
}

// Chapter details for individual pages
export interface ChapterDetail {
  number: number;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  partId: string;
  partName: string;
  description: string;
  keyConceptsIntro: string;
  keyConcepts: string[];
  codeExamples: CodeExample[];
  diagramNodes?: DiagramNode[];
  diagramEdges?: DiagramEdge[];
  nextChapter?: number;
  prevChapter?: number;
  notebooks: Notebook[];
  learningObjectives: LearningObjective[];
  quiz?: ChapterQuiz;
  // Enhanced chapter fields
  enhancedCodeExamples?: EnhancedCodeExample[];  // Progressive tutorial content
  conceptsIntroduced?: string[];                  // Concept IDs first introduced here
  readingMeta?: ReadingMeta;                      // Reading time and difficulty
  narrativeIntro?: string;                        // Longer narrative introduction
  // Interactive tutorial (replaces codeExamples for tutorial-style learning)
  tutorial?: TutorialSection[];
}

// Legacy code example format (for backward compatibility)
export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

// Reading progress metadata
export interface ReadingMeta {
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: number[];       // Chapter numbers that should be completed first
}

// Node role determines visual styling and interaction behavior
export type NodeRole = 'input' | 'process' | 'output' | 'decision' | 'handler' | 'tool' | 'agent' | 'memory';

export interface DiagramNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    // Enhanced fields for interactive learning
    role?: NodeRole;
    detailedHint?: string;           // Rich explanation shown on click
    codeExampleIndex?: number;       // Links to code example by index
    codeHighlightLines?: number[]; // Lines to highlight in code examples
    conceptIds?: string[];           // Concepts introduced at this node
  };
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, string | number>;
  // Enhanced edge properties
  description?: string;              // Explanation of data flow
}

// Progressive content section types
export type ContentSectionType = 'narrative' | 'code' | 'explanation' | 'tip' | 'warning' | 'exercise';

export interface ContentSection {
  id?: string;                    // Optional section identifier
  type?: ContentSectionType;      // Section type (optional for code-focused sections)
  title?: string;                 // Section title
  description?: string;           // Section description
  content?: string;               // Main content (for narrative sections)
  code?: string;                  // Code content (for code sections)
  explanation?: string;           // Explanation text
  language?: string;              // For code sections
  conceptsIntroduced?: string[];  // Concept IDs introduced in this section
  concepts?: string[];            // Alternative concepts field
  highlightLines?: number[];      // Lines to highlight in code sections
}

// Enhanced code example with progressive sections
export interface EnhancedCodeExample {
  id: string;
  title: string;
  description?: string;           // Optional description for the example
  sections: ContentSection[];
  diagramNodeIds?: string[];      // Nodes this example relates to
}

// Concept definition for first-appearance tracking
export interface ConceptDefinition {
  id: string;
  name: string;
  shortDescription: string;
  fullExplanation: string;
  relatedConcepts?: string[];
  externalLinks?: { label: string; url: string }[];
}

// Interactive Tutorial Types
export interface TutorialStep {
  id?: string;                   // Optional step identifier
  type: 'narrative' | 'code' | 'tip' | 'warning' | 'exercise' | 'checkpoint';
  content: string;
  language?: string;
  /** Which term IDs to highlight as clickable in this code block */
  highlightTerms?: string[];
  /** Optional title for the step */
  title?: string;
}

export interface TutorialSection {
  id: string;
  title: string;
  description?: string;
  steps: TutorialStep[];
}

// Progress tracking
export interface QuizScore {
  score: number;
  totalQuestions: number;
  passed: boolean;
  timestamp: string;
}

export interface CourseProgress {
  completedChapters: number[];
  quizScores: Record<number, QuizScore>;
  lastVisited?: { chapterId: number; section?: string; timestamp: string };
  lastUpdated: string;
}

// Learning objectives
export interface LearningObjective {
  id: string;
  text: string;
}

// Quiz system
export interface QuizOption {
  id: string;
  text: string;
}

// Question type discriminator – defaults to 'multiple-choice' for backward compat
export type QuizQuestionType = 'multiple-choice' | 'true-false' | 'ordering';

export interface QuizQuestion {
  id: string;
  question: string;
  /** Defaults to 'multiple-choice' when omitted (backward compatible) */
  type?: QuizQuestionType;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  /** For 'ordering' questions: the correct order of option IDs */
  correctOrder?: string[];
  /** Optional code snippet shown alongside the question */
  codeSnippet?: string;
}

export interface ChapterQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
}
