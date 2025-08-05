import express from "express";
import { getMembers, getPaidDetails } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/all",getPaidDetails);
customerRouter.get("/:key",getMembers);


export default customerRouter;