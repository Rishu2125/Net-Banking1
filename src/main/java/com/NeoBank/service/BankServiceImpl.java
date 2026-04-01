package com.NeoBank.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.entities.Bank;
import com.NeoBank.repository.BankRepo;

import jakarta.transaction.Transactional;
@Service
public class BankServiceImpl implements BankService {
@Autowired
BankRepo bankRepo;
	@Override
	@Transactional
	public ApplicationResponse creditBank(BigDecimal amount) {
		Bank bank = bankRepo.findById(1L)
		        .orElseThrow(() ->
		                new RuntimeException("Bank not found"));
		bank.setBalance(bank.getBalance().add(amount));
		return ApplicationResponse.builder()
			.responseCode("000")
			.responseCode("Money credited")
				
				.build();
	}

	@Override
	public ApplicationResponse debitBank(BigDecimal amount) {
		Bank bank = bankRepo.findById(1L)
		        .orElseThrow(() ->
		                new RuntimeException("Bank not found"));
		bank.setBalance(bank.getBalance().subtract(amount));
		return ApplicationResponse.builder()
				.responseCode("001")
				.responseCode("Money  debited")
					
					.build();
	}

}
