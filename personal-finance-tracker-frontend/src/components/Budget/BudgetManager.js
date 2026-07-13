import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const BudgetManager = () => {
    const [budgets, setBudgets] = useState([]);
    const [form, setForm] = useState({
        category: '',
        monthlyLimit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await API.get('/budgets');
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/budgets', form);
            setForm({
                category: '',
                monthlyLimit: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            });
            fetchBudgets();
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Budget Management</h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Category (e.g., Food)"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    style={styles.input}
                    required
                />
                <input
                    type="number"
                    placeholder="Monthly Limit"
                    value={form.monthlyLimit}
                    onChange={(e) => setForm({...form, monthlyLimit: e.target.value})}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.submitBtn}>Set Budget</button>
            </form>

            <div style={styles.budgetList}>
                {budgets.length === 0 ? (
                    <p>No budgets set yet.</p>
                ) : (
                    budgets.map((b) => (
                        <div key={b.id} style={styles.budgetItem}>
                            <span><strong>{b.category}</strong></span>
                            <span>Limit: ${b.monthlyLimit}</span>
                            <span>Spent: ${b.spent || 0}</span>
                            {b.overBudget && (
                                <span style={styles.alert}>⚠️ Over Budget!</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
    title: { color: '#333', marginBottom: '20px' },
    form: { display: 'flex', gap: '10px', marginBottom: '20px' },
    input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 },
    submitBtn: { padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    budgetList: { marginTop: '20px' },
    budgetItem: { display: 'flex', gap: '20px', padding: '10px', borderBottom: '1px solid #eee' },
    alert: { color: 'red', fontWeight: 'bold' },
};

export default BudgetManager;