package com.NeoBank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.EmailDto;
import com.NeoBank.dto.ResetPasswordDto;
import com.NeoBank.entities.User;
import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;
@Service
public class OtpSendAndValidate {
	@Autowired
	private UserRepository repository;
	@Autowired
	private OtpService otpService;
	@Autowired
	EmailService emailService;
	public ApplicationResponse sendOtp(String accountNumber)
	{
	    User user = repository.findByAccountNumber(accountNumber);

	    if (user == null)
	    {
	        return ApplicationResponse.builder()
	                .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
	                .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
	                .build();
	    }

	    String otp = otpService.generateOtp(accountNumber);

	    EmailDto emailDto = EmailDto.builder()
	            .recipient(user.getEmailId())
	            .messageBody("Your OTP is " + otp + " valid for 2 minutes")
	            .subject("OTP")
	            .build();

	    emailService.sendEmailAlert(emailDto);

	    return ApplicationResponse.builder()
	            .responseCode("00")
	            .responseMessage("OTP Sent")
	            .build();
	}
	public ApplicationResponse verifyOtp(ResetPasswordDto dto)
	{

	    Boolean isOtpValid =
	            otpService.validateOtp(dto.getAccountNumber(), dto.getOtp());

	    if (!isOtpValid)
	    {
	        return ApplicationResponse.builder()
	                .responseCode(AccountUtils.INVALID_CREDINTIALS_CODE)
	                .responseMessage("Invalid OTP")
	                .build();
	    }

	    return ApplicationResponse.builder()
	            .responseCode("00")
	            .responseMessage("OTP Verified")
	            .build();
	}

}
