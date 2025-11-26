-- ============================================
-- ADDITIONAL TABLES FOR WRITING DRAFTS AND DOCUMENTS
-- Run this if you already have the game_progress table
-- ============================================

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

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for new tables
CREATE TRIGGER update_writing_drafts_updated_at
  BEFORE UPDATE ON writing_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crypt_documents_updated_at
  BEFORE UPDATE ON crypt_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
