package com.NeoBank.dto;

import java.math.BigDecimal;

import com.NeoBank.entities.TransactionStatus;
import com.NeoBank.entities.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class TransactionDto {
	private TransactionType transactionType;
	private BigDecimal amount;
	private String receiverAccountNumber;
	private String senderAccountNumber;
    private TransactionStatus status;

}
