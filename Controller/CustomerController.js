import pool from "../db.js";
import { isToken } from "../Validation/TokenValidation.js";

export async function getGroups(req,res) {
    try {

        isToken(req,res);;

        const key=req.params.key;
        const groupQuery = `SELECT DISTINCT(customergroup.GroupCode),
                            UPPER(customergroup.GroupName) AS GROUP_NAME
                            FROM customergroup
                            WHERE customergroup.UserID='-' 
                            AND customergroup.GroupType='S'
                            AND customergroup.GroupCode < '00013'
                            AND customergroup.GroupCode  <> '00006'
                            AND customergroup.GroupCode  <> '00008'; 
                            `;  //testing      //customergroup.UserID='[key]'
        const [groupRows] = await pool.execute(groupQuery);  //test key value ,these tow values are used testing prpose
               
        

        if (groupRows.length > 0) {
            res.status(200).json({ groupRows });
            return;
        }

        res.status(400).json({ error: "NO GROUP‼️" });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
}



export async function getGroupMembers(req,res) {
    try {

        isToken(req,res);;

        const key=req.params.key;
        const SearchQuery = `
            SELECT DISTINCT(customerinformation.CustomerID),
                   UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                   UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                   IFNULL(customerinformation.NIC,'-') AS NIC,
                   IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                   IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
            FROM ledgerdetails
            INNER JOIN customerinformation
                    ON ledgerdetails.CustomerID = customerinformation.CustomerID
            WHERE ledgerdetails.AccountStatus = 'ACTIVE'
              AND ledgerdetails.AccountType = 'L'
              AND customerinformation.SubGroupCode = ?;
        `;
        
        const [SearchRows] = await pool.execute(SearchQuery,[key] );
        

        if (SearchRows.length > 0) {
            res.status(200).json({ SearchRows });
            return;
        }

        res.status(400).json({ error: "NO Member Check Again‼️" });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
}




export async function getSearchGroupMembers(req, res) {
    try {
        isToken(req, res);

        const data = req.body;
        const groupCode=req.body.groupCode;
        

        const key = req.params.key;
        

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "No Data Try Again‼️" });
        }

        const params = [`%${data.data}%`];

        let allResults = [];



                            // 1️ Try CustomerName
                            const SearchQuery1 = `
                                SELECT DISTINCT(customerinformation.CustomerID),
                                    UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                                    UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                                    IFNULL(customerinformation.NIC,'-') AS NIC,
                                    IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                                    IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
                                FROM ledgerdetails
                                INNER JOIN customerinformation
                                        ON ledgerdetails.CustomerID = customerinformation.CustomerID
                                WHERE ledgerdetails.AccountStatus = 'ACTIVE'
                                AND ledgerdetails.AccountType = 'L'
                                AND customerinformation.SubGroupCode = ?
                                AND customerinformation.CustomerName LIKE ?;
                            `;
                            //test key value ,these tow values are used testing prpose
                            // const groupQuery=  `SELECT DISTINCT(customerinformation.CustomerID), UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME, UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS, IFNULL(customerinformation.NIC,'-') AS NIC, IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo FROM ledgerdetails INNER JOIN customerinformation ON (ledgerdetails.CustomerID = customerinformation.CustomerID) WHERE ledgerdetails.AccountStatus = 'ACTIVE' AND ledgerdetails.AccountType = 'L' AND customerinformation.CustomerName LIKE ? AND customerinformation.RelatedUserID = ?;`
                            //const [groupRows] = await pool.execute(groupQuery, [key]); 
                            const [SearchRows1] = await pool.execute(SearchQuery1, [groupCode, ...params]);
                            allResults.push(...SearchRows1);

                            // 2️ Try CustomerID
                            const SearchQuery2 = `
                                SELECT DISTINCT(customerinformation.CustomerID),
                                    UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                                    UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                                    IFNULL(customerinformation.NIC,'-') AS NIC,
                                    IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                                    IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
                                FROM ledgerdetails
                                INNER JOIN customerinformation
                                        ON ledgerdetails.CustomerID = customerinformation.CustomerID
                                WHERE ledgerdetails.AccountStatus = 'ACTIVE'
                                AND ledgerdetails.AccountType = 'L'
                                AND customerinformation.SubGroupCode = ?
                                AND customerinformation.CustomerID LIKE ?;
                            `;
                            const [SearchRows2] = await pool.execute(SearchQuery2, [groupCode, ...params]);
                            allResults.push(...SearchRows2);

                            // 3️ Try NIC
                            const SearchQuery3 = `
                                SELECT DISTINCT(customerinformation.CustomerID),
                                    UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                                    UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                                    IFNULL(customerinformation.NIC,'-') AS NIC,
                                    IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                                    IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
                                FROM ledgerdetails
                                INNER JOIN customerinformation
                                        ON ledgerdetails.CustomerID = customerinformation.CustomerID
                                WHERE ledgerdetails.AccountStatus = 'ACTIVE'
                                AND ledgerdetails.AccountType = 'L'
                                AND customerinformation.SubGroupCode = ?
                                AND customerinformation.NIC LIKE ?;
                            `;
                            const [SearchRows3] = await pool.execute(SearchQuery3, [groupCode, ...params]);
                            allResults.push(...SearchRows3);

                             // 🔹 Remove duplicates by CustomerID
        const uniqueResults = Array.from(
            new Map(allResults.map(item => [item.CustomerID, item])).values()
        );

        if (uniqueResults.length > 0) {
            return res.status(200).json({ SearchRows: uniqueResults });
        }

        return res.status(401).json({ error: "NO Member Check Again‼️" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
}

 


export async function getSearchMembers(req, res) {
    try {
        isToken(req, res);

        const data = req.body;
        const key = req.params.key;
        

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "No Data Try Again‼️" });
        }

        const params = [`%${data.data}%`];
        let allResults = [];

        // 1️ Try CustomerName
        const SearchQuery1 = `
            SELECT DISTINCT(customerinformation.CustomerID),
                   UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                   UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                   IFNULL(customerinformation.NIC,'-') AS NIC,
                   IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                   IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
            FROM ledgerdetails
            INNER JOIN customerinformation
                    ON ledgerdetails.CustomerID = customerinformation.CustomerID
            WHERE ledgerdetails.AccountStatus = 'ACTIVE'
              AND ledgerdetails.AccountType = 'L'
              AND customerinformation.CustomerName LIKE ?;
        `;
        //test key value ,these tow values are used testing prpose
        /* const groupQuery=  `SELECT DISTINCT(customerinformation.CustomerID), UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME, UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS, IFNULL(customerinformation.NIC,'-') AS NIC, IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo FROM ledgerdetails INNER JOIN customerinformation ON (ledgerdetails.CustomerID = customerinformation.CustomerID) WHERE ledgerdetails.AccountStatus = 'ACTIVE' AND ledgerdetails.AccountType = 'L' AND customerinformation.CustomerName LIKE ? AND customerinformation.RelatedUserID = ?;`
        const [groupRows] = await pool.execute(groupQuery, [key]); */
        const [SearchRows1] = await pool.execute(SearchQuery1, params);
        allResults.push(...SearchRows1);

        // 2️ Try CustomerID
        const SearchQuery2 = `
            SELECT DISTINCT(customerinformation.CustomerID),
                   UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                   UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                   IFNULL(customerinformation.NIC,'-') AS NIC,
                   IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                   IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
            FROM ledgerdetails
            INNER JOIN customerinformation
                    ON ledgerdetails.CustomerID = customerinformation.CustomerID
            WHERE ledgerdetails.AccountStatus = 'ACTIVE'
              AND ledgerdetails.AccountType = 'L'
              AND customerinformation.CustomerID LIKE ?;
        `;
        const [SearchRows2] = await pool.execute(SearchQuery2, params);
        allResults.push(...SearchRows2);

        // 3️ Try NIC
        const SearchQuery3 = `
            SELECT DISTINCT(customerinformation.CustomerID),
                   UPPER(customerinformation.CustomerName) AS CUSTOMER_NAME,
                   UPPER(customerinformation.CustomerAddress) AS CUSTOMER_ADDRESS,
                   IFNULL(customerinformation.NIC,'-') AS NIC,
                   IFNULL(customerinformation.PersonnalMobileNo,'-') AS PersonnalMobileNo,
                   IFNULL(customerinformation.PersonnalTelephoneNo,'-') AS PersonnalTelephoneNo
            FROM ledgerdetails
            INNER JOIN customerinformation
                    ON ledgerdetails.CustomerID = customerinformation.CustomerID
            WHERE ledgerdetails.AccountStatus = 'ACTIVE'
              AND ledgerdetails.AccountType = 'L'
              AND customerinformation.NIC LIKE ?;
        `;
        const [SearchRows3] = await pool.execute(SearchQuery3, params);
        allResults.push(...SearchRows3);

        // 🔹 Remove duplicates by CustomerID
        const uniqueResults = Array.from(
            new Map(allResults.map(item => [item.CustomerID, item])).values()
        );

        if (uniqueResults.length > 0) {
            return res.status(200).json({ SearchRows: uniqueResults });
        }

        return res.status(401).json({ error: "NO Member Check Again‼️" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
}


export async function getPaidDetails(req,res) {
    try {
        
        const UserID = req.params.key;
        isToken(req,res);

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // format: YYYY-MM-DD
        


        const Query = `SELECT  AccountNumber, CustomerID , TransactionDate, TransactionTime, DebitAmount,CreditAmount FROM mobile_loan_transactions WHERE TransactionDate = ? AND slipID IS NULL AND UserID=? ;`; 
        //used for testing  add [AND UserID=?] 
        const [Rows] = await pool.execute(Query,["2025-09-07",UserID]);        
        

        if (Rows.length > 0) {
            res.status(200).json({ Rows });
            return;
        }
 
       res.status(400).json({ Message: "NO Installment Today ❓" });
        return 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection unsuccessful ❓" });
    }
        
    
}