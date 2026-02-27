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
            assets: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: 'cash' | 'investment' | 'property' | 'vehicle' | 'other';
                    value: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type: 'cash' | 'investment' | 'property' | 'vehicle' | 'other';
                    value: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    type?: 'cash' | 'investment' | 'property' | 'vehicle' | 'other';
                    value?: number;
                    updated_at?: string;
                };
            };
            liabilities: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    type: 'credit_card' | 'loan' | 'mortgage' | 'other';
                    value: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    type: 'credit_card' | 'loan' | 'mortgage' | 'other';
                    value: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    type?: 'credit_card' | 'loan' | 'mortgage' | 'other';
                    value?: number;
                    updated_at?: string;
                };
            };
            net_worth_history: {
                Row: {
                    id: string;
                    user_id: string;
                    total_assets: number;
                    total_liabilities: number;
                    net_worth: number;
                    snapshot_date: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    total_assets: number;
                    total_liabilities: number;
                    net_worth: number;
                    snapshot_date: string;
                    created_at?: string;
                };
                Update: {
                    total_assets?: number;
                    total_liabilities?: number;
                    net_worth?: number;
                    snapshot_date?: string;
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

export type Asset = Database['public']['Tables']['assets']['Row'];
export type Liability = Database['public']['Tables']['liabilities']['Row'];
export type NetWorthHistory = Database['public']['Tables']['net_worth_history']['Row'];

export type AssetInsert = Database['public']['Tables']['assets']['Insert'];
export type AssetUpdate = Database['public']['Tables']['assets']['Update'];
export type LiabilityInsert = Database['public']['Tables']['liabilities']['Insert'];
export type LiabilityUpdate = Database['public']['Tables']['liabilities']['Update'];
