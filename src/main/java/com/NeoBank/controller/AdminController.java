package com.NeoBank.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PatchExchange;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.ProfileManagementDto;
import com.NeoBank.service.AdminService;
import com.NeoBank.service.TransactionService;
import com.NeoBank.service.UserService;


@RestController
@RequestMapping("/admin")
public class AdminController {
@Autowired
AdminService adminService;

@Autowired
UserService userService;
@Autowired
TransactionService transactionService;
	@PutMapping("/approve-loan/{loanRefrenceNumber}")
	public ApplicationResponse approveLoan(@PathVariable String loanRefrenceNumber)
	{
		return adminService.approveLoan(loanRefrenceNumber);
	}
	
	@DeleteMapping("/reject-loan")
	public ApplicationResponse rejectRequest(String loanRefrenceNumber)
	{
		return adminService.rejectLoanRequest(loanRefrenceNumber);
	}
	@GetMapping("/get-all-loans")
	public ApplicationResponse getAllLoans()
	{
		return adminService.getAllLoans();
	}
	
	@GetMapping("/get-all-user")
	public ApplicationResponse getAllUser()
	{
		return userService.getAllUser();
	}
	@GetMapping("/get-user/{accountNumber}")
	public ApplicationResponse getUserByAccountNumber(
	        @PathVariable String accountNumber)
	{
	    return userService.getUserByAccountNumber(accountNumber);
	}
	
	@PatchMapping("/deactivate-activate-user/{accountNumber}")
	public ApplicationResponse deactivateActivateUser(@PathVariable String accountNumber)
	{
		return adminService.deactivateActivateUser(accountNumber);
	}
	@GetMapping("/check-user-balance/{accountNumber}")
	public ApplicationResponse userBalanceEnquiry(@PathVariable String accountNumber)
	{
		return adminService.checkUserBalance(accountNumber);
	}
	
	@GetMapping("/all-pending-loans")
	public ApplicationResponse findAllPendingLoan()
	{
		return adminService.findAllPendingLoan();
	}
	
	@GetMapping("/get-user-transaction")
	public ApplicationResponse getAllTransactions(@RequestParam   (defaultValue="0") int  page,@RequestParam  (defaultValue="10") int size)
	{
		return transactionService.getAllTransactions(page, size);
	}
	@PatchMapping("/update-user/{accountNumber}")
	public ApplicationResponse profileManagement(@RequestBody ProfileManagementDto dto,@PathVariable String accountNumber)
	{
		return adminService.profileManagement(dto, accountNumber);
		
	}
	

}
