-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  aeo_score INTEGER,
  citation_readiness INTEGER,
  question_coverage INTEGER,
  structural_score INTEGER,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can create analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own analyses
CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid()::text = user_id);
