package com.NeoBank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NeoBank.entities.Bank;
@Repository
public interface BankRepo extends JpaRepository<Bank, Long> {
Bank	findByBankEmailId(String emailId);
Bank findByBankAccountNumber(String accountNumber);

}
