package com.NeoBank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.NeoBank.entities.Role;
import com.NeoBank.entities.Status;
import com.NeoBank.entities.User;
import com.NeoBank.repository.UserRepository;

import jakarta.annotation.PostConstruct;
@Component
public class AdminInitializer {
	@Autowired
	private UserRepository repository;
	@Autowired
	private PasswordEncoder encoder;
	@PostConstruct
	public void createAdmin() {
	    if (repository.findByEmailId("admin@neobank.com") == null) {

	        User admin = new User();
	        admin.setEmailId("admin@neobank.com");
	        admin.setPassword(encoder.encode("admin123"));
	        admin.setRole(Role.ROLE_ADMIN);
	        admin.setAadhaarNumber("XXXX XXXX XXXX");
	        admin.setStatus(Status.active);
	        

	        repository.save(admin);

	        System.out.println("Default Admin Created");
	    }
	}


}
