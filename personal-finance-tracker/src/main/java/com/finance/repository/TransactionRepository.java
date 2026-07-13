package com.finance.repository;

import com.finance.entity.Transaction;
import com.finance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    
    List<Transaction> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.category = :category AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double getTotalExpenseByCategoryAndMonth(@Param("user") User user, @Param("category") String category, @Param("month") int month, @Param("year") int year);
}