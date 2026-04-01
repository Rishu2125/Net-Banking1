package com.NeoBank.service;


import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.EmailDto;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class EmailServiceImpl implements EmailService{
	@Value("${spring.mail.username}")
	private String senderEmail;
	
	private JavaMailSender javaMailSender;
	 public EmailServiceImpl(JavaMailSender javaMailSender) {
	        this.javaMailSender = javaMailSender;
	    }

	@Override
	public void sendEmailAlert(EmailDto dto) {
		SimpleMailMessage mailMessage=new SimpleMailMessage();
		mailMessage.setFrom(senderEmail);
		mailMessage.setTo(dto.getRecipient());
		mailMessage.setSubject(dto.getSubject());
		mailMessage.setText(dto.getMessageBody());
		javaMailSender.send(mailMessage);
		
		
	}

	@Override
	public void sendEmailAlertWithAttachment(EmailDto dto) {
		MimeMessage mimeMessage=javaMailSender.createMimeMessage();
		MimeMessageHelper mimeMessageHelper;
		try {
			mimeMessageHelper=new MimeMessageHelper(mimeMessage,true);
			mimeMessageHelper.setFrom(senderEmail);
			mimeMessageHelper.setTo(dto.getRecipient());
			mimeMessageHelper.setText(dto.getMessageBody());
			mimeMessageHelper.setSubject(dto.getSubject());
			
			
			
			FileSystemResource file=new FileSystemResource(new File(dto.getAttachment()));
			mimeMessageHelper.addAttachment(file.getFilename(), file);
			javaMailSender.send(mimeMessage);
			
			
			//log.info(file.getFilename() +"has been sent to user with email"+ dto.getRecipient());
		} catch (MessagingException e) {
			
			e.printStackTrace();
		}
		
		
		
	
		
	}

}
