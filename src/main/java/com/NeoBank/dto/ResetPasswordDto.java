package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordDto {
	private String accountNumber;

	private String newPin;
	private String otp;
	

}
