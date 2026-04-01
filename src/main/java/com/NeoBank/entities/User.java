package com.NeoBank.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String firstName;
	private String middleName;
	private String lastName;
	private String emailId;
	private String password;
	
	private String aadhaarNumber;
	@CreationTimestamp
	private LocalDateTime creationTime;
	private String state;
	private String address;
	private String city;
	private String gender;
	
	private String accountNumber;
	private boolean accountLocked;
	private boolean deactivated;

	private String panNumber;
	private int failedAttempt;
	private LocalDateTime lockTime;
	@UpdateTimestamp
	private LocalDateTime modifiedAt;
	
	private Status status;
	private BigDecimal accountBalance;
	
	private String phoneNumber;
	
	private String alternatePhoneNumber;
	
	private Role role;
	private String pin;
	@Version
	
	private Long version;
	@JsonManagedReference
	@OneToMany(mappedBy = "user")
	private List<FixedDeposit> fixedDeposits;
	
	public String otp;
	
	@OneToMany(mappedBy="user")
	private List<Transaction> transaction;
	
	@JsonIgnore
	@OneToMany(mappedBy = "user")
	private List<Loan> loan;
	
	
	
	

}
