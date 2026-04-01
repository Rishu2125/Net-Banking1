package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ValidatePinDto {
	private String pin;
	private String emailId;

}
