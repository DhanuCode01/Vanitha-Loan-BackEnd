import express from "express";
import {  requestUser, LoginUser } from "../Controller/UserController.js";

const userRouter=express.Router();

userRouter.post("/",requestUser);
userRouter.post("/user",LoginUser);


export default userRouter;