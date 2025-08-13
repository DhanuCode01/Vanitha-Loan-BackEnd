import express from "express";
import { getMembers, getPaidDetails, getSearchMembers } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/all",getPaidDetails);
customerRouter.post("/search/:key",getSearchMembers);
customerRouter.get("/:key",getMembers);


export default customerRouter;