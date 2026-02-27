import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qtfzeaxfeohcviagifud.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZnplYXhmZW9oY3ZpYWdpZnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTkwNTgsImV4cCI6MjA4Nzc3NTA1OH0.DX0szrcp23mLNgcw23rKSujqbWFN7uTTMOWc-aQATjY";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Check your .env file or deployment secrets.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
