package com.NeoBank.service;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.LoanRequestDto;
@Service
public interface LoanService {
  public ApplicationResponse createLoan(LoanRequestDto loanRequestDto);
  public ApplicationResponse deductEmiFromAll();
  

}
