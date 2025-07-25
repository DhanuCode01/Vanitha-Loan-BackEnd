import express from "express";
import { getMembers, getOnlyNames } from "../Controller/CustomerController.js";

const customerRouter=express.Router();

customerRouter.get("/:key",getMembers);
customerRouter.get("/name/:key",getOnlyNames);

export default customerRouter;