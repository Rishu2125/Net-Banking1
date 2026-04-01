package com.NeoBank.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
	private String accountNumber;
	private String aadhaarNumber;
	private String role;
	private String emailId;;
	private String fullName;

}
