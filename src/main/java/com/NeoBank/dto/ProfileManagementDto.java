package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileManagementDto {
	private String firstName;
	private String middleName;
	private String lastName;
	private String emailId;
	private String state;
	private String address;
	private String city;
	private String gender;
	private String panNumber;
	private String phoneNumber;
	
	private String alternatePhoneNumber;

}
