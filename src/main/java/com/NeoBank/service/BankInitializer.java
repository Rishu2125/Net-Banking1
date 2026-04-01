package com.NeoBank.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.NeoBank.entities.Bank;
import com.NeoBank.repository.BankRepo;
import com.NeoBank.utils.AdminUtils;
import jakarta.annotation.PostConstruct;

@Component
public class BankInitializer {

  
	
	@Autowired
	BankRepo bankRepo;


	@PostConstruct
	public void createBank()
	{
		if(bankRepo.findByBankEmailId("neobank@gmail.com")==null)
		{
			Bank neoBank=new Bank();
			neoBank.setBalance(BigDecimal.valueOf(100000000));
			neoBank.setBankEmailId("neobank@gmail.com");
			neoBank.setBankAccountNumber(AdminUtils.BANK_ACCOUNT_NUMBER);
			bankRepo.save(neoBank);
		}
		
		
	}

}
