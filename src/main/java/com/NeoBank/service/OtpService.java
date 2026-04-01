package com.NeoBank.service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;



@Service
public class OtpService {


    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private final int OTP_EXPIRY_MINUTES = 2;

    // Generate OTP 
    public String generateOtp(String accountNumber) {
    	
        String otp = String.format("%06d", new Random().nextInt(999999));
        String redisKey = "OTP:" + accountNumber;

       
        redisTemplate.opsForValue().set(redisKey, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);

       
        System.out.println("OTP for " + accountNumber + ": " + otp);

        return otp;
    }

   
    public boolean validateOtp(String accountNumber, String inputOtp) {
        String redisKey = "OTP:" + accountNumber;
        String correctOtp = redisTemplate.opsForValue().get(redisKey);

        if (correctOtp != null && correctOtp.equals(inputOtp)) {
            redisTemplate.delete(redisKey); 
            return true;
        }
        return false;
    }
}