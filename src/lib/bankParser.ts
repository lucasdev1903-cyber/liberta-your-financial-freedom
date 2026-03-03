/**
 * Parser para arquivos OFX (Open Financial Exchange)
 * Formato padrão exportado por bancos brasileiros (Itaú, Bradesco, BB, etc.)
 */

export interface ParsedTransaction {
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Alimentação': ['restaurante', 'ifood', 'uber eats', 'rappi', 'supermercado', 'mercado', 'padaria', 'açougue', 'hortifruti', 'lanchonete', 'pizza', 'burger', 'mcdonald', 'subway', 'starbucks'],
    'Transporte': ['uber', '99', 'cabify', 'combustível', 'gasolina', 'etanol', 'estacionamento', 'pedágio', 'sem parar', 'onibus', 'metro', 'trem'],
    'Moradia': ['aluguel', 'condomínio', 'iptu', 'luz', 'energia', 'água', 'gas', 'internet', 'telefone', 'celular'],
    'Saúde': ['farmácia', 'drogaria', 'hospital', 'clínica', 'médico', 'dentista', 'plano de saúde', 'unimed', 'amil'],
    'Educação': ['escola', 'faculdade', 'curso', 'livro', 'udemy', 'alura', 'mensalidade'],
    'Lazer': ['cinema', 'teatro', 'netflix', 'spotify', 'disney', 'amazon prime', 'hbo', 'ingresso', 'parque', 'viagem'],
    'Assinatura': ['assinatura', 'subscription', 'mensal', 'plano', 'premium'],
    'Compras': ['magazine', 'americanas', 'amazon', 'mercadolivre', 'shopee', 'aliexpress', 'shein', 'loja', 'shopping'],
    'Salário': ['salário', 'salario', 'pagamento', 'holerite', 'folha'],
    'Transferência': ['pix', 'ted', 'doc', 'transferência', 'transferencia'],
};

function autoCategory(description: string): string {
    const desc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => desc.includes(kw))) return category;
    }
    return 'Outros';
}

export function parseOFX(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];

    // Extract transactions block
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match;

    while ((match = stmtTrnRegex.exec(content)) !== null) {
        const block = match[1];

        const getField = (field: string): string => {
            const regex = new RegExp(`<${field}>([^<\\n]+)`, 'i');
            const m = block.match(regex);
            return m ? m[1].trim() : '';
        };

        const dateStr = getField('DTPOSTED');
        const amount = parseFloat(getField('TRNAMT').replace(',', '.'));
        const description = getField('MEMO') || getField('NAME') || 'Transação';

        // Parse OFX date format: YYYYMMDD or YYYYMMDDHHMMSS
        let date = '';
        if (dateStr.length >= 8) {
            date = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
        }

        if (date && !isNaN(amount)) {
            transactions.push({
                date,
                description,
                amount: Math.abs(amount),
                type: amount >= 0 ? 'income' : 'expense',
                category: autoCategory(description),
            });
        }
    }

    return transactions;
}

export function parseCSV(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n').filter(l => l.trim());

    if (lines.length < 2) return [];

    // Try to detect header
    const header = lines[0].toLowerCase();
    const separator = header.includes(';') ? ';' : ',';
    const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));

    // Find column indices
    const dateIdx = headers.findIndex(h => h.includes('data') || h.includes('date'));
    const descIdx = headers.findIndex(h => h.includes('descri') || h.includes('histórico') || h.includes('historico') || h.includes('memo') || h.includes('lançamento'));
    const amountIdx = headers.findIndex(h => h.includes('valor') || h.includes('amount') || h.includes('quantia'));

    if (dateIdx === -1 || amountIdx === -1) {
        // If can't detect, try basic format: date, description, amount
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(separator).map(c => c.trim().replace(/"/g, ''));
            if (cols.length >= 2) {
                const dateStr = cols[0];
                const description = cols.length >= 3 ? cols[1] : 'Transação';
                const amountStr = cols[cols.length - 1].replace(/[R$\s.]/g, '').replace(',', '.');
                const amount = parseFloat(amountStr);

                if (!isNaN(amount) && dateStr) {
                    // Parse BR date format DD/MM/YYYY
                    const parts = dateStr.split('/');
                    const date = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;

                    transactions.push({
                        date,
                        description,
                        amount: Math.abs(amount),
                        type: amount >= 0 ? 'income' : 'expense',
                        category: autoCategory(description),
                    });
                }
            }
        }
        return transactions;
    }

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(separator).map(c => c.trim().replace(/"/g, ''));
        if (cols.length <= Math.max(dateIdx, amountIdx)) continue;

        const dateStr = cols[dateIdx];
        const description = descIdx >= 0 ? cols[descIdx] : 'Transação';
        const amountStr = cols[amountIdx].replace(/[R$\s.]/g, '').replace(',', '.');
        const amount = parseFloat(amountStr);

        if (!isNaN(amount) && dateStr) {
            const parts = dateStr.split('/');
            const date = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;

            transactions.push({
                date,
                description,
                amount: Math.abs(amount),
                type: amount >= 0 ? 'income' : 'expense',
                category: autoCategory(description),
            });
        }
    }

    return transactions;
}
