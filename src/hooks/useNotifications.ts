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

            const localKey = `liberta_notifications_${user.id}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
                return JSON.parse(stored);
            }

            // Initial Mock
            const mock: Notification[] = [
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
            ];
            localStorage.setItem(localKey, JSON.stringify(mock));
            return mock;
        },
        enabled: !!user,
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            if (!user) return id;
            const localKey = `liberta_notifications_${user.id}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
                const arr: Notification[] = JSON.parse(stored);
                const updated = arr.map(n => n.id === id ? { ...n, read: true } : n);
                localStorage.setItem(localKey, JSON.stringify(updated));
            }
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
