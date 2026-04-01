package com.NeoBank.utils;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;
@Component
public class TransactionUtil {
	public static final BigDecimal DAILY_TRANSFER_LIMIT =
	        new BigDecimal("50000");
	public static final String 	DAILY_TRANSFERRED_LIMIT_REACHED_CODE="671";
	public static final String 	DAILY_TRANSFERRED_LIMIT_REACHED_MESSAGE="You Have reached your maximum limit for today";
public static final String TRANSACTION_FETCHED_CODE="894";
public static final String TRANSACTION_FETCHED_MESSAGE="Transaction Fetched successfully";
}
