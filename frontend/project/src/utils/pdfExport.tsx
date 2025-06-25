import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SpendingAnalytics } from '../types';

export const exportSpendingToPDF = (spendingData: SpendingAnalytics) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Spending Analytics Report', 20, 30);

    // Add generation date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 20, 45);

    // Add summary section
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Spending Summary', 20, 65);

    // Create table data
    const tableData = [
        ['Period', 'Amount'],
        ['Daily', `$${spendingData.daily.toLocaleString()}`],
        ['Weekly', `$${spendingData.weekly.toLocaleString()}`],
        ['Monthly', `$${spendingData.monthly.toLocaleString()}`],
        ['Yearly', `$${spendingData.yearly.toLocaleString()}`]
    ];

    // Add table
    autoTable(doc, {
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: 75,
        theme: 'grid',
        headStyles: {
            fillColor: [59, 130, 246], // Blue color
            textColor: 255,
            fontStyle: 'bold'
        },
        bodyStyles: {
            textColor: 40
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252] // Light gray
        },
        margin: { left: 20, right: 20 }
    });

    // Add insights section
    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Key Insights', 20, finalY + 20);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);

    // Calculate insights
    const insights = [
        `• Total yearly spending: $${spendingData.yearly.toLocaleString()}`,
        `• Average monthly spending: $${(spendingData.yearly / 12).toLocaleString()}`,
        `• Current month progress: $${spendingData.monthly.toLocaleString()}`,
        `• Weekly average: $${spendingData.weekly.toLocaleString()}`
    ];

    let yPosition = finalY + 35;
    insights.forEach((insight) => {
        doc.text(insight, 25, yPosition);
        yPosition += 10;
    });

    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Inventory Management System - Spending Report', 20, pageHeight - 20);
    doc.text(`Page 1 of 1`, doc.internal.pageSize.width - 40, pageHeight - 20);

    // Save the PDF
    const fileName = `spending-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};