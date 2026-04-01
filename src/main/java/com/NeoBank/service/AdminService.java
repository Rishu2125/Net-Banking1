package com.NeoBank.service;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.ProfileManagementDto;
@Service
public interface AdminService {
	public ApplicationResponse approveLoan(String loanRefrenceNumber);
	public ApplicationResponse rejectLoanRequest(String loanRefrenceNumber);
	public ApplicationResponse getAllLoans();
	public ApplicationResponse deactivateActivateUser(String accountNumber);
	public ApplicationResponse checkUserBalance(String accountNumber);
	public ApplicationResponse findAllPendingLoan();
	public ApplicationResponse profileManagement(ProfileManagementDto dto,String accountNumber);

}
