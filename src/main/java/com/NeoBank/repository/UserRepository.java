package com.NeoBank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NeoBank.entities.User;
@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
	boolean existsByAadhaarNumber(String aadhaarNumber);
	boolean existsByEmailId(String emailId);
	User findByEmailId(String emailId);
	User findByAadhaarNumber(String aadhaarNumber);
	User findByAccountNumber(String accountNumber);
	boolean existsByAccountNumber(String accountNumber);
	

}
