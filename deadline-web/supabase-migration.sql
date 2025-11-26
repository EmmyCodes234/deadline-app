-- ============================================
-- GAME PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  level_progress JSONB DEFAULT '{}'::jsonb,
  unlocked_level_ids INTEGER[] DEFAULT ARRAY[1],
  earned_rewards TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_progress_user_id ON game_progress(user_id);

ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress"
  ON game_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- WRITING DRAFTS TABLE (for Reaper mode)
-- ============================================
CREATE TABLE IF NOT EXISTS writing_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  draft_text TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_writing_drafts_user_id ON writing_drafts(user_id);

ALTER TABLE writing_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drafts"
  ON writing_drafts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CRYPT DOCUMENTS TABLE (saved snapshots)
-- ============================================
CREATE TABLE IF NOT EXISTS crypt_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  doc_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, doc_id)
);

CREATE INDEX IF NOT EXISTS idx_crypt_documents_user_id ON crypt_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_crypt_documents_doc_id ON crypt_documents(user_id, doc_id);

ALTER TABLE crypt_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON crypt_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_game_progress_updated_at
  BEFORE UPDATE ON game_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writing_drafts_updated_at
  BEFORE UPDATE ON writing_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crypt_documents_updated_at
  BEFORE UPDATE ON crypt_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
