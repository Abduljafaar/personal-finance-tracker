import React, { createContext, useState, useContext } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshTransactions = () => {
        setRefreshKey(prev => prev + 1);
        console.log('🔄 Transaction refresh triggered!');
    };

    return (
        <TransactionContext.Provider value={{ refreshKey, refreshTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};