package com.NeoBank.dto;

import java.math.BigDecimal;




import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor@NoArgsConstructor
@Builder
public class FixedDepositDto {
	private BigDecimal amount;
	private Integer duration;
	private String pin;

	
	
	

	private String accountNumber;

}
