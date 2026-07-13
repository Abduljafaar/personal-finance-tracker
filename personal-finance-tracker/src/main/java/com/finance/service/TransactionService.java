package com.finance.service;

import com.finance.entity.Transaction;
import com.finance.entity.TransactionType;
import com.finance.entity.User;
import com.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserService userService;
    
    public List<Transaction> getUserTransactions() {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserOrderByDateDesc(user);
    }
    
    public Transaction getTransaction(Long id) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to view this transaction");
        }
        return transaction;
    }
    
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        User user = userService.getCurrentUser();
        transaction.setUser(user);
        if (transaction.getType() == null) {
            transaction.setType(TransactionType.EXPENSE);
        }
        return transactionRepository.save(transaction);
    }
    
    @Transactional
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to update this transaction");
        }
        
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setDate(transactionDetails.getDate());
        transaction.setType(transactionDetails.getType());
        
        return transactionRepository.save(transaction);
    }
    
    @Transactional
    public void deleteTransaction(Long id) {
        User user = userService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this transaction");
        }
        
        transactionRepository.delete(transaction);
    }
    
    public List<Transaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentUser();
        return transactionRepository.findByUserAndDateBetween(user, startDate, endDate);
    }
}