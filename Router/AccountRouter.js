import express from "express";
import { getAccount } from "../Controller/AccountController.js";

const accountRouter=express.Router();

accountRouter.get("/:key",getAccount);

export default accountRouter;