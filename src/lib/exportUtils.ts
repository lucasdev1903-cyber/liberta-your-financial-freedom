import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Transaction {
    description: string;
    amount: number;
    type: string;
    date: string;
    categories?: { name: string } | null;
}

const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function exportToExcel(transactions: Transaction[], filename = 'liberta-relatorio') {
    const data = transactions.map((t) => ({
        Data: t.date,
        Descrição: t.description,
        Categoria: (t.categories as any)?.name || 'Sem categoria',
        Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
        Valor: Number(t.amount),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
}

export function exportToPDF(
    transactions: Transaction[],
    stats: { totalIncome: number; totalExpenses: number; balance: number },
    filename = 'liberta-relatorio'
) {
    const doc = new jsPDF();
    const now = new Date();
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Header
    doc.setFontSize(22);
    doc.setTextColor(230, 100, 40);
    doc.text('Liberta', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('Sua liberdade financeira', 14, 26);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(30);
    doc.text(`Relatório Financeiro — ${monthNames[now.getMonth()]} ${now.getFullYear()}`, 14, 40);

    // Summary cards
    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94);
    doc.text(`Receitas: ${formatCurrency(stats.totalIncome)}`, 14, 54);
    doc.setTextColor(239, 68, 68);
    doc.text(`Despesas: ${formatCurrency(stats.totalExpenses)}`, 80, 54);
    doc.setTextColor(30);
    doc.text(`Saldo: ${formatCurrency(stats.balance)}`, 150, 54);

    // Transactions table
    const tableData = transactions.map((t) => [
        t.date,
        t.description,
        (t.categories as any)?.name || '-',
        t.type === 'income' ? 'Receita' : 'Despesa',
        formatCurrency(Number(t.amount)),
    ]);

    autoTable(doc, {
        startY: 64,
        head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [230, 100, 40], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text(`Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')} — Liberta Finanças`, 14, pageHeight - 10);

    doc.save(`${filename}.pdf`);
}
