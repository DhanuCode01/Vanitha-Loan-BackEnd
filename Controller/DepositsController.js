import pool from "../db.js";
import { isToken } from "../Validation/TokenValidation.js";

export async function addDeposits(req,res) {
    try{
        isToken(req,res);
        const data=req.body;
        const slipBuffer = Buffer.from(data.Slip); 

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // format: YYYY-MM-DD
        const currentTime = now.toTimeString().split(' ')[0]; // format: HH:MM:SS

        const year = now.getFullYear();           // e.g., 2025
        const month =  String(now.getMonth() + 1).padStart(2, '0'); // e.g., 07 (months are 0-indexed)

        let transactionsID=null;

        const Transaction=`SELECT DISTINCT(slip.auto_id),(slip.ID) FROM holcemlk_nanosoft_banker_mobile.slip;`;
        const [rows] = await pool.execute(Transaction);
        // Sort by ID descending and get the first record
        const lastRow = rows.sort((a, b) => b.ID.localeCompare(a.ID))[0]
        if (!lastRow){
                                transactionsID=`D${year}${month}${data.UserID}00001`
                                
        }else{
                                const lastTransactionsID=lastRow.ID //"D2025070600003"
                                const lastTransactionsFullNumberInString=lastTransactionsID.replace("D","");//"2025070600003"  (String)

                                
                                const yearMonth = lastTransactionsFullNumberInString.slice(0, 6); // "202507" // Extract the year + month (first 6 characters)
                                

                                if(yearMonth == `${year}${month}`){
                                    
                                    const lastTransactionsNumberInString = lastTransactionsFullNumberInString.slice(-5); // "00003" // Extract the last 5 digits (the running number)
                                    const lastTransactionsNumber=parseInt(lastTransactionsNumberInString);//00003   (Integer)
                                    const currentTransactionNumber=lastTransactionsNumber+1;    //3+1 (4)

                                    const formattedNumber=String(currentTransactionNumber).padStart(5, '0');//"00004"
                                    transactionsID=`D${year}${month}${data.UserID}${formattedNumber}`

                                }else{
                                    transactionsID=`D${year}${month}${data.UserID}00001`  
                                }

                                
        }

        const sql=`INSERT INTO slip (ID, date, CurrentDate, CurrentTime, NameOfAccountHolder, Slip, Total) VALUES (?, ?, ?, ?, ?, ?, ?) `;
        const values = [transactionsID, data.date, currentDate, currentTime, data.NameOfAccountHolder, slipBuffer, data.Total];
        await pool.execute(sql, values);

        for (let i = 0; i < data.AccountNumbers.length; i++) {
            const accountNumber = data.AccountNumbers[i];

            const sql1 = `
                UPDATE holcemlk_nanosoft_banker_mobile.mobile_loan_transactions
                SET slipID = ?
                WHERE UserID = ?
                AND TransactionDate = ?
                AND AccountNumber = ?;
            `;

            const values1 = [transactionsID, data.UserID, currentDate, accountNumber];//test 2025-07-31 change to currentdate
            await pool.execute(sql1, values1);
        }

        

        res.status(200).json({ message: "Saved Successfully ✔️"})
        return;


        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "Database connection unsuccessful ❓" });
        }
}
