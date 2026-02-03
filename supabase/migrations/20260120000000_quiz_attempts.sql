-- Quiz attempts table for tracking quiz performance
-- Stores each quiz attempt with score and metadata

CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL CHECK (chapter_id BETWEEN 1 AND 21),
  score INTEGER NOT NULL CHECK (score >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  passed BOOLEAN NOT NULL,
  duration_seconds INTEGER, -- Time spent on quiz (optional)
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_chapter ON public.quiz_attempts(chapter_id);
CREATE INDEX idx_quiz_attempts_user_chapter ON public.quiz_attempts(user_id, chapter_id);

-- RLS Policies
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can view their own quiz attempts
CREATE POLICY "Users view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own quiz attempts
CREATE POLICY "Users insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get next attempt number for a user/chapter
CREATE OR REPLACE FUNCTION public.get_next_attempt_number(p_user_id UUID, p_chapter_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO next_num
  FROM public.quiz_attempts
  WHERE user_id = p_user_id AND chapter_id = p_chapter_id;
  RETURN next_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- View for user's best scores per chapter
CREATE OR REPLACE VIEW public.user_best_quiz_scores AS
SELECT DISTINCT ON (user_id, chapter_id)
  user_id,
  chapter_id,
  score,
  total_questions,
  passed,
  attempt_number,
  created_at
FROM public.quiz_attempts
ORDER BY user_id, chapter_id, score DESC, created_at DESC;

-- Grant permissions
GRANT SELECT ON public.user_best_quiz_scores TO authenticated;
