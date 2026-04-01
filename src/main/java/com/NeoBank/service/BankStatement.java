package com.NeoBank.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.NeoBank.dto.ApplicationResponse;
import com.NeoBank.dto.EmailDto;
import com.NeoBank.entities.Transaction;
import com.NeoBank.entities.User;
import com.NeoBank.repository.TransactionRepo;
import com.NeoBank.repository.UserRepository;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

@Service
@RequiredArgsConstructor
public class BankStatement {

    private final TransactionRepo transactionRepo;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<Transaction> generateStatement(String accountNumber,
                                               String startDate,
                                               String endDate) throws Exception {

        // Convert String → LocalDateTime
        LocalDateTime start = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE).atTime(23, 59, 59);

        // Fetch transactions
        List<Transaction> transactions =
                transactionRepo.findTransactionsByAccountNumberAndDateRange(accountNumber, start, end);

        // Fetch user
        User user = userRepository.findByAccountNumber(accountNumber);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String customerName = user.getFirstName() + " " + user.getLastName();

        String filePath = System.getProperty("java.io.tmpdir")
                + File.separator + "statement_" + accountNumber + ".pdf";

        // ---------------- PDF GENERATION ----------------

        Rectangle statementSize = new Rectangle(PageSize.A4);
        Document document = new Document(statementSize);

        OutputStream outputStream = new FileOutputStream(filePath);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // -------- HEADER --------

        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);

        PdfPCell headerCell = new PdfPCell(
                new Phrase("🏦 NEO BANK\nACCOUNT STATEMENT",
                        new com.itextpdf.text.Font(
                                com.itextpdf.text.Font.FontFamily.HELVETICA,
                                18,
                                com.itextpdf.text.Font.BOLD,
                                BaseColor.WHITE)));

        headerCell.setBackgroundColor(new BaseColor(0, 102, 204));
        headerCell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
        headerCell.setPadding(20f);
        headerCell.setBorder(0);

        headerTable.addCell(headerCell);
        document.add(headerTable);

        // -------- CUSTOMER INFO --------

        PdfPTable customerTable = new PdfPTable(2);  
        customerTable.setSpacingBefore(15f);
        customerTable.setWidthPercentage(100);

        customerTable.addCell(getCell("Customer Name:", PdfPCell.ALIGN_LEFT, true));
        customerTable.addCell(getCell(customerName, PdfPCell.ALIGN_LEFT, false));

        customerTable.addCell(getCell("Account Number:", PdfPCell.ALIGN_LEFT, true));
        customerTable.addCell(getCell(accountNumber, PdfPCell.ALIGN_LEFT, false));

        customerTable.addCell(getCell("Address:", PdfPCell.ALIGN_LEFT, true));
        customerTable.addCell(getCell(user.getAddress(), PdfPCell.ALIGN_LEFT, false));

        customerTable.addCell(getCell("Period:", PdfPCell.ALIGN_LEFT, true));
        customerTable.addCell(getCell(startDate + " to " + endDate, PdfPCell.ALIGN_LEFT, false));

        document.add(customerTable);

        // -------- TRANSACTION TABLE --------

        PdfPTable transactionsTable = new PdfPTable(4);
        transactionsTable.setSpacingBefore(20f);
        transactionsTable.setWidthPercentage(100);
        transactionsTable.setWidths(new float[]{3, 3, 2, 2});

        transactionsTable.addCell(getHeaderCell("Date"));
        transactionsTable.addCell(getHeaderCell("Transaction Type"));
        transactionsTable.addCell(getHeaderCell("Amount"));
        transactionsTable.addCell(getHeaderCell("Status"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        if (transactions.isEmpty()) {

            PdfPCell cell = new PdfPCell(new Phrase("No transactions found"));
            cell.setColspan(4);
            cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            transactionsTable.addCell(cell);

        } else {

            boolean alternate = false;

            for (Transaction t : transactions) {

                BaseColor rowColor = alternate
                        ? new BaseColor(230, 240, 255)
                        : BaseColor.WHITE;

                transactionsTable.addCell(
                        getColoredCell(t.getCreatedAt().format(formatter), rowColor));

                transactionsTable.addCell(
                        getColoredCell(t.getTransactionType().toString(), rowColor));

                transactionsTable.addCell(
                        getColoredCell(t.getAmount().toString(), rowColor));

                transactionsTable.addCell(
                        getColoredCell(t.getStatus().toString(), rowColor));

                alternate = !alternate;
            }
        }

        document.add(transactionsTable);

        // -------- FOOTER --------

        PdfPTable footerTable = new PdfPTable(1);
        footerTable.setSpacingBefore(30f);
        footerTable.setWidthPercentage(100);

        PdfPCell footerCell = new PdfPCell(
                new Phrase("Statement generated on: "
                        + LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))));

        footerCell.setBorder(0);
        footerCell.setHorizontalAlignment(PdfPCell.ALIGN_RIGHT);
        footerCell.setPadding(10f);

        footerTable.addCell(footerCell);
        document.add(footerTable);

        document.close();
        outputStream.close();

        // -------- EMAIL --------

        EmailDto emailDetails = EmailDto.builder()
                .recipient(user.getEmailId())
                .subject("Your Bank Statement")
                .messageBody("Dear " + user.getFirstName()
                        + ",\n\nPlease find attached your bank statement.")
                .attachment(filePath)
                .build();

        emailService.sendEmailAlertWithAttachment(emailDetails);

        return transactions;
    }

    // -------- HELPER METHODS --------

    private PdfPCell getCell(String text, int alignment, boolean bold) {

        com.itextpdf.text.Font font =
                new com.itextpdf.text.Font(
                        com.itextpdf.text.Font.FontFamily.HELVETICA,
                        bold ? 12 : 11,
                        bold ? com.itextpdf.text.Font.BOLD
                                : com.itextpdf.text.Font.NORMAL);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(0);
        cell.setPadding(5f);
        cell.setHorizontalAlignment(alignment);

        return cell;
    }

    private PdfPCell getHeaderCell(String text) {

        com.itextpdf.text.Font font =
                new com.itextpdf.text.Font(
                        com.itextpdf.text.Font.FontFamily.HELVETICA,
                        12,
                        com.itextpdf.text.Font.BOLD,
                        BaseColor.WHITE);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(new BaseColor(0, 102, 204));
        cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
        cell.setPadding(8f);

        return cell;
    }

    private PdfPCell getColoredCell(String text, BaseColor bgColor) {

        PdfPCell cell =
                new PdfPCell(new Phrase(
                        text,
                        new com.itextpdf.text.Font(
                                com.itextpdf.text.Font.FontFamily.HELVETICA, 11)));

        cell.setBackgroundColor(bgColor);
        cell.setPadding(6f);

        return cell;
    }
    //-------------------------------------------------------------------------------------------------------------------------
    public ApplicationResponse allTransactions(String accountNumber,int page,int size)
    {
    	Pageable pageable=PageRequest.of(page, size);
    	
    	User user=userRepository.findByAccountNumber(accountNumber);
    	if(user==null)
    	{
    		 throw new RuntimeException("User not found");
    	}
    Page<Transaction> transactions=transactionRepo.getUserTransactions(accountNumber,pageable);
    	return ApplicationResponse.builder()
    			.responseMessage("Transaction found successfully")
    			.responseMessage("432")
    			.data(transactions)
    			.build();
    	
    	
    	
    	
    
    	
    }
}