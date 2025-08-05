import dotenv from "dotenv"
import jwt  from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import pool from "../db.js"; // Import MySQL database connection


dotenv.config();


export async function requestUser(req, res) {
    
    const {
        UserID, UserFullName, UserFullNameSI, UserName, UserPassword, MobilePassword,
        Device_id, device_status, bank_code, UserRole, PermissionLevel, LastLoginDate,
        UserStatus, LogStatus, LoginFrom, Photo, UserType, FeildOfficerTargetAccounts,
        FieldOfficerTargetAmount, MaxWithdrawalAmount, tellerReceivedCash, tellerIssuedCash,
        last_ReceiptNo, last_VoucherNo, last_JournalNo, last_ReverseEntryNo, last_PettyCashNo,
        Legacy, PasswordExpire, PasswordUpdatedDate, CurrentPasswordUnchangedDays,
        web_password, web_portal_status, fo_cashbook_id, mobile_no, mobile_otp
      } = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = bcrypt.hashSync(web_password, 10);
        console.log(hashedPassword)
       

        // SQL Query
        const sql = `INSERT INTO systemusers (
            UserID, UserFullName, UserFullNameSI, UserName, UserPassword, MobilePassword,
            Device_id, device_status, bank_code, UserRole, PermissionLevel, LastLoginDate,
            UserStatus, LogStatus, LoginFrom, Photo, UserType, FeildOfficerTargetAccounts,
            FieldOfficerTargetAmount, MaxWithdrawalAmount, tellerReceivedCash, tellerIssuedCash,
            last_ReceiptNo, last_VoucherNo, last_JournalNo, last_ReverseEntryNo, last_PettyCashNo,
            Legacy, PasswordExpire, PasswordUpdatedDate, CurrentPasswordUnchangedDays,
            web_password, web_portal_status, fo_cashbook_id, mobile_no, mobile_otp
                                        ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        

                                        const values = [
                                            UserID,
                                            UserFullName,
                                            UserFullNameSI,
                                            UserName,
                                            UserPassword,             
                                            MobilePassword,
                                            Device_id,
                                            device_status,
                                            bank_code,
                                            UserRole,
                                            PermissionLevel,
                                            LastLoginDate,
                                            UserStatus,
                                            LogStatus,
                                            LoginFrom,
                                            Photo,
                                            UserType,
                                            FeildOfficerTargetAccounts,
                                            FieldOfficerTargetAmount,
                                            MaxWithdrawalAmount,
                                            tellerReceivedCash,
                                            tellerIssuedCash,
                                            last_ReceiptNo,
                                            last_VoucherNo,
                                            last_JournalNo,
                                            last_ReverseEntryNo,
                                            last_PettyCashNo,
                                            Legacy,
                                            PasswordExpire,
                                            PasswordUpdatedDate,
                                            CurrentPasswordUnchangedDays,
                                            hashedPassword,
                                            web_portal_status,
                                            fo_cashbook_id,
                                            mobile_no,
                                            mobile_otp
                                          ];
                                          
                                          
        // Execute query
        await pool.execute(sql, values);

        res.status(200).json({
            message: "User Saved Successfully",
            
        });

    } catch (error) {

        console.error("Database error:", error);
        res.status(500).json({ error: "User Save Unsuccessful" });
    }
}




 
export async function LoginUser(req, res) {
    const { UserFullName, password } = req.body;

    try {
        // Query the database for the user by fullName
        const sql = "SELECT * FROM systemusers WHERE UserFullName = ?";
        const [rows] = await pool.execute(sql, [UserFullName]);

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0]; // Get the first (and only) user

        const data={                                                //Create array and Assaing 
                        key:rows[0].key,
                        PermissionLevel:rows[0].PermissionLevel,
                        UserName:rows[0].UserName,
                        UserID:rows[0].UserID,
                        Device_id:rows[0].Device_id
                    }
        

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = bcrypt.compareSync(password, user.web_password);
        
       
        if (isPasswordCorrect) {
            // Generate JWT token with user details
            const token = jwt.sign(
                {
                    UserFullName: user.UserFullName,
                    device_status: user.device_status,
                    UserRole: user.UserRole,
                    type: user.type,
                    PermissionLevel: user.PermissionLevel,
                    UserStatus: user.UserStatus,
                    LogStatus:user.LogStatus,
                    UserType:user.UserType
                },
                process.env.JWT_SECRET, // Make sure this is set in your .env file
                /* { expiresIn: "2h" }  */// Token expires in 2 hours
            );

            res.json({ success: "Login Successfully", token: token,data:data });

        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
 
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error });
    }
}
 
