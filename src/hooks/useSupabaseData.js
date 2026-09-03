import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useSupabaseData - replaces useLocalStorage for cloud-persisted DSA tracking.
 * Loads all user data in bulk on login, then does targeted upserts on changes.
 */
export function useSupabaseData(userId) {
  // Mirrors the old localStorage structure
  const [solvedState, setSolvedState] = useState({});
  const [starredState, setStarredState] = useState({});
  const [notesState, setNotesState] = useState({});
  const [codeState, setCodeState] = useState({});
  const [loading, setLoading] = useState(false);

  // ─── Load all user data when userId changes ───────────────────────────────
  useEffect(() => {
    if (!userId) {
      // Clear data on logout
      setSolvedState({});
      setStarredState({});
      setNotesState({});
      setCodeState({});
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      try {
        const [progressRes, solutionsRes, notesRes] = await Promise.all([
          supabase.from('problem_progress').select('problem_id, is_solved, is_starred').eq('user_id', userId),
          supabase.from('problem_solutions').select('problem_id, code').eq('user_id', userId),
          supabase.from('problem_notes').select('problem_id, notes').eq('user_id', userId),
        ]);

        // Build solved/starred state maps
        if (progressRes.data) {
          const solved = {};
          const starred = {};
          progressRes.data.forEach(row => {
            solved[row.problem_id] = row.is_solved;
            starred[row.problem_id] = row.is_starred;
          });
          setSolvedState(solved);
          setStarredState(starred);
        }

        // Build code state map
        if (solutionsRes.data) {
          const code = {};
          solutionsRes.data.forEach(row => { code[row.problem_id] = row.code; });
          setCodeState(code);
        }

        // Build notes state map
        if (notesRes.data) {
          const notes = {};
          notesRes.data.forEach(row => { notes[row.problem_id] = row.notes; });
          setNotesState(notes);
        }
      } catch (err) {
        console.error('Failed to load user data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [userId]);

  // ─── Toggle Solved ────────────────────────────────────────────────────────
  const toggleSolved = useCallback(async (problemId) => {
    const newValue = !solvedState[problemId];
    setSolvedState(prev => ({ ...prev, [problemId]: newValue }));

    if (!userId) return;
    await supabase.from('problem_progress').upsert(
      { user_id: userId, problem_id: problemId, is_solved: newValue, is_starred: starredState[problemId] || false },
      { onConflict: 'user_id,problem_id' }
    );
  }, [userId, solvedState, starredState]);

  // ─── Toggle Starred ───────────────────────────────────────────────────────
  const toggleStarred = useCallback(async (problemId) => {
    const newValue = !starredState[problemId];
    setStarredState(prev => ({ ...prev, [problemId]: newValue }));

    if (!userId) return;
    await supabase.from('problem_progress').upsert(
      { user_id: userId, problem_id: problemId, is_solved: solvedState[problemId] || false, is_starred: newValue },
      { onConflict: 'user_id,problem_id' }
    );
  }, [userId, starredState, solvedState]);

  // ─── Save Code Solution ───────────────────────────────────────────────────
  const saveCode = useCallback(async (problemId, code) => {
    setCodeState(prev => ({ ...prev, [problemId]: code }));

    if (!userId) return;
    await supabase.from('problem_solutions').upsert(
      { user_id: userId, problem_id: problemId, code },
      { onConflict: 'user_id,problem_id' }
    );
  }, [userId]);

  // ─── Save Notes ───────────────────────────────────────────────────────────
  const saveNotes = useCallback(async (problemId, notes) => {
    setNotesState(prev => ({ ...prev, [problemId]: notes }));

    if (!userId) return;
    await supabase.from('problem_notes').upsert(
      { user_id: userId, problem_id: problemId, notes },
      { onConflict: 'user_id,problem_id' }
    );
  }, [userId]);

  return {
    solvedState,
    starredState,
    notesState,
    codeState,
    loading,
    toggleSolved,
    toggleStarred,
    saveCode,
    saveNotes,
  };
}
