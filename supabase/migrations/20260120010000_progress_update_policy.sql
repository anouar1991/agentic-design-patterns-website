-- Add missing UPDATE policy for progress table
-- The upsert operation needs UPDATE permission when a row already exists

CREATE POLICY "Users update own progress" ON progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
