/**
 * Pluggy Connect integration
 * Pluggy é a principal plataforma de Open Finance do Brasil
 * Sandbox: grátis | Produção: ~R$0.50/conexão/mês
 * Docs: https://docs.pluggy.ai
 */

// Pluggy Connect Widget URL
const PLUGGY_CONNECT_URL = 'https://connect.pluggy.ai';

export interface PluggyConfig {
    clientId: string;
    connectToken?: string;
}

// Bancos brasileiros suportados pelo Pluggy
export const SUPPORTED_BANKS = [
    { name: 'Nubank', code: '260', logo: '💜', color: 'bg-purple-600' },
    { name: 'Itaú', code: '341', logo: '🟠', color: 'bg-orange-500' },
    { name: 'Bradesco', code: '237', logo: '🔴', color: 'bg-red-600' },
    { name: 'Banco do Brasil', code: '001', logo: '🟡', color: 'bg-yellow-500' },
    { name: 'Santander', code: '033', logo: '🔴', color: 'bg-red-500' },
    { name: 'Caixa', code: '104', logo: '🔵', color: 'bg-blue-600' },
    { name: 'Inter', code: '077', logo: '🟠', color: 'bg-orange-400' },
    { name: 'C6 Bank', code: '336', logo: '⬛', color: 'bg-gray-800' },
    { name: 'BTG Pactual', code: '208', logo: '🔵', color: 'bg-blue-800' },
    { name: 'XP Investimentos', code: '102', logo: '⬛', color: 'bg-gray-900' },
    { name: 'Rico', code: '322', logo: '🟠', color: 'bg-orange-600' },
    { name: 'Neon', code: '655', logo: '🔵', color: 'bg-cyan-500' },
    { name: 'PagBank', code: '290', logo: '🟢', color: 'bg-green-500' },
    { name: 'Mercado Pago', code: '323', logo: '🔵', color: 'bg-blue-400' },
    { name: 'Outro', code: '000', logo: '🏦', color: 'bg-slate-500' },
];

/**
 * Abre o Pluggy Connect Widget para conectar uma conta bancária.
 * Requer VITE_PLUGGY_CLIENT_ID configurado.
 * 
 * Fluxo:
 * 1. Frontend abre o widget Pluggy Connect
 * 2. Usuário autentica no banco
 * 3. Pluggy retorna um itemId
 * 4. Backend (Edge Function) usa itemId para buscar transações
 */
export function openPluggyConnect(clientId: string, onSuccess: (itemId: string) => void) {
    const width = 400;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
        `${PLUGGY_CONNECT_URL}?clientId=${clientId}`,
        'pluggy-connect',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    // Listen for message from Pluggy Connect
    const handler = (event: MessageEvent) => {
        if (event.origin === PLUGGY_CONNECT_URL || event.data?.type === 'pluggy-connect') {
            if (event.data?.itemId) {
                onSuccess(event.data.itemId);
                popup?.close();
                window.removeEventListener('message', handler);
            }
        }
    };
    window.addEventListener('message', handler);

    return popup;
}

export function getPluggyClientId(): string {
    return import.meta.env.VITE_PLUGGY_CLIENT_ID || '';
}

export function isPluggyConfigured(): boolean {
    return !!getPluggyClientId();
}
