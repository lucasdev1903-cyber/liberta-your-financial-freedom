import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qtfzeaxfeohcviagifud.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "public-anon-key-placeholder";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Check your .env file or deployment secrets.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
