package com.NeoBank.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.CreditDebitRequest;
import com.NeoBank.dto.EmailDto;
import com.NeoBank.dto.FixedDepositDto;
import com.NeoBank.dto.WithDrawFdDto;
import com.NeoBank.entities.Bank;
import com.NeoBank.entities.FixedDeposit;
import com.NeoBank.entities.Status;
import com.NeoBank.entities.User;
import com.NeoBank.repository.BankRepo;
import com.NeoBank.repository.FixedDepositRepo;
import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;
import com.NeoBank.utils.FixedDepositUtils;

import jakarta.transaction.Transactional;
@Service
public class FixedDepositImpl implements FixedDepositService {
@Autowired
    private UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private FixedDepositUtils depositUtils;
	@Autowired
	private FixedDepositRepo depositRepo;
	@Autowired
	BankRepo bankRepo;
	@Autowired
	EmailService emailService;
	@Autowired
	OtpService otpService;



	@Override
	@Transactional
	public ApplicationResponse fixDeposit(FixedDepositDto depositDto) {
		String accountNumber=depositDto.getAccountNumber();
		User user=userRepository.findByAccountNumber(accountNumber);
		if(user==null || user.isDeactivated())
		{
			 return ApplicationResponse.builder()
		                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
		                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
		                .build();
		}
		Double intrestRate=depositUtils.getInterestRate(depositDto.getDuration());
		
		if(user.getAccountBalance().compareTo(depositDto.getAmount())<0)
		{
			return ApplicationResponse.builder()
					.responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
					.responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
					
					.build();
		}
		
		BigDecimal maturityAmount=depositUtils.calculateFd(depositDto.getAmount(), intrestRate, depositDto.getDuration());
		LocalDate maturityDate =
	            LocalDate.now()
	                    .plusMonths(depositDto.getDuration());
		
	Boolean isPinValid=	userService.validatePin(depositDto.getPin(),accountNumber);
	if(!isPinValid)
	{
		return ApplicationResponse.builder()
				.responseCode(AccountUtils.INVALID_CREDINTIALS_CODE)
				.responseMessage(AccountUtils.INVALID_CREDINTIALS_CODE_MESSAGE)
				
				.build();
	}
	Bank bank = bankRepo.findById(1L)
	        .orElseThrow(() ->
	                new RuntimeException("Bank not found"));
	
	CreditDebitRequest creditDebitRequest=CreditDebitRequest.builder()
			.amount(depositDto.getAmount())
			.receiverAccountNumber(bank.getBankAccountNumber())
			.senderAccountNumber(depositDto.getAccountNumber())
			
			
			.build();
	userService.debitAccount(creditDebitRequest);
	
	bank.setBalance(bank.getBalance().add(depositDto.getAmount()));
	bank.setFdDeposited(bank.getFdDeposited().add(depositDto.getAmount()));
	bankRepo.save(bank);
		
		userRepository.save(user);
String refId=depositUtils.generateRefrenceNumber();
	
		FixedDeposit fd=FixedDeposit.builder()
				.user(user)
				.amount(depositDto.getAmount())
				.refrenceNumber(refId)
				.duration(depositDto.getDuration())
				.maturityAmount(maturityAmount)
				.maturityDate(maturityDate)
				.intrestRate(intrestRate)
			    .status(Status.active)
				
				
				.build();
		
		
		depositRepo.save(fd);
		EmailDto emailDto=EmailDto.builder()
				.recipient(user.getEmailId())
				.subject("NEO BANK FIXED DEPOSIT")
				.messageBody("You FD has been created for account number"+user.getAccountNumber()
				+" for duration :"+depositDto.getDuration()+"months and Your maturity Amount is"+maturityAmount +"and your refrence number is:: "+refId )
				
				
				.build();
		emailService.sendEmailAlert(emailDto);
		
		
		return ApplicationResponse.builder()
				.responseCode(FixedDepositUtils.FD_CREATED_CODE)
				.responseMessage(FixedDepositUtils.FD_CREATED_MESSAGE)
				
				.build();
	}

	@Override
	@Transactional
	public ApplicationResponse withdrawFd(WithDrawFdDto dto) {

	    User user = userRepository.findByAccountNumber(dto.getAccountNumber());

	    if (user == null) {
	        return ApplicationResponse.builder()
	                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
	                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
	                .build();
	    }

	    FixedDeposit fd =
	            depositRepo.findByRefrenceNumber(
	                    dto.getRefrenceNumber());

	    if (fd == null) {
	        return ApplicationResponse.builder()
	                .responseCode(FixedDepositUtils.FD_DID_NOT_EXIST_CODE)
	                .responseMessage(FixedDepositUtils.FD_DID_NOT_EXIST_MESSAGE)
	                .build();
	    }

	    if (fd.getStatus() != Status.active) {
	        return ApplicationResponse.builder()
	                .responseCode(FixedDepositUtils.FD_DID_NOT_EXIST_CODE)
	                .responseMessage(FixedDepositUtils.FD_DID_NOT_EXIST_MESSAGE)
	                .build();
	    }

	    LocalDate today = LocalDate.now();
	    BigDecimal amountToReturn;

	    if (!today.isBefore(fd.getMaturityDate())) {

	        amountToReturn = fd.getMaturityAmount();

	    } else {

	        int monthsPassed =
	                depositUtils.getMonthsBetween(
	                        fd.getStartDate(),
	                        today
	                );

	        double penaltyRate =
	                fd.getIntrestRate() - 2;

	        if (penaltyRate < 3) {
	            penaltyRate = 3;
	        }

	        amountToReturn =
	                depositUtils.calculateFd(
	                        fd.getAmount(),
	                        penaltyRate,
	                        monthsPassed
	                );
	    }


	    // ✅ STEP 1 → send OTP if not provided
	    if (dto.getOtp() == null || dto.getOtp().isEmpty()) {

	        String otp =
	                otpService.generateOtp(
	                        user.getAccountNumber()
	                );

	        EmailDto otpEmail = EmailDto.builder()
	                .recipient(user.getEmailId())
	                .subject("OTP for FD Withdraw")
	                .messageBody(
	                        "Your OTP for FD withdraw is: "
	                                + otp +
	                                " valid for 2 minutes"
	                )
	                .build();

	        emailService.sendEmailAlert(otpEmail);

	        return ApplicationResponse.builder()
	                .responseCode("OTP_SENT")
	                .responseMessage("OTP sent to email")
	                .build();
	    }


	    // ✅ STEP 2 → validate OTP
	    boolean isOtpValid =
	            otpService.validateOtp(
	                    user.getAccountNumber(),
	                    dto.getOtp()
	            );

	    if (!isOtpValid) {

	        return ApplicationResponse.builder()
	                .responseCode(
	                        AccountUtils.INVALID_CREDINTIALS_CODE
	                )
	                .responseMessage(
	                        AccountUtils.INVALID_CREDINTIALS_CODE_MESSAGE
	                )
	                .build();
	    }


	    // ✅ STEP 3 → close FD
	    

	    fd.setStatus(Status.inActive);
	    fd.setWithdrawlDate(LocalDate.now());
	    fd.setAmountWithdrawl(amountToReturn);
	    Bank bank = bankRepo.findById(1L)
		        .orElseThrow(() ->
		                new RuntimeException("Bank not found"));
		
	    CreditDebitRequest creditDebitRequest =CreditDebitRequest.builder()
	    		.amount(amountToReturn)
	    		.receiverAccountNumber(user.getAccountNumber())
	    		.senderAccountNumber(bank.getBankAccountNumber())
	    		
	    		.build();
	    userService.creditAccount(creditDebitRequest);
	    bank.setBalance(bank.getBalance().subtract(amountToReturn));
	    bank.setFdWithdrawl(bank.getFdWithdrawl().add(amountToReturn));
	    bankRepo.save(bank);



	    userRepository.save(user);
	    depositRepo.save(fd);


	    return ApplicationResponse.builder()
	            .responseCode(
	                    FixedDepositUtils.FD_CLOSED_CODE
	            )
	            .responseMessage(
	                    FixedDepositUtils.FD_CLOSED_MESSAGE
	            )
	            .build();
	}

	@Override
	public ApplicationResponse userFd(String accountNumber) {
		User user=userRepository.findByAccountNumber(accountNumber);

	    if (user == null) {
	        return ApplicationResponse.builder()
	                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
	                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
	                .build();
	    }
	    List<FixedDeposit> userFd=depositRepo.findByUser(user);
	    if(userFd.isEmpty())
	    {
	    	return ApplicationResponse.builder()
	    			.responseCode(FixedDepositUtils.FD_DID_NOT_EXIST_CODE)
	    			.responseMessage(FixedDepositUtils.FD_DID_NOT_EXIST_MESSAGE)
	    			
	    			
	    			.build();
	    }
	    return ApplicationResponse.builder()
	    		.responseCode(FixedDepositUtils.FD_FETCHED_SUCCESSFULLY_CODE)
	    		.responseCode(FixedDepositUtils.FD_FETCHED_SUCCESSFULLY_MESSAGE)
	    		.data(userFd)
	    		
	    		
	    		.build();
		
	
	}

}
