import express from "express";
import { getGroupMembers, getGroups, getPaidDetails, getSearchMembers } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/all",getPaidDetails);
customerRouter.post("/search/:key",getSearchMembers);
customerRouter.get("/group/:key",getGroups);
customerRouter.get("/member/:key",getGroupMembers);


export default customerRouter;