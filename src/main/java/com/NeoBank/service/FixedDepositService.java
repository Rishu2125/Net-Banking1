package com.NeoBank.service;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.FixedDepositDto;
import com.NeoBank.dto.WithDrawFdDto;
@Service
public interface FixedDepositService {
	public ApplicationResponse fixDeposit(FixedDepositDto depositDto);
	public ApplicationResponse withdrawFd(WithDrawFdDto drawFdDto);
	public ApplicationResponse userFd(String accountNumber);
	

}
