package com.NeoBank.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.entities.Transaction;
import com.NeoBank.service.BankStatement;
import com.NeoBank.service.TransactionService;

@RestController
@RequestMapping("/bank-statement")
@RequiredArgsConstructor
public class TransactionController {
@Autowired
    private final BankStatement bankStatement;
    @Autowired
    private TransactionService service;

    @GetMapping("/generate")
    public List<Transaction> generateStatement(
            @RequestParam String accountNumber,
            @RequestParam String startDate,
            @RequestParam String endDate) throws Exception {

        return bankStatement.generateStatement(accountNumber, startDate, endDate);
    }
    
    
    
    
  @GetMapping("/view")
    public ApplicationResponse allTransactions( @RequestParam String  accountNumber,@RequestParam int page,@RequestParam int size)
    {
    	return bankStatement.allTransactions(accountNumber,page,size);
    }
  
  
  
  
  @GetMapping("/monthly-analytics/{accountNumber}")
  public ApplicationResponse getMonthlyAnalytics(@PathVariable String accountNumber)
  {
	  return service.monthlyAnalytics(accountNumber);
  }
  
  
  
  
}