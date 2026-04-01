package com.NeoBank.service;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.AccountEnquiryDto;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.CreditDebitRequest;
import com.NeoBank.dto.LoginDto;

import com.NeoBank.dto.RegisterDto;
import com.NeoBank.dto.ResetPasswordDto;
import com.NeoBank.dto.TransferDto;
import com.NeoBank.dto.ValidatePinDto;
@Service
public interface UserService {
	public ApplicationResponse register(RegisterDto dto);
	public ApplicationResponse login(LoginDto dto);
	public ApplicationResponse profile(String emailId);
	public ApplicationResponse resetPin(ResetPasswordDto dto);
	public ApplicationResponse checkBalance(AccountEnquiryDto  accountEnquiryDto);
	public ApplicationResponse transferMoney(TransferDto dto);
	public ApplicationResponse validatePin(ValidatePinDto dto);
	public ApplicationResponse debitAccount(CreditDebitRequest creditDebitRequest);
	public ApplicationResponse creditAccount(CreditDebitRequest creditDebitRequest);
	public boolean validatePin(String pin,String accountNumber);
	public  ApplicationResponse userLoan(String accountNumber);
	public ApplicationResponse getAllUser();
	public ApplicationResponse getUserByAccountNumber(String accountNumber);
	public ApplicationResponse payEmi(String accountNumber);
	public ApplicationResponse getLoanByRefrenceNumber(String refrenceNumber);
	public ApplicationResponse getUserLoanHistory(String accountNumber);
	//public ApplicationResponse payLoanEmi()
	
}
