export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    role: 'admin' | 'user';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'admin' | 'user';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'admin' | 'user';
                    updated_at?: string;
                };
            };
            categories: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: 'income' | 'expense';
                    icon: string | null;
                    color: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type: 'income' | 'expense';
                    icon?: string | null;
                    color?: string | null;
                    created_at?: string;
                };
                Update: {
                    name?: string;
                    type?: 'income' | 'expense';
                    icon?: string | null;
                    color?: string | null;
                };
            };
            transactions: {
                Row: {
                    id: string;
                    user_id: string;
                    category_id: string | null;
                    description: string;
                    amount: number;
                    type: 'income' | 'expense';
                    date: string;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    category_id?: string | null;
                    description: string;
                    amount: number;
                    type: 'income' | 'expense';
                    date: string;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    category_id?: string | null;
                    description?: string;
                    amount?: number;
                    type?: 'income' | 'expense';
                    date?: string;
                    notes?: string | null;
                };
            };
            goals: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    target_amount: number;
                    current_amount: number;
                    deadline: string | null;
                    icon: string | null;
                    color: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    target_amount: number;
                    current_amount?: number;
                    deadline?: string | null;
                    icon?: string | null;
                    color?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    title?: string;
                    description?: string | null;
                    target_amount?: number;
                    current_amount?: number;
                    deadline?: string | null;
                    icon?: string | null;
                    color?: string | null;
                    updated_at?: string;
                };
            };
            ai_messages: {
                Row: {
                    id: string;
                    user_id: string;
                    role: 'assistant' | 'user';
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    role: 'assistant' | 'user';
                    content: string;
                    created_at?: string;
                };
                Update: {
                    content?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];

export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
export type GoalInsert = Database['public']['Tables']['goals']['Insert'];
export type GoalUpdate = Database['public']['Tables']['goals']['Update'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type AiMessage = Database['public']['Tables']['ai_messages']['Row'];
export type AiMessageInsert = Database['public']['Tables']['ai_messages']['Insert'];
