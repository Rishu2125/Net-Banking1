package com.NeoBank.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;



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




@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String transactionId;
	@Enumerated(EnumType.STRING)
	private TransactionType transactionType;
	private BigDecimal amount;
	private String senderAccountNumber;
	private String receiverAccountNumber;
	@Enumerated(EnumType.STRING)
    private TransactionStatus status;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    


}
