import { Flame } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakDisplayProps {
    className?: string;
}

export function StreakDisplay({ className }: StreakDisplayProps) {
    const { profile, isLoading } = useGamification();

    if (isLoading || !profile) return null;

    const streak = profile.current_streak || 0;

    if (streak === 0) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-sm shadow-glow-sm cursor-help animate-in fade-in zoom-in duration-300",
                        className
                    )}>
                        <Flame className={cn(
                            "w-4 h-4 fill-orange-500",
                            streak >= 7 && "animate-pulse"
                        )} />
                        <span>{streak}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs font-semibold">Ofensiva de {streak} dias!</p>
                    <p className="text-[10px] text-muted-foreground">Mantenha seu foco financeiro diário.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
