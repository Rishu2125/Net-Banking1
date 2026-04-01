package com.NeoBank.entities;

import java.math.BigDecimal;
import java.time.LocalDate;


import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class FixedDeposit {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String refrenceNumber;
	private BigDecimal amount;
	private Integer duration;
	@CreationTimestamp
	private LocalDate startDate;
	private LocalDate maturityDate;
	private double intrestRate;
	private BigDecimal amountWithdrawl;
	private LocalDate withdrawlDate;
	private Status status;
	private BigDecimal maturityAmount;
	 @ManyToOne
	 @JsonBackReference
	    @JoinColumn(name = "user_id")
	    private User user;
	
	

}
