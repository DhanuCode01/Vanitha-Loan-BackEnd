import pool from "../db.js";
import { isToken } from "../Validation/TokenValidation.js";

export async function getAccount(req,res) {
    try {

        isToken(req,res);;

        const key=req.params.key;
        const groupQuery=  `SELECT l.AccountNumber AS ACCOUNT_NO, l.CustomerID AS CUS_ID, lc.LedgerName AS LEDGER_NAME, l.AccountBalance AS ACC_BAL, l.InterestAmount AS INTE_AMOUNT, l.PenaltyInterestAmount AS PENALTY_AMOUNT, l.FundAmount AS FUND_AMOUNT, l.LoanInstallment AS PAYABLE_INSTALLMENT, l.PassdueAmount AS PASTDUE_AMOUNT, l.LoanInstallment AS LOAN_INSTALLMENT, l.Period AS LOAN_PERIOD, l.OpenDate AS LOAN_ISSUED_DATE, l.AccountLastTransactionDate AS LAST_PAID FROM ledgerdetails l INNER JOIN ledgeraccounts lc ON (l.LedgerID = lc.LedgerID) WHERE l.AccountStatus = 'ACTIVE' AND l.AccountType = 'L' AND l.CustomerID = ?;`
        const [groupRows] = await pool.execute(groupQuery, [key]);       
        

        if (groupRows.length > 0) {
            res.status(200).json({ groupRows });
            return;
        }

        res.status(400).json({ error: "NO Account Check Account ID‼️" });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
        
    
    
}