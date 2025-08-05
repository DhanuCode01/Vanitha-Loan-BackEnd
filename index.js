import express from "express";
import userRouter from "./Router/UserRouter.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import customerRouter from "./Router/CustomerRouter.js";
import accountRouter from "./Router/AccountRouter.js";
import InstallmentRouter from "./Router/InstallmentRouter.js";

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors());
app.use(bodyParser.json());

//  JWT Middleware
app.use((req, res, next) => {
  let token = req.header("Authorization"); // Read Authorization header

  if (token != null) {
    token = token.replace("Bearer ", ""); // Remove "Bearer " prefix

    //  FIXED: Corrected environment variable name
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded; // Attach decoded token to request
      }
    });
  }

  next(); // Proceed to next middleware/route
});

//  Route definitions
app.use("/api/user", userRouter);
app.use("/api/customer", customerRouter);
app.use("/api/account", accountRouter);
app.use("/api/installment", InstallmentRouter);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
