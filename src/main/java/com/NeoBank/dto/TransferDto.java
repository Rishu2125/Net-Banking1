package com.NeoBank.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransferDto {
	private String senderAccountNumber;
	private String receiverAccountNumber;
	private BigDecimal amount;
	private String pin;

}
