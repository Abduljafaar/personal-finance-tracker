package com.finance.service;

import com.finance.dto.BudgetDTO;
import com.finance.entity.Budget;
import com.finance.entity.User;
import com.finance.repository.BudgetRepository;
import com.finance.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserService userService;
    
    public List<BudgetDTO> getUserBudgets() {
        User user = userService.getCurrentUser();
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();
        
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        
        return budgets.stream().map(budget -> {
            BudgetDTO dto = new BudgetDTO();
            dto.setId(budget.getId());
            dto.setCategory(budget.getCategory());
            dto.setMonthlyLimit(budget.getMonthlyLimit());
            dto.setMonth(budget.getMonth());
            dto.setYear(budget.getYear());
            
            Double spent = transactionRepository.getTotalExpenseByCategoryAndMonth(
                    user, budget.getCategory(), month, year
            );
            dto.setSpent(spent != null ? spent : 0.0);
            dto.setOverBudget(dto.getSpent() > budget.getMonthlyLimit());
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Transactional
    public Budget createBudget(Budget budget) {
        User user = userService.getCurrentUser();
        budget.setUser(user);
        
        Budget existingBudget = budgetRepository
                .findByUserAndCategoryAndMonthAndYear(user, budget.getCategory(), budget.getMonth(), budget.getYear())
                .orElse(null);
        
        if (existingBudget != null) {
            existingBudget.setMonthlyLimit(budget.getMonthlyLimit());
            return budgetRepository.save(existingBudget);
        }
        
        return budgetRepository.save(budget);
    }
    
    @Transactional
    public void deleteBudget(Long id) {
        User user = userService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this budget");
        }
        
        budgetRepository.delete(budget);
    }
    
    public BudgetDTO getBudgetAlerts() {
        List<BudgetDTO> budgets = getUserBudgets();
        for (BudgetDTO budget : budgets) {
            if (budget.getOverBudget()) {
                return budget;
            }
        }
        return null;
    }
}