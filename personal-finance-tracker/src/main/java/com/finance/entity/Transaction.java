package com.finance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {
    
    @NotBlank
    @Size(max = 255)
    private String description;
    
    @NotBlank
    @Size(max = 100)
    private String category;
    
    @NotNull
    @Positive
    private Double amount;
    
    @NotNull
    private LocalDate date;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Getters and Setters
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}