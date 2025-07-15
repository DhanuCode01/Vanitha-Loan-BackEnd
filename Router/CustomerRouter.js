import express from "express";
import { getMembers } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/:key",getMembers);

export default customerRouter;