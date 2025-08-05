import express from "express";
import { setInstallment } from "../Controller/InstallmentController.js";


const InstallmentRouter=express.Router();

InstallmentRouter.post("/",setInstallment);

export default InstallmentRouter;