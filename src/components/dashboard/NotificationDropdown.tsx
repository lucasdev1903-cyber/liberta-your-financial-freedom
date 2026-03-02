import { Bell, Check, Info, AlertTriangle, XCircle, Clock } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead } = useNotifications();

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <Check className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors group">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-[10px] animate-in zoom-in duration-300">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 glass border-border/50 shadow-2xl overflow-hidden mt-2">
                <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
                    <h3 className="font-bold">Notificações</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {unreadCount} novas
                    </Badge>
                </div>
                <ScrollArea className="h-80">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-border/30">
                            {notifications.map((n) => (
                                <DropdownMenuItem
                                    key={n.id}
                                    className={cn(
                                        "p-4 cursor-pointer focus:bg-primary/5 transition-colors flex gap-3 items-start",
                                        !n.read && "bg-primary/[0.02]"
                                    )}
                                    onClick={() => markAsRead.mutate(n.id)}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                        n.type === 'success' && "bg-green-500/10",
                                        n.type === 'warning' && "bg-yellow-500/10",
                                        n.type === 'error' && "bg-red-500/10",
                                        n.type === 'info' && "bg-blue-500/10",
                                    )}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm font-semibold truncate", !n.read && "text-foreground")}>
                                                {n.title}
                                            </p>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 pt-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                            <p className="text-sm text-muted-foreground italic">Nenhuma notificação por enquanto.</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 bg-secondary/5 border-t border-border/50 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary transition-colors">
                        Ver histórico completo
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
