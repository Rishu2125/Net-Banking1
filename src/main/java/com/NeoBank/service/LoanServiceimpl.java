package com.NeoBank.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.CreditDebitRequest;
import com.NeoBank.dto.LoanRequestDto;
import com.NeoBank.dto.TransactionDto;
import com.NeoBank.entities.Bank;
import com.NeoBank.entities.Loan;
import com.NeoBank.entities.LoanStatus;
import com.NeoBank.entities.TransactionType;
import com.NeoBank.entities.User;
import com.NeoBank.repository.BankRepo;
import com.NeoBank.repository.LoanRepo;

import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;
import com.NeoBank.utils.LoanUtils;
@Service
public class LoanServiceimpl implements LoanService {
@Autowired
   private UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	LoanUtils loanUtils;
	@Autowired
	LoanRepo loanRepo;
	@Autowired
	BankService bankService;
	@Autowired
	BankRepo bankRepo;
	@Autowired
TransactionService transactionService;

   

	@Override
	public ApplicationResponse createLoan(LoanRequestDto loanRequestDto) {

	    User user =
	            userRepository.findByAccountNumber(
	                    loanRequestDto.getAccountNumber());

	    if (user == null || user.isDeactivated() || user.isAccountLocked()) {

	        return ApplicationResponse.builder()
	                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
	                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
	                .build();
	    }


	    // ✅ check max amount correctly
	    if (loanRequestDto.getLoanAmount()
	            .compareTo(LoanUtils.MAXIMUM_LOAN_AMOUNT) > 0) {

	        return ApplicationResponse.builder()
	                .responseCode("529")
	                .responseMessage("Exceeded Loan Amount")
	                .build();
	    }


	    // ✅ EMI calculation
	    BigDecimal emi =
	            LoanUtils.calculateEmi(
	                    loanRequestDto.getLoanAmount(),
	                    LoanUtils.GET_INTREST_RATE,
	                    loanRequestDto.getDuration()
	            );


	    Loan loan = Loan.builder()
	            .user(user)
	            .duration(loanRequestDto.getDuration())
	            .emi(emi)
	            .loanType(loanRequestDto.getLoantype())
	            .loanAmount(loanRequestDto.getLoanAmount())
	            .loanRefrenceNumber(
	                    LoanUtils.generateLoanReferenceNumber())
	            .status(LoanStatus.PENDING)
	            .intrestrate(
	                    LoanUtils.getInterest(
	                            loanRequestDto.getLoantype()))
	            .totalPaidAmount(BigDecimal.ZERO)
	            .totalPayableAmount(
	                    LoanUtils.totalPayable(
	                            emi,
	                            loanRequestDto.getDuration()))
	            .build();


	    loanRepo.save(loan);


	    return ApplicationResponse.builder()
	            .responseCode(LoanUtils.LOAN_CREATED_CODE)
	            .responseMessage(LoanUtils.LOAN_CREATED_MESSAGE)
	            .build();
	}
	@Override
	public ApplicationResponse deductEmiFromAll() {

	    List<Loan> loans = loanRepo.findAll();

	    for (Loan loan : loans) {

	        if (loan.getStatus() != LoanStatus.COMPLETED)
	            continue;

	        if (loan.getNextEmiDate() == null)
	            continue;

	        if (!loan.getNextEmiDate().isEqual(LocalDate.now()))
	            continue;

	        if (loan.getTotalPaidAmount()
	                .compareTo(loan.getTotalPayableAmount()) >= 0) {

	            loan.setStatus(LoanStatus.COMPLETED);
	            loanRepo.save(loan);
	            continue;
	        }

	        User user = loan.getUser();

	        BigDecimal emi = loan.getEmi();

	        

	           
	            CreditDebitRequest request =
	                    CreditDebitRequest.builder()
	                            .senderAccountNumber(user.getAccountNumber())
	                            .amount(emi)
	                            .build();

	            userService.debitAccount(request);

	          
	            bankService.creditBank(emi);
	            Bank bank = bankRepo.findById(1L)
	    		        .orElseThrow(() ->
	    		                new RuntimeException("Bank not found"));
	            bank.setTotalLoanReceived(bank.getTotalLoanReceived().add(emi));

	           
	            loan.setTotalPaidAmount(
	                    loan.getTotalPaidAmount().add(emi)
	            );

	          
	            loan.setNextEmiDate(
	                    loan.getNextEmiDate().plusMonths(1)
	            );

	            
	            if (loan.getTotalPaidAmount()
	                    .compareTo(loan.getTotalPayableAmount()) >= 0) {

	                loan.setStatus(LoanStatus.COMPLETED);
	            }

	            loanRepo.save(loan);

	           
	            TransactionDto dto=TransactionDto.builder()
	            		.amount(emi)
	            		.senderAccountNumber(user.getAccountNumber())
	            		.receiverAccountNumber("123456789")
	            		.transactionType(TransactionType.emi)
	            		

	            	
	            		.build();
	            transactionService.saveTransaction(dto);
	           
	    

	        

	    }
	    return ApplicationResponse.builder()
	    		 .responseCode("445")
	    		 .responseMessage("Emi Deducted for all")
	    		 
	    		 .build();

	}

}
