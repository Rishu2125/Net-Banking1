package com.NeoBank.utils;



import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;

import org.springframework.stereotype.Component;

@Component
public class FixedDepositUtils {
	
	public static final String FD_CREATED_CODE="439";
	public static final String FD_CREATED_MESSAGE="FD successfully created";
	public static final String 	FD_DID_NOT_EXIST_CODE="437";
	public static final String 	FD_DID_NOT_EXIST_MESSAGE="FD did not exist";
	public static final String FD_CLOSED_CODE="436";
	public static final String FD_CLOSED_MESSAGE="FD closed";
	public static final String FD_FETCHED_SUCCESSFULLY_CODE="527";
			public static final String FD_FETCHED_SUCCESSFULLY_MESSAGE="FD fetched successfully";
	
	
	
	public Double getInterestRate(Integer months)
	{
	    if(months < 6)
	        return 5.0;

	    else if(months < 12 && months>6)
	        return 6.70;

	    else if(months < 24 && months>12)
	        return 7.34;

	    else
	        return 8.6;
	}
	
	
	
	
	
	
	
	//=======================================================================================================================
	public BigDecimal calculateFd(BigDecimal amount,Double rate,Integer duration)
	{
		double p = amount.doubleValue();
		double r = rate / 100;
		double t = duration / 12.0; 
		int n = 4; 
		double total = p * Math.pow(1 + r / n, n * t);
		return BigDecimal.valueOf(total);
	}
	
	
	
	
	
	
	
	
	
	//=======================================================================================================================
	public int getMonthsBetween(
	        LocalDate start,
	        LocalDate end) {

	    return (end.getYear() - start.getYear()) * 12
	            + end.getMonthValue()
	            - start.getMonthValue();
	}
	
	
	
	//=========================================================================================================
	public static String generateRefrenceNumber()
	{

		//want to generate account number starting with 4 digit year and random 6 digit
		Year currentYear=Year.now();
		int min=1000000;
		int max=9999999;
		int randNumber=(int) Math.floor(Math.random()*(max-min+1)+min);


		//now convert both the integers to String

		String randomNumber=String.valueOf(randNumber);
		String year=String.valueOf(currentYear);
		
		StringBuffer refrenceNumber=new StringBuffer();
		return refrenceNumber.append(year).append(randomNumber).toString();
	}

}
