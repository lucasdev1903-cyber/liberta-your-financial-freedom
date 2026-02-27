import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { Badge, BadgeInsert, Profile } from '@/lib/database.types';
import { toast } from '@/hooks/use-toast';

export function useGamification() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch user profile for streaks
    const profileQuery = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async (): Promise<Profile | null> => {
            if (!user) return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) throw error;
            return data as Profile;
        },
        enabled: !!user,
    });

    // Fetch user badges
    const badgesQuery = useQuery({
        queryKey: ['user-badges', user?.id],
        queryFn: async (): Promise<Badge[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('user_badges')
                .select('*')
                .eq('user_id', user.id);
            if (error) throw error;
            return data as Badge[];
        },
        enabled: !!user,
    });

    // Update streak logic
    const updateActivity = useMutation({
        mutationFn: async () => {
            if (!user || !profileQuery.data) return;

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
            const profile = profileQuery.data;

            if (profile.last_activity_date === today) return; // Already updated today

            let newStreak = 1;
            const lastActivity = profile.last_activity_date ? new Date(profile.last_activity_date) : null;

            if (lastActivity) {
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                const lastActivityDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());

                if (lastActivityDate.getTime() === yesterday.getTime()) {
                    newStreak = (profile.current_streak || 0) + 1;
                }
            }

            const longestStreak = Math.max(profile.longest_streak || 0, newStreak);

            const { error } = await supabase
                .from('profiles')
                .update({
                    current_streak: newStreak,
                    longest_streak: longestStreak,
                    last_activity_date: today,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', user.id);

            if (error) throw error;

            // Check for streak milestones
            if (newStreak === 3) await checkAndAwardBadge('streak_3');
            if (newStreak === 7) await checkAndAwardBadge('streak_7');
            if (newStreak === 30) await checkAndAwardBadge('streak_30');

            return { newStreak };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });

    const checkAndAwardBadge = async (badgeType: string) => {
        if (!user) return;

        // Check if user already has this badge
        const { data: existing } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', user.id)
            .eq('badge_type', badgeType)
            .single();

        if (existing) return;

        const { error } = await supabase
            .from('user_badges')
            .insert({
                user_id: user.id,
                badge_type: badgeType
            } as BadgeInsert);

        if (!error) {
            queryClient.invalidateQueries({ queryKey: ['user-badges', user?.id] });
            toast({
                title: "🏆 Nova Conquista!",
                description: `Você desbloqueou a medalha: ${badgeType.replace('_', ' ')}`,
            });
        }
    };

    return {
        profile: profileQuery.data,
        badges: badgesQuery.data || [],
        isLoading: profileQuery.isLoading || badgesQuery.isLoading,
        updateActivity,
        awardBadge: checkAndAwardBadge
    };
}
