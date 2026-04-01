package com.NeoBank.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.NeoBank.dto.AccountEnquiryDto;
import com.NeoBank.dto.AccountInfo;
import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.CreditDebitRequest;
import com.NeoBank.dto.EmailDto;
import com.NeoBank.dto.LoanResponseDto;
import com.NeoBank.dto.LoginDto;
import com.NeoBank.dto.LoginResponseDto;
import com.NeoBank.dto.ProfileDto;
import com.NeoBank.dto.RegisterDto;
import com.NeoBank.dto.ResetPasswordDto;
import com.NeoBank.dto.TransactionDto;
import com.NeoBank.dto.TransferDto;
import com.NeoBank.dto.UserDto;
import com.NeoBank.dto.ValidatePinDto;
import com.NeoBank.entities.Bank;
import com.NeoBank.entities.Loan;
import com.NeoBank.entities.LoanStatus;
import com.NeoBank.entities.Role;
import com.NeoBank.entities.Status;
import com.NeoBank.entities.TransactionStatus;
import com.NeoBank.entities.TransactionType;
import com.NeoBank.entities.User;
import com.NeoBank.repository.BankRepo;
import com.NeoBank.repository.LoanRepo;
import com.NeoBank.repository.TransactionRepo;
import com.NeoBank.repository.UserRepository;
import com.NeoBank.utils.AccountUtils;
import com.NeoBank.utils.AdminUtils;
import com.NeoBank.utils.LoanUtils;
import com.NeoBank.utils.TransactionUtil;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private LoanRepo loanRepo;

    @Autowired
    private BankRepo bankRepo;

    @Autowired
    private TransactionService transactionService;

    // ----------------------------------------------------------------------------------------------------------------------
    // register
    @Override
    public ApplicationResponse register(RegisterDto dto) {
        if (repository.existsByAadhaarNumber(dto.getAadhaarNumber())
                && repository.existsByEmailId(dto.getEmailId())) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_EXIST_MESSAGE)
                    .build();
        }

        String accountNumber = AccountUtils.generateAccountNumber();
        String accountPin = AccountUtils.generatePin();

        User newUser = User.builder()
                .aadhaarNumber(dto.getAadhaarNumber())
                .accountNumber(accountNumber)
                .accountBalance(BigDecimal.valueOf(2000))
                .accountLocked(false)
                .city(dto.getCity())
                .address(dto.getAddress())
                .deactivated(false)
                .emailId(dto.getEmailId())
                .alternatePhoneNumber(dto.getAlternatePhoneNumber())
                .failedAttempt(0)
                .phoneNumber(dto.getPhoneNumber())
                .password(encoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastname())
                .middleName(dto.getMiddleName())
                .gender(dto.getGender())
                .lockTime(null)
                .state(dto.getState())
                .role(Role.ROLE_USER)
                .panNumber(dto.getPanNumber())
                .status(Status.active)
                .pin(encoder.encode(accountPin))
                .build();

        repository.save(newUser);

        EmailDto emailDto = EmailDto.builder()
                .messageBody("Your Account has been created and your account number is "
                        + accountNumber + " and your pin is " + accountPin)
                .recipient(dto.getEmailId())
                .subject("Account Created")
                .build();

        emailService.sendEmailAlert(emailDto);

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREATION_SUCCESS_CODE)
                .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
                .build();
    }

    // -----------------------------------------------------------------------------------------------------------------------
    @Override
    public ApplicationResponse login(LoginDto dto) {

        User user = repository.findByEmailId(dto.getEmailId());

        if (user == null || user.isDeactivated()) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (user.isAccountLocked()) {
            LocalDateTime unlockTime = user.getLockTime().plusMinutes(15);
            if (unlockTime.isAfter(LocalDateTime.now())) {
                return ApplicationResponse.builder()
                        .responseCode(AccountUtils.ACCOUNT_IS_LOCKED)
                        .responseMessage(AccountUtils.ACCOUNT_LOCKED_MESSAGE)
                        .build();
            } else {
                user.setAccountLocked(false);
                user.setFailedAttempt(0);
                user.setLockTime(null);
                repository.save(user);
            }
        }

        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            int attempts = user.getFailedAttempt() + 1;
            user.setFailedAttempt(attempts);

            if (attempts >= 3 && !user.isAccountLocked()) {
                user.setAccountLocked(true);
                user.setLockTime(LocalDateTime.now());
            }

            repository.save(user);

            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        user.setFailedAttempt(0);
        user.setAccountLocked(false);
        user.setLockTime(null);
        repository.save(user);

        LoginResponseDto loginResponse = LoginResponseDto.builder()
                .accountNumber(user.getAccountNumber())
                .aadhaarNumber(user.getAadhaarNumber())
                .emailId(user.getEmailId())
                .role(user.getRole().name())
                .fullName(user.getFirstName() +" "+ user.getLastName())
                .build();

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_LOGGED_IN_SUCCESSFULLY)
                .responseMessage(AccountUtils.ACCOUNT_LOGGED_IN_SUCCESSFULLY_MESSAGE)
                .data(loginResponse)
                .build();
    }

    // ------------------------------------------------------------------------------------------------------------------
    // profile
    @Override
    public ApplicationResponse profile(String emailId) {
        User user = repository.findByEmailId(emailId);

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        ProfileDto profile = ProfileDto.builder()
                .accountNumber(user.getAccountNumber())
                .address(user.getAddress())
                .alternatePhoneNumber(user.getAlternatePhoneNumber())
                .city(user.getCity())
                .emailId(user.getEmailId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .middleName(user.getMiddleName())
                .gender(user.getGender())
                .state(user.getState())
                .phoneNumber(user.getPhoneNumber())
                .build();

        return ApplicationResponse.builder()
                .responseCode("033")
                .responseMessage("Profile Fetched Successfully")
                .data(profile)
                .build();
    }

    // ------------------------------------------------------------------------------------------------------------------------
    // reset pin
    public ApplicationResponse resetPin(ResetPasswordDto dto) {

        User user = repository.findByAccountNumber(dto.getAccountNumber());

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        user.setPin(encoder.encode(dto.getNewPin()));
        repository.save(user);

        EmailDto emailDto = EmailDto.builder()
                .recipient(user.getEmailId())
                .messageBody("Your pin changed for account: " + user.getAccountNumber())
                .subject("Pin Changed")
                .build();

        emailService.sendEmailAlert(emailDto);

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.DATA_UPDATED_SUCCESSFULLY_CODE)
                .responseMessage(AccountUtils.DATA_UPDATED_SUCCESSFULLY_MESSAGE)
                .build();
    }

    // --------------------------------------------------------------------------------------------------------------------------
    // validate pin
    public ApplicationResponse validatePin(ValidatePinDto dto) {
        User user = repository.findByEmailId(dto.getEmailId());

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (!encoder.matches(dto.getPin(), user.getPin())) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INVALID_CREDINTIALS_CODE)
                    .responseMessage(AccountUtils.INVALID_CREDINTIALS_CODE_MESSAGE)
                    .build();
        }

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.PIN_VEREFIED_CODE)
                .responseMessage(AccountUtils.PIN_VEREFIED_MESSAGE)
                .build();
    }

    // ---------------------------------------------------------------------------------------------------------------------------
    // check balance
    @Override
    public ApplicationResponse checkBalance(AccountEnquiryDto accountEnquiryDto) {
        User user = repository.findByAccountNumber(accountEnquiryDto.getAccountNumber());

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (!encoder.matches(accountEnquiryDto.getPin(), user.getPin())) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INVALID_CREDINTIALS_CODE)
                    .responseMessage(AccountUtils.INVALID_CREDINTIALS_CODE_MESSAGE)
                    .build();
        }

        AccountInfo accountInfo = AccountInfo.builder()
                .accountBalance(user.getAccountBalance())
                .build();

        return ApplicationResponse.builder()
                .data(accountInfo)
                .responseCode(AccountUtils.BALANCE_FETCHED_SUCCESSFULLY_CODE)
                .responseMessage(AccountUtils.BALANCE_FETCHED_SUCCESSFULLY_MESSAGE)
                .build();
    }

    // --------------------------------------------------------------------------------------------------------------------------
    // transfer money
    @Override
    @Transactional
    public ApplicationResponse transferMoney(TransferDto dto) {

        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_AMOUNT_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_AMOUNT_MESSAGE)
                    .build();
        }

        if (dto.getSenderAccountNumber().equals(dto.getReceiverAccountNumber())) {
            return ApplicationResponse.builder()
                    .responseCode("99")
                    .responseMessage("Sender and Receiver cannot be same")
                    .build();
        }

        User userToDebit = repository.findByAccountNumber(dto.getSenderAccountNumber());

        if (userToDebit == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.DEBIT_ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.DEBIT_ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (userToDebit.isAccountLocked() || userToDebit.isDeactivated()) {
            return ApplicationResponse.builder()
                    .responseCode("98")
                    .responseMessage("Account is locked or deactivated")
                    .build();
        }

        if (!encoder.matches(dto.getPin(), userToDebit.getPin())) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INVALID_CREDINTIALS_CODE)
                    .responseMessage(AccountUtils.INVALID_CREDINTIALS_CODE_MESSAGE)
                    .build();
        }

        User userToCredit = repository.findByAccountNumber(dto.getReceiverAccountNumber());

        if (userToCredit == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.CREDIT_ACCOUNT_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.CREDIT_ACCOUNT_NOT_EXIST_MESSAGE)
                    .build();
        }

        BigDecimal todayTransferredAmount =
                transactionRepo.getTodayTransferAmount(dto.getSenderAccountNumber());

        if (todayTransferredAmount == null) {
            todayTransferredAmount = BigDecimal.ZERO;
        }

        BigDecimal newTodayTransferredAmount = todayTransferredAmount.add(dto.getAmount());

        if (newTodayTransferredAmount.compareTo(TransactionUtil.DAILY_TRANSFER_LIMIT) > 0) {
            return ApplicationResponse.builder()
                    .responseCode(TransactionUtil.DAILY_TRANSFERRED_LIMIT_REACHED_CODE)
                    .responseMessage(TransactionUtil.DAILY_TRANSFERRED_LIMIT_REACHED_MESSAGE)
                    .build();
        }

        if (userToDebit.getAccountBalance().compareTo(dto.getAmount()) < 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .build();
        }

        userToDebit.setAccountBalance(userToDebit.getAccountBalance().subtract(dto.getAmount()));
        userToCredit.setAccountBalance(userToCredit.getAccountBalance().add(dto.getAmount()));

        repository.save(userToDebit);
        repository.save(userToCredit);

        TransactionDto senderTransaction = TransactionDto.builder()
                .amount(dto.getAmount())
                .senderAccountNumber(userToDebit.getAccountNumber())
                .receiverAccountNumber(userToCredit.getAccountNumber())
                .transactionType(TransactionType.debit)
                .status(TransactionStatus.Success)
                .build();

        TransactionDto receiverTransaction = TransactionDto.builder()
                .amount(dto.getAmount())
                .senderAccountNumber(userToDebit.getAccountNumber())
                .receiverAccountNumber(userToCredit.getAccountNumber())
                .transactionType(TransactionType.credit)
                .status(TransactionStatus.Success)
                .build();

        transactionService.saveTransaction(senderTransaction);
        transactionService.saveTransaction(receiverTransaction);

        EmailDto senderEmail = EmailDto.builder()
                .recipient(userToDebit.getEmailId())
                .subject("Account Debited")
                .messageBody("Your Account " + userToDebit.getAccountNumber() + " debited Rs " + dto.getAmount())
                .build();

        EmailDto receiverEmail = EmailDto.builder()
                .recipient(userToCredit.getEmailId())
                .subject("Account Credited")
                .messageBody("Your Account " + userToCredit.getAccountNumber() + " credited Rs " + dto.getAmount())
                .build();

        emailService.sendEmailAlert(senderEmail);
        emailService.sendEmailAlert(receiverEmail);

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.TRANSFER_SUCCESSFUL_CODE)
                .responseMessage(AccountUtils.TRANSFER_SUCCESSFUL_MESSAGE)
                .build();
    }

    // ---------------------------------------------------------------------------------------------------------------------------
    // debit
    @Override
    public ApplicationResponse debitAccount(CreditDebitRequest request) {

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_AMOUNT_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_AMOUNT_MESSAGE)
                    .build();
        }

        User userToDebit = repository.findByAccountNumber(request.getSenderAccountNumber());

        if (userToDebit == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (userToDebit.getAccountBalance() == null
                || userToDebit.getAccountBalance().compareTo(request.getAmount()) < 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .build();
        }

        userToDebit.setAccountBalance(userToDebit.getAccountBalance().subtract(request.getAmount()));
        repository.save(userToDebit);

        TransactionDto transactionDto = TransactionDto.builder()
                .senderAccountNumber(userToDebit.getAccountNumber())
                .receiverAccountNumber(request.getReceiverAccountNumber())
                .amount(request.getAmount())
                .transactionType(TransactionType.debit)
                .status(TransactionStatus.Success)
                .build();

        transactionService.saveTransaction(transactionDto);

        EmailDto emaildetails = EmailDto.builder()
                .recipient(userToDebit.getEmailId())
                .subject("Money Debited")
                .messageBody("Money Debited from your account: " + request.getAmount())
                .build();

        emailService.sendEmailAlert(emaildetails);

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_DEBITED_CODE)
                .responseMessage(AccountUtils.ACCOUNT_DEBITED_MESSAGE)
                .build();
    }

    // ---------------------------------------------------------------------------------------------------------------------------
    // credit
    @Override
    public ApplicationResponse creditAccount(CreditDebitRequest request) {

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_AMOUNT_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_AMOUNT_MESSAGE)
                    .build();
        }

        // ================= BANK CREDIT =================
        if (request.getReceiverAccountNumber().equals(AdminUtils.BANK_ACCOUNT_NUMBER)) {

            Bank bank = bankRepo.findByBankAccountNumber(AdminUtils.BANK_ACCOUNT_NUMBER);

            if (bank == null) {
                return ApplicationResponse.builder()
                        .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                        .responseMessage("Bank account not found")
                        .build();
            }

            BigDecimal currentBalance = bank.getBalance() == null
                    ? BigDecimal.ZERO
                    : bank.getBalance();

            BigDecimal currentLoanReceived = bank.getTotalLoanReceived() == null
                    ? BigDecimal.ZERO
                    : bank.getTotalLoanReceived();

            bank.setBalance(currentBalance.add(request.getAmount()));
            bank.setTotalLoanReceived(currentLoanReceived.add(request.getAmount()));

            bankRepo.save(bank);

            TransactionDto bankTransaction = TransactionDto.builder()
                    .receiverAccountNumber(request.getReceiverAccountNumber())
                    .senderAccountNumber(request.getSenderAccountNumber())
                    .amount(request.getAmount())
                    .transactionType(TransactionType.credit)
                    .status(TransactionStatus.Success)
                    .build();

            transactionService.saveTransaction(bankTransaction);

            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_CREDITED_CODE)
                    .responseMessage("Bank Credited")
                    .build();
        }

        // ================= USER CREDIT =================
        User userToCredit = repository.findByAccountNumber(request.getReceiverAccountNumber());

        if (userToCredit == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        BigDecimal currentBalance = userToCredit.getAccountBalance() == null
                ? BigDecimal.ZERO
                : userToCredit.getAccountBalance();

        userToCredit.setAccountBalance(currentBalance.add(request.getAmount()));
        repository.save(userToCredit);

        TransactionDto userTransaction = TransactionDto.builder()
                .receiverAccountNumber(userToCredit.getAccountNumber())
                .senderAccountNumber(request.getSenderAccountNumber())
                .amount(request.getAmount())
                .transactionType(TransactionType.credit)
                .status(TransactionStatus.Success)
                .build();

        transactionService.saveTransaction(userTransaction);

        EmailDto emaildetails = EmailDto.builder()
                .recipient(userToCredit.getEmailId())
                .subject("Money Credited")
                .messageBody("Money Credited : " + request.getAmount())
                .build();

        emailService.sendEmailAlert(emaildetails);

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREDITED_CODE)
                .responseMessage(AccountUtils.ACCOUNT_CREDITED_MESSAGE)
                .build();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    ///// VALIDATE PIN
    @Override
    public boolean validatePin(String pin, String accountNumber) {
        User user = repository.findByAccountNumber(accountNumber);
        if (user == null) {
            return false;
        }
        return encoder.matches(pin, user.getPin());
    }

    // ========================================================================================================
    // FIND USER LOAN BY ACCOUNT NUMBER
    @Override
    public ApplicationResponse userLoan(String accountNumber) {

        User user = repository.findByAccountNumber(accountNumber);

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        Long userId = user.getId();
        List<Loan> loanList =loanRepo.findByUserIdAndStatusNot(userId, LoanStatus.COMPLETED);

        if (loanList.isEmpty()) {
            return ApplicationResponse.builder()
                    .responseCode(LoanUtils.LOAN_NOT_FOUND)
                    .responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
                    .data(List.of())
                    .build();
        }

        List<LoanResponseDto> dtoList = loanList.stream()
                .map(l -> LoanResponseDto.builder()
                        .loanRefrenceNumber(l.getLoanRefrenceNumber())
                        .loanAmount(l.getLoanAmount())
                        .emi(l.getEmi())
                        .duration(l.getDuration())
                        .intrestrate(l.getIntrestrate())
                        .nextEmiDate(l.getNextEmiDate())
                        .endDate(l.getEndDate())
                        .totalPayableAmount(l.getTotalPayableAmount())
                        .build())
                .toList();

        return ApplicationResponse.builder()
                .data(dtoList)
                .responseCode(LoanUtils.LOAN_FETCHED_CODE)
                .responseMessage(LoanUtils.LOAN_FETCHED_MESSAGE)
                .build();
    }

    public ApplicationResponse getAllUser() {

        List<User> users = repository.findAll();

        if (users == null || users.isEmpty()) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.NO_USER_FOUND)
                    .responseMessage(AccountUtils.NO_USER_FOUND_MESSAGE)
                    .build();
        }

        List<UserDto> userDtos = users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.USER_FETCHED_CODE)
                .responseMessage(AccountUtils.USER_FECTHED_MESSAGE)
                .data(userDtos)
                .build();
    }

    private UserDto convertToDto(User u) {

        String status;
        if (u.getStatus() != null) {
            status = u.getStatus().name();
        } else {
            status = "UNKNOWN";
        }

        return UserDto.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .middleName(u.getMiddleName())
                .lastName(u.getLastName())
                .emailId(u.getEmailId())
                .phoneNumber(u.getPhoneNumber())
                .city(u.getCity())
                .state(u.getState())
                .accountNumber(u.getAccountNumber())
                .accountBalance(u.getAccountBalance())
                .role(u.getRole() != null ? u.getRole().name() : null)
                .status(status)
                .accountLocked(u.isAccountLocked())
                .build();
    }

    @Override
    public ApplicationResponse getUserByAccountNumber(String accountNumber) {
        User user = repository.findByAccountNumber(accountNumber);

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        UserDto dto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .emailId(user.getEmailId())
                .phoneNumber(user.getPhoneNumber())
                .city(user.getCity())
                .state(user.getState())
                .accountNumber(user.getAccountNumber())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : "UNKNOWN")
                .accountLocked(user.isAccountLocked())
                .build();

        return ApplicationResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_FOUND_CODE)
                .responseMessage(AccountUtils.ACCOUNT_FOUND_MESSAGE)
                .data(dto)
                .build();
    }

    // =====================================================================================================
    // PAY EMI
    @Override
    @Transactional
    public ApplicationResponse payEmi(String loanRefrenceNumber) {

        Loan loan = loanRepo.findByLoanRefrenceNumber(loanRefrenceNumber);

        if (loan == null) {
            return ApplicationResponse.builder()
                    .responseCode(LoanUtils.LOAN_NOT_FOUND)
                    .responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
                    .build();
        }

        User user = loan.getUser();

        if (loan.getStatus() == LoanStatus.COMPLETED) {
            return ApplicationResponse.builder()
                    .responseCode(LoanUtils.LOAN_COMPLETED)
                    .responseMessage(LoanUtils.LOAN_COMPLETED_MESSAGE)
                    .build();
        }

        BigDecimal emi = loan.getEmi();

        if (emi == null || emi.compareTo(BigDecimal.ZERO) <= 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_AMOUNT_CODE)
                    .responseMessage("Invalid EMI amount")
                    .build();
        }

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        if (user.getAccountBalance() == null || emi.compareTo(user.getAccountBalance()) > 0) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_AMOUNT_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_AMOUNT_MESSAGE)
                    .build();
        }

        Bank bank = bankRepo.findByBankAccountNumber(AdminUtils.BANK_ACCOUNT_NUMBER);

        if (bank == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage("Bank account not found")
                    .build();
        }

        CreditDebitRequest debitRequest = CreditDebitRequest.builder()
                .senderAccountNumber(user.getAccountNumber())
                .receiverAccountNumber(bank.getBankAccountNumber())
                .amount(emi)
                .build();

        ApplicationResponse debitResponse = debitAccount(debitRequest);
        if (!AccountUtils.ACCOUNT_DEBITED_CODE.equals(debitResponse.getResponseCode())) {
            return debitResponse;
        }

        CreditDebitRequest creditRequest = CreditDebitRequest.builder()
                .receiverAccountNumber(bank.getBankAccountNumber())
                .senderAccountNumber(user.getAccountNumber())
                .amount(emi)
                .build();

        ApplicationResponse creditResponse = creditAccount(creditRequest);
        if (!AccountUtils.ACCOUNT_CREDITED_CODE.equals(creditResponse.getResponseCode())) {
            throw new RuntimeException("Credit failed after debit");
        }

        BigDecimal totalPaidAmount = loan.getTotalPaidAmount() == null
                ? BigDecimal.ZERO
                : loan.getTotalPaidAmount();

        BigDecimal totalPayableAmount = loan.getTotalPayableAmount() == null
                ? BigDecimal.ZERO
                : loan.getTotalPayableAmount();

        loan.setTotalPaidAmount(totalPaidAmount.add(emi));
        loan.setTotalPayableAmount(totalPayableAmount.subtract(emi));

        if (loan.getNextEmiDate() != null) {
            loan.setNextEmiDate(loan.getNextEmiDate().plusMonths(1));
        }

        if (loan.getTotalPayableAmount().compareTo(BigDecimal.ZERO) <= 0) {
            loan.setStatus(LoanStatus.COMPLETED);
            loan.setTotalPayableAmount(BigDecimal.ZERO);
        }

        loanRepo.save(loan);

        return ApplicationResponse.builder()
                .responseCode(LoanUtils.EMI_PAID_CODE_SUCCESSFULLY)
                .responseMessage(LoanUtils.EMI_PAID_MESSAGE_SUCCESSFULLY)
                .build();
    }

    @Override
    public ApplicationResponse getLoanByRefrenceNumber(String refrenceNumber) {
        Loan loan = loanRepo.findByLoanRefrenceNumber(refrenceNumber);

        if (loan == null) {
            return ApplicationResponse.builder()
                    .responseCode(LoanUtils.LOAN_NOT_FOUND)
                    .responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
                    .build();
        }

        return ApplicationResponse.builder()
                .data(loan)
                .responseCode(LoanUtils.LOAN_FETCHED_CODE)
                .responseMessage(LoanUtils.LOAN_FETCHED_MESSAGE)
                .build();
    }

	@Override
	public ApplicationResponse getUserLoanHistory(String accountNumber) {
		// TODO Auto-generated method stub
		User user = repository.findByAccountNumber(accountNumber);

        if (user == null) {
            return ApplicationResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_DOES_NOT_EXIST_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_DOES_NOT_EXIST_MESSAGE)
                    .build();
        }

        Long userId = user.getId();
        List<Loan> loanList =loanRepo.findByUserIdAndStatus(userId, LoanStatus.COMPLETED);

        if (loanList.isEmpty()) {
            return ApplicationResponse.builder()
                    .responseCode(LoanUtils.LOAN_NOT_FOUND)
                    .responseMessage(LoanUtils.LOAN_NOT_FOUND_MESSAGE)
                    .data(List.of())
                    .build();
        }

        List<LoanResponseDto> dtoList = loanList.stream()
                .map(l -> LoanResponseDto.builder()
                        .loanRefrenceNumber(l.getLoanRefrenceNumber())
                        .loanAmount(l.getLoanAmount())
                        .emi(l.getEmi())
                        .duration(l.getDuration())
                        .intrestrate(l.getIntrestrate())
                        .totalPaidAmount(l.getTotalPaidAmount())
                        .endDate(l.getEndDate())
                        .approvedDate(l.getApprovedDate())
                        .build())
                .toList();

        return ApplicationResponse.builder()
                .data(dtoList)
                .responseCode(LoanUtils.LOAN_FETCHED_CODE)
                .responseMessage(LoanUtils.LOAN_FETCHED_MESSAGE)
                .build();
		
	}
}