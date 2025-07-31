import express from "express";
import userRouter from "./Router/UserRouter.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"
import jwt from "jsonwebtoken"; 
import customerRouter from "./Router/CustomerRouter.js";
import accountRouter from "./Router/AccountRouter.js";
import InstallmentRouter from "./Router/InstallmentRouter.js";


dotenv.config();

const app=express();
app.use(cors());
app.use(bodyParser.json());

app.use((req,res,next)=>{
    
    let token=req.header  //midleware webtoken reading
    ("Authorization")
    
     if (token!=null){
        token=token.replace("Bearer ","") //"Bearer" Skip this word  
        jwt.verify(token,process.env.jwt_SECRET,
            (err,decoded)=>{                //get error or decoded value
                if(!err){
                    req.user=decoded;      //assign reqest user to decoded value  
                }
            }
        )
     }
     next() 
 
})  
  



app.use("/api/user",userRouter);
app.use("/api/customer",customerRouter);
app.use("/api/account",accountRouter);
app.use("/api/installment",InstallmentRouter);



    app.listen(3002,()=>{
        console.log("Server port 3002 is running ")})
   
 