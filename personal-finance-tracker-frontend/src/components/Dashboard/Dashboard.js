import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';
import API from '../../api/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff6b6b', '#feca57'];

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { refreshKey } = useTransaction();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        totalTransactions: 0
    });

    // Get user name from context or localStorage
    const userName = user?.name || localStorage.getItem('userName') || 'User';

    useEffect(() => {
        fetchTransactions();
        console.log('🔄 Dashboard refreshing due to transaction change');
    }, [refreshKey]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await API.get('/transactions');
            const data = response.data || [];
            console.log('📊 Dashboard loaded transactions:', data.length);
            setTransactions(data);
            calculateSummary(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSummary = (data) => {
        let totalIncome = 0;
        let totalExpenses = 0;

        data.forEach(t => {
            const type = String(t.type || '').toUpperCase();
            if (type === 'INCOME') {
                totalIncome += Number(t.amount);
            } else if (type === 'EXPENSE') {
                totalExpenses += Number(t.amount);
            }
        });

        setSummary({
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            totalTransactions: data.length
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Expense by Category
    const categoryData = transactions
        .filter(t => {
            const type = String(t.type || '').toUpperCase();
            return type === 'EXPENSE';
        })
        .reduce((acc, t) => {
            const existing = acc.find(item => item.category === t.category);
            if (existing) {
                existing.amount += Number(t.amount);
            } else {
                acc.push({ category: t.category, amount: Number(t.amount) });
            }
            return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount);

    // Income by Category
    const incomeCategoryData = transactions
        .filter(t => {
            const type = String(t.type || '').toUpperCase();
            return type === 'INCOME';
        })
        .reduce((acc, t) => {
            const existing = acc.find(item => item.category === t.category);
            if (existing) {
                existing.amount += Number(t.amount);
            } else {
                acc.push({ category: t.category, amount: Number(t.amount) });
            }
            return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount);

    // Monthly data for bar chart
    const monthlyData = transactions.reduce((acc, t) => {
        const month = t.date ? t.date.substring(0, 7) : '2026-07';
        const existing = acc.find(item => item.month === month);
        const amount = Number(t.amount);
        const type = String(t.type || '').toUpperCase();
        
        if (existing) {
            if (type === 'INCOME') {
                existing.income += amount;
            } else if (type === 'EXPENSE') {
                existing.expense += amount;
            }
        } else {
            acc.push({
                month,
                income: type === 'INCOME' ? amount : 0,
                expense: type === 'EXPENSE' ? amount : 0
            });
        }
        return acc;
    }, []).sort((a, b) => a.month.localeCompare(b.month));

    // Cumulative balance over time
    let runningBalance = 0;
    const balanceOverTime = transactions
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(t => {
            const type = String(t.type || '').toUpperCase();
            const amount = Number(t.amount);
            if (type === 'INCOME') {
                runningBalance += amount;
            } else if (type === 'EXPENSE') {
                runningBalance -= amount;
            }
            return {
                date: t.date,
                balance: runningBalance
            };
        });

    if (loading) {
        return <div style={styles.loading}>Loading dashboard...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Personal Finance Tracker</h1>
                <div>
                    <span style={styles.welcome}>Welcome, {userName}!</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                <h2>Dashboard</h2>

                {/* Summary Cards */}
                <div style={styles.cards}>
                    <div style={styles.card}>
                        <h3>Total Balance</h3>
                        <p style={styles.amount}>${summary.balance.toFixed(2)}</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Total Income</h3>
                        <p style={styles.amount}>${summary.totalIncome.toFixed(2)}</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Total Expenses</h3>
                        <p style={styles.amount}>${summary.totalExpenses.toFixed(2)}</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Transactions</h3>
                        <p style={styles.amount}>{summary.totalTransactions}</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div style={styles.chartsContainer}>

                    {/* 1. Monthly Income vs Expenses - Bar Chart */}
                    <div style={styles.chartBox}>
                        <h3>Monthly Income vs Expenses</h3>
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="#2ecc71" name="Income" />
                                    <Bar dataKey="expense" fill="#e74c3c" name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>No data to display</p>
                        )}
                    </div>

                    {/* 2. Balance Over Time - Area Chart */}
                    <div style={styles.chartBox}>
                        <h3>Balance Over Time</h3>
                        {balanceOverTime.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={balanceOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="balance" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>No data to display</p>
                        )}
                    </div>

                    {/* 3. Expense by Category - Pie Chart */}
                    <div style={styles.chartBox}>
                        <h3>Expenses by Category</h3>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ category, amount }) => `${category}: $${amount.toFixed(2)}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>No expense data to display</p>
                        )}
                    </div>

                    {/* 4. Income by Category - Pie Chart */}
                    <div style={styles.chartBox}>
                        <h3>Income by Category</h3>
                        {incomeCategoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={incomeCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ category, amount }) => `${category}: $${amount.toFixed(2)}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {incomeCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>No income data to display</p>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div style={styles.recentTransactions}>
                    <h3>Recent Transactions</h3>
                    {transactions.length === 0 ? (
                        <p>No transactions yet. Add one!</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 5).map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.date}</td>
                                        <td>{t.description}</td>
                                        <td>{t.category}</td>
                                        <td style={{ color: t.type === 'INCOME' ? '#2ecc71' : '#e74c3c' }}>
                                            {t.type === 'INCOME' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: t.type === 'INCOME' ? '#d4edda' : '#f8d7da',
                                                color: t.type === 'INCOME' ? '#155724' : '#721c24',
                                                padding: '2px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {t.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f0f2f5',
    },
    header: {
        background: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    welcome: {
        marginRight: '20px',
        fontWeight: 'bold',
    },
    logoutBtn: {
        padding: '8px 20px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    content: {
        padding: '40px',
    },
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '20px',
        marginBottom: '40px',
    },
    card: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    amount: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#667eea',
    },
    chartsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px',
    },
    chartBox: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    recentTransactions: {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#888',
    },
    noData: {
        textAlign: 'center',
        color: '#888',
        padding: '30px',
    },
};

export default Dashboard;