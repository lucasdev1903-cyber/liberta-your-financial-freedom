import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function DashboardFilters() {
    const { filters, setFilters } = useDashboardFilters();

    const handlePrevMonth = () => {
        if (filters.month === 0) {
            setFilters({ month: 11, year: filters.year - 1 });
        } else {
            setFilters({ month: filters.month - 1, year: filters.year });
        }
    };

    const handleNextMonth = () => {
        if (filters.month === 11) {
            setFilters({ month: 0, year: filters.year + 1 });
        } else {
            setFilters({ month: filters.month + 1, year: filters.year });
        }
    };

    const isCurrentMonth = () => {
        const now = new Date();
        return filters.month === now.getMonth() && filters.year === now.getFullYear();
    };

    const resetToCurrent = () => {
        const now = new Date();
        setFilters({ month: now.getMonth(), year: now.getFullYear() });
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 glass-subtle p-4 rounded-2xl border-border/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Período de Análise</h2>
                    <p className="text-lg font-black">{MONTHS[filters.month]} {filters.year}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="rounded-xl border-border/50 hover:bg-secondary/50"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="hidden sm:flex items-center gap-1 mx-2">
                    {!isCurrentMonth() && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetToCurrent}
                            className="text-[10px] font-bold uppercase tracking-tighter text-primary hover:text-primary/80"
                        >
                            Ir para hoje
                        </Button>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextMonth}
                    className="rounded-xl border-border/50 hover:bg-secondary/50"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
