package com.NeoBank.service;

import org.springframework.stereotype.Service;

import com.NeoBank.dto.EmailDto;
@Service
public interface EmailService {
void sendEmailAlert(EmailDto dto);
void sendEmailAlertWithAttachment(EmailDto dto);

}
