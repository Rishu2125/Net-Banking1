package com.NeoBank.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.NeoBank.dto.AccountEnquiryDto;
import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.LoanRequestDto;
import com.NeoBank.dto.LoginDto;

import com.NeoBank.dto.RegisterDto;
import com.NeoBank.dto.ResetPasswordDto;
import com.NeoBank.dto.TransferDto;
import com.NeoBank.dto.ValidatePinDto;
import com.NeoBank.service.BankStatement;
import com.NeoBank.service.LoanService;
import com.NeoBank.service.OtpSendAndValidate;
import com.NeoBank.service.UserService;


	
	
	

@RestController
@RequestMapping("/api/user")

public class UserController {
@Autowired
 UserService service;
@Autowired
BankStatement bankStatement;
@Autowired
private OtpSendAndValidate andValidate;
@Autowired
LoanService  loanService;

  
    // register
    @PostMapping("/register")
    public ApplicationResponse register(@RequestBody RegisterDto dto) {
        return service.register(dto);
    }

    // login
    @PostMapping("/login")
    public ApplicationResponse login(@RequestBody LoginDto dto) {
        return service.login(dto);
    }

    // profile
    @GetMapping("/profile")
    public ApplicationResponse profile(@RequestParam String emailId) {
        return service.profile( emailId);
    }

    @PostMapping("/resetPin")
    public ApplicationResponse resetPin(
            @RequestBody ResetPasswordDto dto)
    {

        return service.resetPin(dto);

    }
    
    //check balance
    @PostMapping("/check-balance")
    public ApplicationResponse checkBalance(@RequestBody AccountEnquiryDto accountEnquiryDto)
    {
    	return service.checkBalance(accountEnquiryDto);
    }
    
    
    //transfer
    @PatchMapping("/transfer")
    public ApplicationResponse transfer(@RequestBody TransferDto dto)
    {
    	return service.transferMoney(dto);
    }
    
    

    @PostMapping("/sendOtp")
    public ApplicationResponse sendOtp(
            @RequestBody ResetPasswordDto dto)
    {

        return andValidate.sendOtp(
                dto.getAccountNumber()
        );

    }
    @PostMapping("/verifyOtp")
    public ApplicationResponse verifyOtp(
            @RequestBody ResetPasswordDto dto)
    {

        return andValidate.verifyOtp(dto);

    }
    
    
	@PostMapping("/loan/create")
	public ApplicationResponse createLoan(@RequestBody LoanRequestDto dto)
	{
		
		return loanService.createLoan(dto);
	}
	
	

	
	@GetMapping("/get-user-loan/{accountNumber}")
	public ApplicationResponse getUserLoan(@PathVariable String  accountNumber)
	{
		return service.userLoan(accountNumber);
	}
	
	
	//PAY EMI
	@PutMapping("/pay-emi/{loanRefrenceNumber}")
	public ApplicationResponse payEmi( @PathVariable String loanRefrenceNumber)
	{
		
		return service.payEmi(loanRefrenceNumber);
		
	}
	
	@GetMapping("/get-loan/{refrenceNumber}")
	public ApplicationResponse getUserLoanByRefrenceNumber(@PathVariable String refrenceNumber)
	{
		return service.getLoanByRefrenceNumber(refrenceNumber);
	}
	
	@PostMapping("/validate-pin")
	public ApplicationResponse validatePin(@RequestBody ValidatePinDto dto)
	{
		return service.validatePin(dto);
	}
 
	@GetMapping("/get-loan-history/{accountNumber}")
	public ApplicationResponse getUserLoanHistory(@PathVariable String accountNumber)
	{
		return service.getUserLoanHistory(accountNumber);
	}
	
	

    
 
    
    
}
