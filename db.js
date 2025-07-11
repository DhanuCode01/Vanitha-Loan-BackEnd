import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: '209.133.220.90',
  user: 'holcemlk_mobile',
  password: process.env.db_password,
  database: 'holcemlk_nanosoft_banker_mobile',
  port: 3306,
  charset: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// ✅ Check connection
async function checkMySQLConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connection is OK");
    connection.release(); // always release back to pool
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
}

checkMySQLConnection();

export default pool;
