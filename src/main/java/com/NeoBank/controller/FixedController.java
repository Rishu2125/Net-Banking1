package com.NeoBank.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.FixedDepositDto;
import com.NeoBank.dto.WithDrawFdDto;
import com.NeoBank.service.FixedDepositService;

  @RequestMapping("/fd")
  @RestController
public class FixedController {
	  @Autowired
	  private FixedDepositService depositService;
	  @PostMapping("/create")
	  public ApplicationResponse createFd(@RequestBody FixedDepositDto depositDto)
	  {
		  return depositService.fixDeposit(depositDto);
	  }
	  @PatchMapping("/withdraw-fd")
	  public ApplicationResponse withdrawFd(@RequestBody WithDrawFdDto drawFdDto)
	  {
		  return depositService.withdrawFd(drawFdDto);
	  }
	  @GetMapping("/get-user-fd/{accountNumber}")
	  public ApplicationResponse fetchUserFd(@PathVariable String accountNumber)
	  {
		  return depositService.userFd(accountNumber);
	  }
	  
	

}
