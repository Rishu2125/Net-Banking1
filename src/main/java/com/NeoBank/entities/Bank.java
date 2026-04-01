package com.NeoBank.entities;

import java.math.BigDecimal;

import org.springframework.context.annotation.Scope;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity

public class Bank {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String bankEmailId;
	private BigDecimal balance;
	private BigDecimal totalLoanGiven=BigDecimal.ZERO;
	private BigDecimal totalLoanReceived=BigDecimal.ZERO;
	private BigDecimal fdDeposited=BigDecimal.ZERO;
	private BigDecimal fdWithdrawl=BigDecimal.ZERO;
	private String bankAccountNumber;
	
	

}
