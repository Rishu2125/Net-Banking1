package com.NeoBank.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.NeoBank.entities.Transaction;
import com.NeoBank.entities.User;
import com.NeoBank.repository.UserRepository;
@Service
public class SchedulerImpl implements Scheduler {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private BankStatement bankStatement;
	@Autowired
	private LoanService loanService;

	@Override
	@Scheduled(cron = "0 0 10 1 * ?")
	public void sendMonthlyStatement() {
		List<User> users=userRepository.findAll();
		  for (User user : users) {

	            String accountNumber = user.getAccountNumber();

	            String startDate =
	                    LocalDate.now()
	                            .minusMonths(1)
	                            .withDayOfMonth(1)
	                            .toString();

	            String endDate =
	                    LocalDate.now()
	                            .minusMonths(1)
	                            .withDayOfMonth(
	                              LocalDate.now()
	                              .minusMonths(1)
	                              .lengthOfMonth()
	                            )
	                            .toString();

	            try {
					List<Transaction> list =
					        bankStatement.generateStatement(
					                accountNumber,
					                startDate,
					                endDate);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		
		// TODO Auto-generated method stub
		
	}
	}

	@Override
	@Scheduled(cron = "0 0 10 * * ?")
	public void deductMonthlyEmi() {
		loanService.deductEmiFromAll();
		
	}
}
