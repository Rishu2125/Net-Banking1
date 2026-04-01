package com.NeoBank.dto;

import java.math.BigDecimal;

import com.NeoBank.entities.LoanType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoanRequestDto {
	private String accountNumber;
	private Integer duration;
	private BigDecimal loanAmount;
	private LoanType loantype;
	

}
