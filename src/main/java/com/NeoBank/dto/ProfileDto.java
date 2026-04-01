package com.NeoBank.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProfileDto {
	private String firstName;
	private String accountNumber;
	private String lastName;
	private String emailId;
	private String address;
	private String city;
	private String state;
	private String middleName;
	private String gender;
	private String phoneNumber;
	private String alternatePhoneNumber;
	
	
	
	

}
