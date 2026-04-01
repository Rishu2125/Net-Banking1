package com.NeoBank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NeoBank.entities.FixedDeposit;
import com.NeoBank.entities.Status;
import com.NeoBank.entities.User;
@Repository
public interface FixedDepositRepo extends JpaRepository<FixedDeposit, Long> {
	FixedDeposit findByUserAndStatus(User user, Status status);
	FixedDeposit findByRefrenceNumber(String refrenceNumber);
	List<FixedDeposit> findByUser(User user);

}
