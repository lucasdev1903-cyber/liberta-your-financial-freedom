import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
}

export function useNotifications() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async (): Promise<Notification[]> => {
            if (!user) return [];

            // For now, we'll use a mix of real data (if table exists) and smart mocks
            // In a real app, you'd have a 'notifications' table
            // We'll try to fetch from 'notifications' but fallback to mock for this demo
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return data as Notification[];
            } catch (e) {
                // Mock notifications for "Premium" experience if table doesn't exist yet
                return [
                    {
                        id: '1',
                        title: 'Bem-vindo ao Liberta!',
                        message: 'Comece organizando suas finanças hoje mesmo.',
                        type: 'success',
                        read: false,
                        created_at: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Dica do Mês',
                        message: 'Você sabia que economizar 10% do seu salário pode mudar seu futuro?',
                        type: 'info',
                        read: true,
                        created_at: new Date(Date.now() - 86400000).toISOString()
                    }
                ] as Notification[];
            }
        },
        enabled: !!user,
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            // Update in DB if we had the table
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        }
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead
    };
}
