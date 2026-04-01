package com.NeoBank.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
@Service
public interface BankService {
	public ApplicationResponse creditBank(BigDecimal amount);
	public ApplicationResponse debitBank(BigDecimal amount);

}
