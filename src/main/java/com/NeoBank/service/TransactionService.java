package com.NeoBank.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.TransactionDto;
import com.NeoBank.entities.Transaction;

@Service
public interface TransactionService {
	void saveTransaction(TransactionDto dto);
	public ApplicationResponse monthlyAnalytics(String accountNumber);
	ApplicationResponse getAllTransactions(int page,int size);

}
