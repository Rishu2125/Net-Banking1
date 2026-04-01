package com.NeoBank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter 
@Builder

public class ApplicationResponse {
   private String responseCode;
	private  String responseMessage;
	private Object data;
	
	
	

}
