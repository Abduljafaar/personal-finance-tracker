package com.finance.repository;

import com.finance.entity.Budget;
import com.finance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthAndYear(User user, int month, int year);
    
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, String category, int month, int year);
}