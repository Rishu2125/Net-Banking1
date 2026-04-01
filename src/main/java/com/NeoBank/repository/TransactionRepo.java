package com.NeoBank.repository;




import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NeoBank.entities.Transaction;
@Repository
public interface TransactionRepo extends JpaRepository<Transaction, String> {
	 @Query("""
	            SELECT t FROM Transaction t
	            WHERE (t.senderAccountNumber = :accountNumber
	            OR t.receiverAccountNumber = :accountNumber)
	            AND t.createdAt BETWEEN :startDate AND :endDate
	            ORDER BY t.createdAt DESC
	            """)
	    List<Transaction> findTransactionsByAccountNumberAndDateRange(
	            String accountNumber,
	            LocalDateTime startDate,
	            LocalDateTime endDate
	    );

    
	 @Query("""
		       SELECT t FROM Transaction t
		       WHERE (t.senderAccountNumber = :accountNumber AND t.transactionType = 'debit')
		          OR (t.receiverAccountNumber = :accountNumber AND t.transactionType = 'credit')
		       ORDER BY t.createdAt DESC
		       """)
		Page<Transaction> getUserTransactions(String accountNumber,Pageable pageable);
    
    @Query(value =
            "SELECT COALESCE(SUM(amount),0) FROM transaction " +
            "WHERE sender_account_number = :accountNumber " +
            "AND DATE(created_at) = CURDATE()",
            nativeQuery = true)
    BigDecimal getTodayTransferAmount(String accountNumber);
    
    @Query("""
    		SELECT SUM(t.amount)
    		FROM Transaction t
    		WHERE t.senderAccountNumber = :accountNumber
    		AND MONTH(t.createdAt) = MONTH(CURRENT_DATE)
    		AND YEAR(t.createdAt) = YEAR(CURRENT_DATE)
    		""")
    		BigDecimal totalDebitCurrentMonth(String accountNumber);
    
    @Query("""
    		SELECT SUM(t.amount)
    		FROM Transaction t
    		WHERE t.receiverAccountNumber = :accountNumber
    		AND MONTH(t.createdAt) = MONTH(CURRENT_DATE)
    		AND YEAR(t.createdAt) = YEAR(CURRENT_DATE)
    		""")
    		BigDecimal totalCreditCurrentMonth(String accountNumber);
    
    
    @Query("""
            SELECT COALESCE(SUM(t.amount),0)
            FROM Transaction t
            WHERE t.senderAccountNumber = :account
            AND t.transactionType = 'DEBIT'
            AND t.createdAt BETWEEN :start AND :end
        """)
        BigDecimal getTodayDebit(
                @Param("account") String account,
                @Param("start") LocalDateTime start,
                @Param("end") LocalDateTime end
        );
    @Query("""
    	       SELECT t FROM Transaction t
    	       WHERE t.senderAccountNumber = :accountNumber
    	       ORDER BY t.createdAt DESC
    	       """)
    	List<Transaction> findDebits(String accountNumber);

    @Query("""
    	       SELECT t FROM Transaction t
    	       WHERE t.receiverAccountNumber = :accountNumber
    	       ORDER BY t.createdAt DESC
    	       """)
    	List<Transaction> findCredits(String accountNumber);
    
    
    
    
}