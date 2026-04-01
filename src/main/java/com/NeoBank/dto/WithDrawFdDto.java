package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter@Builder
public class WithDrawFdDto {
	private String refrenceNumber;
	private String accountNumber;
	private String otp;

}
