import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { Goal, GoalInsert, GoalUpdate } from '@/lib/database.types';

export function useGoals() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['goals', user?.id],
        queryFn: async (): Promise<Goal[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    const addGoal = useMutation({
        mutationFn: async (goal: Omit<GoalInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('goals')
                .insert({ ...goal, user_id: user.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
    });

    const updateGoal = useMutation({
        mutationFn: async ({ id, ...updates }: GoalUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('goals')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
    });

    const deleteGoal = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('goals').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
    });

    return {
        goals: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
        addGoal,
        updateGoal,
        deleteGoal,
    };
}
