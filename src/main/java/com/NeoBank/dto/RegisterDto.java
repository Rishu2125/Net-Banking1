package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterDto {
	private String firstName;
	private String middleName;
	private String lastname;
	private String emailId;
	private String password;
	private String aadhaarNumber;
	
	private String state;
	private String city;
	private String gender;
	private String address;
	
	
	private String panNumber;
	
	
	private String phoneNumber;
	private String alternatePhoneNumber;
	
	

	

}
