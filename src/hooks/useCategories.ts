import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { Category, CategoryInsert } from '@/lib/database.types';

export function useCategories() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['categories', user?.id],
        queryFn: async (): Promise<Category[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', user.id)
                .order('name');
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    const addCategory = useMutation({
        mutationFn: async (category: Omit<CategoryInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('categories')
                .insert({ ...category, user_id: user.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const incomeCategories = (query.data || []).filter((c) => c.type === 'income');
    const expenseCategories = (query.data || []).filter((c) => c.type === 'expense');

    return {
        categories: query.data || [],
        incomeCategories,
        expenseCategories,
        isLoading: query.isLoading,
        error: query.error,
        addCategory,
        deleteCategory,
    };
}
