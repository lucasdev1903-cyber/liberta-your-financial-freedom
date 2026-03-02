import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export function useProfile() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user) return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const updateProfile = useMutation<any, Error, { full_name?: string; avatar_url?: string }>({
        mutationFn: async (updates: any) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await (supabase
                .from('profiles') as any)
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
            toast({ title: 'Perfil atualizado com sucesso!' });
        },
        onError: (error: any) => {
            toast({
                title: 'Erro ao atualizar perfil',
                description: error.message,
                variant: 'destructive'
            });
        }
    });

    const uploadAvatar = async (file: File) => {
        if (!user) return;
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            // 1. Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update profile
            await updateProfile.mutateAsync({ avatar_url: publicUrl });

            return publicUrl;
        } catch (error: any) {
            toast({
                title: 'Erro no upload',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return {
        profile,
        isLoading,
        isUploading,
        updateProfile,
        uploadAvatar
    };
}
