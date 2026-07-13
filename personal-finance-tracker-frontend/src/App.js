import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import BudgetManager from './components/Budget/BudgetManager';
import Navbar from './components/Layout/Navbar';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
    const { user } = useAuth();
    return (
        <>
            {user && <Navbar />}
            {children}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <TransactionProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute>
                                    <AppLayout>
                                        <Dashboard />
                                    </AppLayout>
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/transactions" 
                            element={
                                <PrivateRoute>
                                    <AppLayout>
                                        <TransactionList />
                                    </AppLayout>
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/budgets" 
                            element={
                                <PrivateRoute>
                                    <AppLayout>
                                        <BudgetManager />
                                    </AppLayout>
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </BrowserRouter>
            </TransactionProvider>
        </AuthProvider>
    );
}

export default App;