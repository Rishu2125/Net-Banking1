package com.NeoBank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Builder
@Setter
@Getter
public class LoanResponseDto {
	private String loanRefrenceNumber;
	private BigDecimal loanAmount;
	private BigDecimal totalPayableAmount;
	private BigDecimal totalPaidAmount;
	private BigDecimal emi;
	private Integer duration;
	private Double intrestrate;
	private LocalDate approvedDate;
	private LocalDate nextEmiDate;
	private LocalDate endDate;

}
