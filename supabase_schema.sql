-- ============================================================
-- DSA TRACKER - SUPABASE DATABASE SCHEMA
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- TABLE 1: Problem Progress (solved + starred per user)
CREATE TABLE IF NOT EXISTS problem_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  is_solved BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- TABLE 2: Problem Solutions (code per user per problem)
CREATE TABLE IF NOT EXISTS problem_solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  code TEXT DEFAULT '',
  language TEXT DEFAULT 'python',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- TABLE 3: Problem Notes (notes per user per problem)
CREATE TABLE IF NOT EXISTS problem_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - users can only see their own data
-- ============================================================

ALTER TABLE problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_notes ENABLE ROW LEVEL SECURITY;

-- Policies for problem_progress
CREATE POLICY "Users can view own progress"
  ON problem_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON problem_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON problem_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON problem_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for problem_solutions
CREATE POLICY "Users can view own solutions"
  ON problem_solutions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own solutions"
  ON problem_solutions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own solutions"
  ON problem_solutions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own solutions"
  ON problem_solutions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for problem_notes
CREATE POLICY "Users can view own notes"
  ON problem_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON problem_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON problem_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON problem_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Auto-update updated_at timestamp trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_problem_progress_updated_at
  BEFORE UPDATE ON problem_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_problem_solutions_updated_at
  BEFORE UPDATE ON problem_solutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_problem_notes_updated_at
  BEFORE UPDATE ON problem_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
