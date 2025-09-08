import express from "express";
import { getGroupMembers, getGroups, getPaidDetails, getSearchGroupMembers, getSearchMembers } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/all/:key",getPaidDetails);
customerRouter.post("/search/:key",getSearchMembers);
customerRouter.post("/search/group/:key",getSearchGroupMembers);
customerRouter.get("/group/:key",getGroups);
customerRouter.get("/member/:key",getGroupMembers);


export default customerRouter;