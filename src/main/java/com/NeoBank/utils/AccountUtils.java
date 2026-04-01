package com.NeoBank.utils;

import java.time.Year;
import java.util.Random;

import org.springframework.stereotype.Component;
@Component
public class AccountUtils {
	public static String generateAccountNumber()
	{

		//want to generate account number starting with 4 digit year and random 6 digit
		Year currentYear=Year.now();
		int min=100000;
		int max=999999;
		int randNumber=(int) Math.floor(Math.random()*(max-min+1)+min);


		//now convert both the integers to String

		String randomNumber=String.valueOf(randNumber);
		String year=String.valueOf(currentYear);
		
		StringBuffer accountNumber=new StringBuffer();
		return accountNumber.append(year).append(randomNumber).toString();
	}
	public static String generatePin()
	{
		 Random random = new Random();
	        int pin = 1000 + random.nextInt(9000);
	        return String.valueOf(pin); 
		
	}
	public static final String ACCOUNT_EXIST_CODE="001";
	public static final String ACCOUNT_EXIST_MESSAGE="This User already exist";
	public static final String ACCOUNT_CREATION_SUCCESS_CODE="002";
	public static final String ACCOUNT_CREATION_MESSAGE="Account created successfully";
	public static final String ACCOUNT_DOES_NOT_EXIST_MESSAGE="Account does not exist";
	public static final String ACCOUNT_DOES_NOT_EXIST_CODE="003";
	public static final String ACCOUNT_FOUND_CODE="006";
	public static final String ACCOUNT_FOUND_MESSAGE="Account founded successfully";
	public static final String ACCOUNT_CREDITED_MESSAGE="Money Credited successfully";
	public static final String ACCOUNT_CREDITED_CODE="009";
	public static final String ACCOUNT_DEBITED_MESSAGE="Money Debiteds successfully";
	public static final String ACCOUNT_DEBITED_CODE="008";
	public static final String INSUFFICIENT_BALANCE_CODE="004";
	public static final String INSUFFICIENT_BALANCE_MESSAGE="Insufficient Balance";
	public static final String INSUFFICIENT_AMOUNT_CODE="081";
	public static final String INSUFFICIENT_AMOUNT_MESSAGE="Amount must be greater than 0";
	

	public static final String CREDIT_ACCOUNT_NOT_EXIST_CODE="012";
	public static final String CREDIT_ACCOUNT_NOT_EXIST_MESSAGE="The Account you are trying to credit does not exist";
	public static final String TRANSFER_SUCCESSFUL_CODE="013";
	public static final String TRANSFER_SUCCESSFUL_MESSAGE="Transferred Successfully";
	public static final String DEBIT_ACCOUNT_DOES_NOT_EXIST_CODE="043";
	public static final String DEBIT_ACCOUNT_DOES_NOT_EXIST_MESSAGE="The Account you are trying to debit does not exist";
	public static final String DATA_UPDATED_SUCCESSFULLY_MESSAGE="Updated Successfully";
	public static final String DATA_UPDATED_SUCCESSFULLY_CODE="020";
	public static final String FD_SUCCESS_CODE = "200";
    public static final String FD_CREATED_MESSAGE = "Fixed Deposit Created Successfully";
    public static final String ACCOUNT_IS_LOCKED="444";
    public static final String ACCOUNT_LOCKED_MESSAGE="Your Account is Locked try again later";
    public static final String  ACCOUNT_LOGGED_IN_SUCCESSFULLY="143";
    public static final String  ACCOUNT_LOGGED_IN_SUCCESSFULLY_MESSAGE="Account Logged in successfully";
    public static final String INVALID_CREDINTIALS_CODE="63";
    		 public static final String INVALID_CREDINTIALS_CODE_MESSAGE="Invalid credintials ";
    		 public static final String BALANCE_FETCHED_SUCCESSFULLY_CODE="66";
    		 public static final String BALANCE_FETCHED_SUCCESSFULLY_MESSAGE="Balance fetched successfully";
    		public static final String PIN_VEREFIED_CODE="88";
    		 public static final String PIN_VEREFIED_MESSAGE="Pin Verefied ";
    		 public static final String NO_USER_FOUND="016";
    		 public static final String NO_USER_FOUND_MESSAGE="No user found ";
    		 public static final String USER_FETCHED_CODE="014";
    		 public static final String USER_FECTHED_MESSAGE=" user fetched ";
    		 
    		 
    		 

}
