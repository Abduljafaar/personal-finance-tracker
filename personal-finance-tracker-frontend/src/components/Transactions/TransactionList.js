import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { useTransaction } from '../../context/TransactionContext';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        description: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE'
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const { refreshTransactions } = useTransaction();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const response = await API.get('/transactions');
            setTransactions(response.data || []);
            console.log('📊 Transactions loaded:', response.data?.length || 0);
        } catch (error) {
            console.error('Error loading transactions:', error);
            showMessage('Failed to load transactions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/transactions/${editingId}`, form);
                showMessage('Transaction updated successfully!', 'success');
                setEditingId(null);
            } else {
                await API.post('/transactions', form);
                showMessage('Transaction added successfully!', 'success');
            }
            
            setForm({
                description: '',
                category: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'EXPENSE'
            });
            
            await loadTransactions();
            refreshTransactions(); // 🔄 Notify dashboard
            
            // ✅ AUTO REDIRECT TO DASHBOARD AFTER 1 SECOND
            console.log('🔄 Transaction added, redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            showMessage('Failed to save transaction', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        
        try {
            await API.delete(`/transactions/${id}`);
            showMessage('Transaction deleted successfully!', 'success');
            await loadTransactions();
            refreshTransactions(); // 🔄 Notify dashboard
            
            // ✅ AUTO REDIRECT TO DASHBOARD AFTER 1 SECOND
            console.log('🔄 Transaction deleted, redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
            
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showMessage('Failed to delete transaction', 'error');
        }
    };

    const handleEdit = (transaction) => {
        setForm({
            description: transaction.description,
            category: transaction.category,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type
        });
        setEditingId(transaction.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({
            description: '',
            category: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            type: 'EXPENSE'
        });
    };

    if (loading) {
        return <div style={styles.loading}>Loading transactions...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Transactions</h2>
            
            {message && (
                <div style={messageType === 'success' ? styles.success : styles.error}>
                    {message}
                    <button onClick={() => setMessage('')} style={styles.closeBtn}>×</button>
                </div>
            )}
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    style={styles.input}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                    style={styles.input}
                    required
                    step="0.01"
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    style={styles.input}
                    required
                />
                <select
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    style={styles.input}
                >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
                <button type="submit" style={editingId ? styles.updateBtn : styles.submitBtn}>
                    {editingId ? 'Update' : 'Add'} Transaction
                </button>
                {editingId && (
                    <button type="button" onClick={cancelEdit} style={styles.cancelBtn}>
                        Cancel
                    </button>
                )}
            </form>

            <div style={styles.transactionList}>
                <h3>All Transactions ({transactions.length})</h3>
                {transactions.length === 0 ? (
                    <p style={styles.noTransactions}>No transactions yet. Add one above!</p>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} style={styles.transactionItem}>
                            <div style={styles.transactionInfo}>
                                <span style={styles.transactionDesc}>{t.description}</span>
                                <span style={styles.transactionCategory}>{t.category}</span>
                                <span style={styles.transactionDate}>{t.date}</span>
                                <span style={{
                                    ...styles.transactionAmount,
                                    color: t.type === 'INCOME' ? '#2ecc71' : '#e74c3c'
                                }}>
                                    {t.type === 'INCOME' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                </span>
                                <span style={{
                                    ...styles.transactionType,
                                    background: t.type === 'INCOME' ? '#d4edda' : '#f8d7da',
                                    color: t.type === 'INCOME' ? '#155724' : '#721c24'
                                }}>
                                    {t.type}
                                </span>
                            </div>
                            <div style={styles.transactionActions}>
                                <button onClick={() => handleEdit(t)} style={styles.editBtn}>Edit</button>
                                <button onClick={() => handleDelete(t.id)} style={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        color: '#333',
        marginBottom: '20px',
        borderBottom: '2px solid #667eea',
        paddingBottom: '10px',
    },
    form: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto auto',
        gap: '10px',
        marginBottom: '20px',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
    },
    submitBtn: {
        padding: '10px 20px',
        background: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    updateBtn: {
        padding: '10px 20px',
        background: '#f39c12',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#95a5a6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    transactionList: {
        marginTop: '20px',
    },
    transactionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 15px',
        borderBottom: '1px solid #eee',
        background: 'white',
        borderRadius: '4px',
        marginBottom: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    transactionInfo: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    transactionDesc: {
        fontWeight: 'bold',
        minWidth: '120px',
    },
    transactionCategory: {
        color: '#666',
        minWidth: '80px',
    },
    transactionDate: {
        color: '#888',
        minWidth: '100px',
    },
    transactionAmount: {
        fontWeight: 'bold',
        minWidth: '80px',
        fontSize: '16px',
    },
    transactionType: {
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    transactionActions: {
        display: 'flex',
        gap: '8px',
    },
    editBtn: {
        padding: '5px 15px',
        background: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '5px 15px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#888',
    },
    noTransactions: {
        textAlign: 'center',
        color: '#888',
        padding: '30px',
    },
    success: {
        background: '#d4edda',
        color: '#155724',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    error: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'inherit',
    },
};

export default TransactionList;