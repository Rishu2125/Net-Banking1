package com.NeoBank.service;


import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.CreditDebitRequest;
import com.NeoBank.dto.EmailDto;
import com.NeoBank.dto.ProfileManagementDto;
import com.NeoBank.dto.UserDto;
import com.NeoBank.entities.Bank;
import com.NeoBank.entities.Loan;
import com.NeoBank.entities.LoanStatus;
import com.NeoBank.entities.User;
import com.NeoBank.repository.BankRepo;
import com.NeoBank.repository.LoanRepo;
import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;
import com.NeoBank.utils.AdminUtils;
import com.NeoBank.utils.LoanUtils;
@Service
public class AdminServiceImpl  implements AdminService{

   
@Autowired
LoanRepo loanRepo;
@Autowired
BankRepo bankRepo;
@Autowired
UserService userService;
@Autowired
UserRepository userRepository;
@Autowired
LoanUtils loanUtils;

@Autowired
EmailService emailService;
@Autowired
BankService bankService;

   
	@Override
	
	//------------------------------------------------------------------------------------------------------------------------
	//approve loan request
	public ApplicationResponse approveLoan(String loanRefrenceNumber) {
		
		Loan loan=loanRepo.findByLoanRefrenceNumber(loanRefrenceNumber);
		
		if(loan==null)
		{
			return ApplicationResponse.builder()
					.responseCode(LoanUtils.LOAN_NOT_FOUND)
					.responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
					
					.build();
		}
		User user=loan.getUser();

		
		
		CreditDebitRequest creditDebitRequest=CreditDebitRequest.builder()
				.receiverAccountNumber(user.getAccountNumber())
				.senderAccountNumber(AdminUtils.BANK_ACCOUNT_NUMBER)
				.amount(loan.getLoanAmount())
				
				.build();
	
		userService.creditAccount(creditDebitRequest);
		Bank bank = bankRepo.findById(1L)
		        .orElseThrow(() ->
		                new RuntimeException("Bank not found"));
		bankService.debitBank(loan.getLoanAmount());
		bank.setTotalLoanGiven(bank.getTotalLoanGiven().add(loan.getLoanAmount()));
		
		
		bankRepo.save(bank);
				
				
				
		
		loan.setApprovedDate(LocalDate.now());
		loan.setEndDate(LocalDate.now().plusMonths(loan.getDuration()));
		loan.setStatus(LoanStatus.RUNNING);
		loan.setNextEmiDate(LocalDate.now().plusMonths(1));
		loanRepo.save(loan);
		
		EmailDto dto=EmailDto.builder()
				.messageBody("Your loan has been approved and money will get transferred to your account shortly")
				.recipient(user.getEmailId())
				.subject("Loan get approved")
				
				.build();
		emailService.sendEmailAlert(dto);
		return ApplicationResponse.builder()
				.responseCode(LoanUtils.LOAN_APPROVED_CODE)
				.responseMessage(LoanUtils.LOAN_APPROVED_MESSAGE)
				
				
				.build();
	}
	//=----------------------------------------------------------------------------------------------------------------------
	//reject loan request
	@Override
	public ApplicationResponse rejectLoanRequest(String loanRefrenceNumber) {
		Loan loan=loanRepo.findByLoanRefrenceNumber(loanRefrenceNumber);
		if(loan==null)
		{
			return ApplicationResponse.builder()
					.responseCode(LoanUtils.LOAN_NOT_FOUND)
					.responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
					
					.build();
		}
		EmailDto dto=EmailDto.builder()
				.messageBody("Your loan request has been rejected")
				.recipient(loan.getUser().getEmailId())
				.subject("Loan Get Rejected")
				
				
				.build();
		emailService.sendEmailAlert(dto);
		loanRepo.delete(loan);
		return ApplicationResponse.builder()
				.responseCode(LoanUtils.LOAN_REJECTED_CODE)
				.responseMessage(LoanUtils.LOAN_REJECTED_MESSAGE)
				.build();
		
		
		
		
	}
	@Override
	public ApplicationResponse getAllLoans() {
		List<Loan> loans=loanRepo.findAll();
		if(loans==null)
		{
			return ApplicationResponse.builder()
					.responseCode(LoanUtils.LOAN_NOT_FOUND)
					.responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
					
					.build();
		}
		return ApplicationResponse.builder()
				.responseCode(LoanUtils.LOAN_FETCHED_CODE)
				.responseMessage(LoanUtils.LOAN_FETCHED_MESSAGE)
				.data(loans)
				
				.build();
	}
	@Override
	public ApplicationResponse deactivateActivateUser(String accountNumber) {
		User user=userRepository.findByAccountNumber(accountNumber);
		  if (user == null ) {
		        return ApplicationResponse.builder()
		                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
		                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
		                .build();
		    }
		  if(user.isDeactivated())
		  {
			  user.setDeactivated(false);
		  }
		  else {
			  user.setDeactivated(true);
		  }
		  
		  userRepository.save(user);
		  UserDto dto=UserDto.builder()
				  .status(user.isDeactivated() ? "inActive" : "active")
				  
				  .build();
		
		return ApplicationResponse.builder()
				.responseCode(AdminUtils.USER_DEACTIVATED_SUCCESS_CODE)
				.responseMessage(AdminUtils.USER_DEACTIVATED_SUCCESS_MESSAGE)
				.data(dto)
				.build();
	}
	@Override
	public ApplicationResponse checkUserBalance(String accountNumber) {
		User user=userRepository.findByAccountNumber(accountNumber);
		  if (user == null ) {
		        return ApplicationResponse.builder()
		                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
		                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
		                .build();
		    }
		  UserDto dto=UserDto.builder()
				  .accountBalance(user.getAccountBalance())
				  
				  .build();
		// TODO Auto-generated method stub
		return ApplicationResponse.builder()
				.responseCode(AccountUtils.BALANCE_FETCHED_SUCCESSFULLY_CODE)
				.responseMessage(AccountUtils.BALANCE_FETCHED_SUCCESSFULLY_MESSAGE)
				.data(dto)
				
				.build();
	}
	@Override
	public ApplicationResponse findAllPendingLoan() {
		List<Loan> loans=loanRepo.findByStatus(LoanStatus.PENDING);
		return ApplicationResponse.builder()
				.responseCode(LoanUtils.LOAN_FETCHED_CODE)
				.responseMessage(LoanUtils.LOAN_FETCHED_MESSAGE)
				.data(loans)
				
				.build();
		
	}
	@Override
	public ApplicationResponse profileManagement(ProfileManagementDto dto,String accountNumber) {
		User user=userRepository.findByAccountNumber(accountNumber);
		  if (user == null ) {
		        return ApplicationResponse.builder()
		                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
		                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
		                .build();
		    }
		  if(!dto.getCity().isBlank())
			{
				user.setCity(dto.getCity());
				
			}
			if(!dto.getEmailId().isEmpty())
			{
				user.setEmailId(dto.getEmailId());
				
			}
			if(!dto.getFirstName().isEmpty())
			{
				 user.setFirstName(dto.getFirstName());
			}
			if(!dto.getGender().isEmpty())
			{
				 user.setGender(dto.getGender());
			}
		
			if(!dto.getAlternatePhoneNumber().isEmpty())
			{
				 user.setAlternatePhoneNumber(dto.getAlternatePhoneNumber());
			}
			if(!dto.getLastName().isEmpty())
			{
		        user.setLastName(dto.getLastName());
				
			}
			if(!dto.getPhoneNumber().isEmpty())
			{
				user.setPhoneNumber(dto.getPhoneNumber());
			}
	       
	        if(!dto.getState().isEmpty())
	        {
	        	 user.setState(dto.getState());
	        	
	        }
	        if(!dto.getMiddleName().isEmpty())
	        {
	        	 user.setMiddleName(dto.getMiddleName());
	        }
	        
	       userRepository.save(user);
	        
	       
		 
	
		return ApplicationResponse.builder()
				.responseCode(AdminUtils.USER_UPDATED_SUCCESSFULLY_CODE)
				.responseMessage(AdminUtils.USER_UPDATED_SUCCESSFULLY_MESSAGE)
				
				.build();
	}

}
