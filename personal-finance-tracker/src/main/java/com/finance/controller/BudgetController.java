package com.finance.controller;

import com.finance.dto.BudgetDTO;
import com.finance.entity.Budget;
import com.finance.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getUserBudgets());
    }
    
    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.createBudget(budget));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok("Budget deleted successfully");
    }
    
    @GetMapping("/alerts")
    public ResponseEntity<BudgetDTO> getBudgetAlerts() {
        BudgetDTO alert = budgetService.getBudgetAlerts();
        if (alert != null) {
            return ResponseEntity.ok(alert);
        }
        return ResponseEntity.noContent().build();
    }
}