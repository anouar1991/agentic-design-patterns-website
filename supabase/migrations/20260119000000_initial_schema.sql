-- Initial schema for Agentic Design Patterns Learning Platform
-- Adds user profiles, progress tracking, and leaderboard support

-- Profiles table (auto-created on user signup)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  country_code CHAR(2),  -- ISO 3166-1 alpha-2
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_country ON profiles(country_code);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL CHECK (chapter_id BETWEEN 1 AND 21),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_progress_user ON progress(user_id);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW leaderboard_cache AS
SELECT
  p.id AS user_id,
  p.display_name,
  p.avatar_url,
  p.country_code,
  COUNT(pr.chapter_id) AS completed_chapters,
  ROUND((COUNT(pr.chapter_id)::NUMERIC / 21) * 100, 1) AS completion_percentage,
  RANK() OVER (ORDER BY COUNT(pr.chapter_id) DESC) AS global_rank
FROM profiles p
LEFT JOIN progress pr ON p.id = pr.user_id
GROUP BY p.id;

CREATE INDEX idx_leaderboard_rank ON leaderboard_cache(global_rank);
CREATE INDEX idx_leaderboard_country ON leaderboard_cache(country_code);

-- Function to refresh leaderboard cache
CREATE OR REPLACE FUNCTION public.refresh_leaderboard_cache()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to refresh leaderboard on progress changes
CREATE TRIGGER on_progress_change
  AFTER INSERT OR DELETE ON progress
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_leaderboard_cache();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Profiles: readable by all for leaderboard, writable by owner
CREATE POLICY "Profiles visible for leaderboard" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Progress: visible only to owner, insertable/deletable by owner
CREATE POLICY "Users view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own progress" ON progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create unique index for concurrent refresh of materialized view
CREATE UNIQUE INDEX idx_leaderboard_cache_user_id ON leaderboard_cache(user_id);
