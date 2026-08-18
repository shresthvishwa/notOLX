import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Domain validation helper for Thapar Institute emails (@thapar.edu)
export const isThaparEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith('@thapar.edu');
};

// Google OAuth Sign-In helper with hd (hosted domain) parameter
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase is not configured yet. Using Thapar OAuth sandbox mode.' } };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        hd: 'thapar.edu' // Restrict Google Account Chooser prompt to thapar.edu domain
      }
    }
  });

  return { data, error };
};
