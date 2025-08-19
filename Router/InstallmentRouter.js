import express from "express";
import { ConformReEnter, setInstallment } from "../Controller/InstallmentController.js";


const InstallmentRouter=express.Router();

InstallmentRouter.post("/",setInstallment);
InstallmentRouter.get("/",ConformReEnter);

export default InstallmentRouter;