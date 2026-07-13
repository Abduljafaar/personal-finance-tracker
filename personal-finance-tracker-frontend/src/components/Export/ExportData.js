import React, { useState } from 'react';
import API from '../../api/api';
import { showToast } from '../Common/ToastContainer';
import LoadingSpinner from '../Common/LoadingSpinner';

const ExportData = () => {
    const [loading, setLoading] = useState(false);

    const exportCSV = async () => {
        setLoading(true);
        try {
            const response = await API.get('/transactions');
            const data = response.data;
            
            if (data.length === 0) {
                showToast.warning('No transactions to export!');
                setLoading(false);
                return;
            }

            // Create CSV header
            let csv = 'Date,Description,Category,Amount,Type\n';
            
            // Add data rows
            data.forEach(t => {
                csv += `${t.date},${t.description},${t.category},${t.amount},${t.type}\n`;
            });
            
            // Create and download file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast.success(`Exported ${data.length} transactions successfully!`);
        } catch (error) {
            console.error('Export failed:', error);
            showToast.error('Failed to export transactions');
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = async () => {
        showToast.info('PDF export coming soon!');
    };

    if (loading) {
        return <LoadingSpinner size={50} />;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📤 Export Data</h2>
            <p style={styles.subtitle}>Download your transaction data in various formats</p>
            
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>CSV Export</h3>
                <p style={styles.cardDesc}>Download all your transactions as a CSV file.</p>
                <p style={styles.cardDesc}><small>Compatible with Excel, Google Sheets, and other spreadsheet applications.</small></p>
                <button onClick={exportCSV} style={styles.csvBtn}>
                    📥 Download CSV
                </button>
            </div>

            <div style={styles.card}>
                <h3 style={styles.cardTitle}>PDF Export</h3>
                <p style={styles.cardDesc}>Download a formatted PDF report of your transactions.</p>
                <p style={styles.cardDesc}><small>Professional format suitable for printing or sharing.</small></p>
                <button onClick={exportPDF} style={styles.pdfBtn}>
                    📄 Download PDF
                </button>
            </div>

            <div style={styles.infoBox}>
                <p>📊 <strong>Tip:</strong> Use CSV export to analyze your spending in Excel or Google Sheets.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    title: {
        fontSize: '32px',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        color: '#666',
        fontSize: '16px',
        marginBottom: '30px',
    },
    card: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    cardTitle: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    cardDesc: {
        color: '#666',
        margin: '5px 0',
    },
    csvBtn: {
        padding: '12px 30px',
        background: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '15px',
        fontWeight: 'bold',
    },
    pdfBtn: {
        padding: '12px 30px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '15px',
        fontWeight: 'bold',
    },
    infoBox: {
        background: '#e8f4fd',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #3498db',
        marginTop: '20px',
    },
};

export default ExportData;