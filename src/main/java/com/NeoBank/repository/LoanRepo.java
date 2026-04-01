package com.NeoBank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NeoBank.entities.Loan;
import com.NeoBank.entities.LoanStatus;


public interface LoanRepo extends JpaRepository<Loan, Long>{
Loan findByLoanRefrenceNumber(String loanRefrenceNumber);
List<Loan> findByUserId(Long userId);
List<Loan> findByUserIdAndStatusNot(Long userId, LoanStatus status);
List<Loan> findByUserIdAndStatus(Long userId, LoanStatus status);

List<Loan> findByStatus(LoanStatus status);

}
