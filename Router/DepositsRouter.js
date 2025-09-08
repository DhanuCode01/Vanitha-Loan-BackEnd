import express from "express";
import { addDeposits } from "../Controller/DepositsController.js";


const depositsRouter=express.Router();

depositsRouter.post("/",addDeposits);

export default depositsRouter;