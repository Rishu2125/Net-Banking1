package com.NeoBank.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountInfo {
	private String accountNumber;
	private BigDecimal accountBalance;
	private String accountName;
	

}
