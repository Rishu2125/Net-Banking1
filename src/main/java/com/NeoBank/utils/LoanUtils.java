package com.NeoBank.utils;

import java.math.BigDecimal;
import java.time.Year;

import org.springframework.stereotype.Component;

import com.NeoBank.entities.LoanType;

import io.netty.util.internal.ThreadLocalRandom;
@Component
public class LoanUtils {
	public static Double GET_INTREST_RATE=11.25;
	
	public static BigDecimal MAXIMUM_LOAN_AMOUNT=BigDecimal.valueOf(10000);
	public static String LOAN_CREATED_CODE="597";
	public static String LOAN_CREATED_MESSAGE="Loan Created";
	public static String LOAN_APPROVED_CODE="598";
	public static String LOAN_APPROVED_MESSAGE="Loan Approved";
	public static String LOAN_NOT_FOUND="894";
	public static String LOAN_NOT_FOUND_MESSAGE="Loan did not exist";
	public static String LOAN_REJECTED_CODE="599";
	public static String LOAN_REJECTED_MESSAGE="Loan rejected";
	public static String LOAN_FETCHED_CODE="871";
	public static String LOAN_FETCHED_MESSAGE="Loan Fetched successfully";
	public static String LOAN_COMPLETED="746";
	public static String LOAN_COMPLETED_MESSAGE="Loan Completed";
	public static final String EMI_PAID_CODE_SUCCESSFULLY="468";
	public static final String EMI_PAID_MESSAGE_SUCCESSFULLY="Emi Paid successfully";
	
	
	
	public static Double getInterest(LoanType type) {

	    switch (type) {

	        case education:
	            return 5.6;

	        case personal:
	            return 10.5;

	        case home:
	            return 7.2;

	        case car:
	            return 8.3;

	        case business:
	            return 12.0;

	        default:
	            return 9.0;
	    }
	}
	//generate loan Loanrefrence number
	 public static String generateLoanReferenceNumber() {

	        Year currentYear = Year.now();

	        int min = 100000000;
	        int max = 999999999;

	        int randomNumber =
	                ThreadLocalRandom.current().nextInt(min, max + 1);

	        return "SBI" + currentYear + randomNumber;
	    }
	
	
	//calculation of EMI
	public static BigDecimal calculateEmi(
	        BigDecimal loanAmount,
	        double interestRate,
	        Integer months) {

	    double P = loanAmount.doubleValue();
	    double R = interestRate / 12 / 100;
	    Integer N = months;

	    double emi = (P * R * Math.pow(1 + R, N)) /
	            (Math.pow(1 + R, N) - 1);

	    return BigDecimal.valueOf(emi);
	}
	
	
	//Calculation of total amount to be paid
	
	public static BigDecimal totalPayable(BigDecimal emi,Integer months)
	{
		return emi.multiply(BigDecimal.valueOf(months));
	}

}
