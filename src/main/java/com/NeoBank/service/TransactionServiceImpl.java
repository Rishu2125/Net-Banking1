package com.NeoBank.service;

import java.math.BigDecimal;
import java.util.List;
import com.NeoBank.utils.TransactionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.AnalyticsData;
import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.TransactionDto;
import com.NeoBank.entities.Transaction;
import com.NeoBank.entities.TransactionStatus;
import com.NeoBank.entities.User;
import com.NeoBank.repository.TransactionRepo;
import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;

@Service
public class TransactionServiceImpl  implements TransactionService{
	@Autowired
TransactionUtil transactionUtil;

	@Autowired
	TransactionRepo repo;
@Autowired UserRepository repository;

  
	@Override
	public void saveTransaction(TransactionDto dto) {
		Transaction transaction=Transaction.builder()
				.senderAccountNumber(dto.getSenderAccountNumber())
				.receiverAccountNumber(dto.getReceiverAccountNumber())
				.amount(dto.getAmount())
				.status(TransactionStatus.Success)
			  .transactionType(dto.getTransactionType())
			  
				
				
				
				.build();
		repo.save(transaction);
		
		
		
	}

	@Override
	public ApplicationResponse monthlyAnalytics(String accountNumber) {
		User user=repository.findByAccountNumber(accountNumber);
		  if (user == null || user.isDeactivated()) {
		        return ApplicationResponse.builder()
		                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
		                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
		                .build();
		    }
		  BigDecimal totalCredit=repo.totalCreditCurrentMonth(accountNumber);
		  BigDecimal totalDebit=repo.totalDebitCurrentMonth(accountNumber);
		  
		  AnalyticsData analyticsData=AnalyticsData.builder()
				  .totalCredit(totalCredit)
				  .totalDebit(totalDebit)
				  
				  .build();
		  
		  return ApplicationResponse.builder()
				  .responseCode("764")
				  .responseMessage("Analytics fetched successfully")
				  
				  .data(analyticsData).build();
		    
		
		
		
	}

	@Override
	public ApplicationResponse getAllTransactions(int page,int size) {
		Pageable pageable=PageRequest.of(page, size);
		Page<Transaction> transactions=repo.findAll(pageable);
		
		return ApplicationResponse.builder()
				.responseCode(transactionUtil.TRANSACTION_FETCHED_CODE)
				.responseMessage(transactionUtil.TRANSACTION_FETCHED_MESSAGE)
				.data(transactions)
				
				
				.build();
	}

}
