import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutGrid, CalendarRange, Infinity, RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function DashboardFilters() {
    const { filters, setFilters, setQuickRange } = useDashboardFilters();

    const handlePrevMonth = () => {
        if (filters.month === 0) {
            setFilters({ ...filters, month: 11, year: filters.year - 1 });
        } else {
            setFilters({ ...filters, month: filters.month - 1, year: filters.year });
        }
    };

    const handleNextMonth = () => {
        if (filters.month === 11) {
            setFilters({ ...filters, month: 0, year: filters.year + 1 });
        } else {
            setFilters({ ...filters, month: filters.month + 1, year: filters.year });
        }
    };

    const isCurrentMonth = () => {
        const now = new Date();
        return filters.mode === 'month' && filters.month === now.getMonth() && filters.year === now.getFullYear();
    };

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-strong rounded-[2rem] p-3 border-border/40">
                {/* Mode Selector */}
                <div className="flex p-1 bg-secondary/30 rounded-2xl w-full md:w-auto">
                    {[
                        { id: 'month', label: 'Mensal', icon: CalendarIcon },
                        { id: 'range', label: 'Período', icon: CalendarRange },
                        { id: 'all', label: 'Tudo', icon: Infinity },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setFilters({ ...filters, mode: mode.id as any })}
                            className={cn(
                                "flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all flex-1 md:flex-none",
                                filters.mode === mode.id
                                    ? "bg-primary text-primary-foreground shadow-glow-sm scale-[1.02]"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <mode.icon className="w-3.5 h-3.5" />
                            {mode.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {filters.mode === 'month' && (
                        <motion.div
                            key="month-nav"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-2 px-2"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="rounded-xl hover:bg-secondary/50 h-10 w-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="min-w-[140px] text-center">
                                <p className="text-sm font-black tracking-tight">{MONTHS[filters.month]} {filters.year}</p>
                                {!isCurrentMonth() && (
                                    <button
                                        onClick={() => {
                                            const now = new Date();
                                            setFilters({ ...filters, mode: 'month', month: now.getMonth(), year: now.getFullYear() });
                                        }}
                                        className="text-[10px] uppercase font-bold text-primary hover:underline"
                                    >
                                        Ir para hoje
                                    </button>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNextMonth}
                                className="rounded-xl hover:bg-secondary/50 h-10 w-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {filters.mode === 'range' && (
                        <motion.div
                            key="range-nav"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-2 flex-wrap"
                        >
                            <div className="flex items-center gap-1 p-1 bg-secondary/20 rounded-xl">
                                {[
                                    { id: '30d', label: '30 Dias' },
                                    { id: '90d', label: '90 Dias' },
                                    { id: 'ytd', label: 'Este Ano' },
                                ].map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => setQuickRange(range.id as any)}
                                        className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 ml-2">
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={filters.startDate || ''}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        className="bg-secondary/30 border-none rounded-lg px-2 py-1 text-[11px] font-bold focus:ring-1 ring-primary/50 text-foreground"
                                    />
                                </div>
                                <span className="text-muted-foreground text-xs">até</span>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={filters.endDate || ''}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                        className="bg-secondary/30 border-none rounded-lg px-2 py-1 text-[11px] font-bold focus:ring-1 ring-primary/50 text-foreground"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {filters.mode === 'all' && (
                        <motion.div
                            key="all-nav"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-6 py-2 rounded-2xl bg-primary/5 border border-primary/10"
                        >
                            <p className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                                <Clock className="w-3.5 h-3.5" />
                                Visão Completa Ativada
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
