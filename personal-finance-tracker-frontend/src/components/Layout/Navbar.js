import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get user info from context or localStorage
    const userName = user?.name || localStorage.getItem('userName') || 'User';
    const userEmail = user?.email || localStorage.getItem('userEmail') || '';

    console.log('Navbar - User:', user);
    console.log('Navbar - UserName:', userName);

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/dashboard" style={styles.logo}>
                    💰 Finance Tracker
                </Link>
                <div style={styles.links}>
                    <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                    <Link to="/transactions" style={styles.link}>Transactions</Link>
                    <Link to="/budgets" style={styles.link}>Budgets</Link>
                    <Link to="/export" style={styles.link}>Export</Link>
                    <span style={styles.user}>Welcome, {userName}!</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: '#2c3e50',
        padding: '15px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
    },
    logo: {
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        transition: 'background 0.3s',
    },
    user: {
        color: '#ecf0f1',
        marginRight: '10px',
    },
    logoutBtn: {
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Navbar;