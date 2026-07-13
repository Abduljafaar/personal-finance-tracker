package com.finance.dto;

public class BudgetDTO {
    private Long id;
    private String category;
    private Double monthlyLimit;
    private Double spent;
    private Integer month;
    private Integer year;
    private Boolean overBudget;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(Double monthlyLimit) { this.monthlyLimit = monthlyLimit; }
    public Double getSpent() { return spent; }
    public void setSpent(Double spent) { this.spent = spent; }
    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Boolean getOverBudget() { return overBudget; }
    public void setOverBudget(Boolean overBudget) { this.overBudget = overBudget; }
}