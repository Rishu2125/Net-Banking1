package com.NeoBank.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Loan {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long loanId;
	private String loanRefrenceNumber;
	private BigDecimal loanAmount;
	private BigDecimal totalPayableAmount;
	private BigDecimal totalPaidAmount;
	private BigDecimal emi;
	private Integer duration;
	private Double intrestrate;
	private LocalDate approvedDate;
	private LocalDate nextEmiDate;
	 @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;
	
	private LocalDate endDate;
	@Enumerated(EnumType.STRING)
	private LoanStatus status;
	@Enumerated(EnumType.STRING)
	private LoanType loanType;
	

}
