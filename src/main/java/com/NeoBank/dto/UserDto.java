package com.NeoBank.dto;



import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {

    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;

    private String emailId;
    private String phoneNumber;

    private String city;
    private String state;

    private String accountNumber;
    private BigDecimal accountBalance;

    private String role;
    private String status;

    private boolean accountLocked;
}