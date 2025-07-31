import pool from "../db.js";
import { isToken } from "../Validation/TokenValidation.js";

export async function setInstallment(req,res) {
    try{
        isToken(req,res);
        const data=req.body;

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // format: YYYY-MM-DD
        const currentTime = now.toTimeString().split(' ')[0]; // format: HH:MM:SS

        const year = now.getFullYear();           // e.g., 2025
        const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., 07 (months are 0-indexed)


        let transactionsID=null;

        const Transaction=`SELECT DISTINCT(mobile_loan_transactions.UserID),(mobile_loan_transactions.ID) FROM holcemlk_nanosoft_banker_mobile.mobile_loan_transactions`;
        const [rows] = await pool.execute(Transaction);
        // Sort by ID descending and get the first record
        const lastRow = rows.sort((a, b) => b.ID.localeCompare(a.ID))[0]
        if (!lastRow){
                                transactionsID=`MR${year}${month}${data.UserID}00001`
                                
        }else{
                                const lastTransactionsID=lastRow.ID //"MR2025070600003"
                                const lastTransactionsFullNumberInString=lastTransactionsID.replace("MR","");//"2025070600003"  (String)
                                const lastTransactionsNumberInString = lastTransactionsFullNumberInString.slice(-5); // "00003" // Extract the last 5 digits (the running number)
                                const lastTransactionsNumber=parseInt(lastTransactionsNumberInString);//00003   (Integer)
                                const currentTransactionNumber=lastTransactionsNumber+1;    //3+1 (4)

                                const formattedNumber=String(currentTransactionNumber).padStart(5, '0');//"00004"
                                transactionsID=`MR${year}${month}${data.UserID}${formattedNumber}`
        }




        const sql=`INSERT INTO mobile_loan_transactions (ID, AccountNumber, CustomerID, TransactionDate, TransactionTime, DebitAmount, CreditAmount, UserName, UserID, DeviceId, EntryType, Description) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?) `;
        const values = [transactionsID, data.AccountNumber, data.CustomerID, currentDate, currentTime, data.DebitAmount, data.CreditAmount, data.UserName, data.UserID, data.DeviceId, data.EntryType, data.Description];
        await pool.execute(sql, values);

        res.status(200).json({ message: "saved successfully"})
        return;


        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "Database connection unsuccessful ❓" });
        }
}