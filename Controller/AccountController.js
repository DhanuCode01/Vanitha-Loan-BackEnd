import pool from "../db.js";
import { isToken } from "../Validation/TokenValidation.js";

export async function getAccount(req,res) {
    try {

        isToken(req,res);
        const key=req.params.key; //get patameeter key


        //get all customerID     //Reason is the customer Division
        const CustomerIDQuery=`SELECT DISTINCT(customerinformation.CustomerID) FROM ledgerdetails INNER JOIN customerinformation ON (ledgerdetails.CustomerID = customerinformation.CustomerID) WHERE ledgerdetails.AccountStatus = 'ACTIVE' AND ledgerdetails.AccountType = 'L' ;`
        const [CustomerID] = await pool.execute(CustomerIDQuery);

        //check  the customers Details is loded
        if (CustomerID.length === 0) {
            res.status(402).json({error:"Try Again❗"});//connection Error
            return;
        }
        
            // Loop and match
            for (let i = 0; i < CustomerID.length; i++) {
            if (key === CustomerID[i].CustomerID) {
                            /* console.log(CustomerID[i].CustomerID);
                            console.log(key); */

                            const AccountQuery=  `SELECT l.AccountNumber AS ACCOUNT_NO, l.CustomerID AS CUS_ID, lc.LedgerName AS LEDGER_NAME, l.AccountBalance AS ACC_BAL, l.InterestAmount AS INTE_AMOUNT, l.PenaltyInterestAmount AS PENALTY_AMOUNT, l.FundAmount AS FUND_AMOUNT, l.LoanInstallment AS PAYABLE_INSTALLMENT, l.PassdueAmount AS PASTDUE_AMOUNT, l.LoanInstallment AS LOAN_INSTALLMENT, l.Period AS LOAN_PERIOD, l.OpenDate AS LOAN_ISSUED_DATE, l.AccountLastTransactionDate AS LAST_PAID FROM ledgerdetails l INNER JOIN ledgeraccounts lc ON (l.LedgerID = lc.LedgerID) WHERE l.AccountStatus = 'ACTIVE' AND l.AccountType = 'L' AND l.CustomerID = ?;`
                            const [AccountRows] = await pool.execute(AccountQuery, [key]);       
                    

                            if (AccountRows.length > 0) {
                                res.status(200).json({ AccountRows });
                                return;
                            }

                            res.status(400).json({ error: "NO Account Check Account ID‼️" });
                            return;

            
                        }
            }
            res.status(401).json({ error: "You are not authorized to perform this action. Please check the Account ID ‼️" });
            return;  


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
        
    
    
}

