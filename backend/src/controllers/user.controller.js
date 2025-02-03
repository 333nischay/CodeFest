import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { sendMail } from "../utils/sendMail.js";
import {jwtDecode} from "jwt-decode";
const register = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if([name,password,email].some((field)=>field?.trim === "")){
        throw new ApiError(400,"All fields are required")
    }
    const existed = await User.findOne({email});
    if(existed && existed.isVerified){
        throw new ApiError(400,"User already exists")
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    let id = null;
    if(!existed){
        const user = await User.create({name,email,password,otp, isVerified: false});
    
    await user.save();
    id = user._id;
    }
    else{
        existed.name = name;
        existed.password = password;
        existed.otp = otp;
        existed.isVerified = false;
        await existed.save();
        id = existed._id
    }
    const rootFolder = await Folder.create({name:"root",userId:id});
    if(!rootFolder){
        throw new ApiError(500,"Failed to create root folder")
    }
    console.log(rootFolder);
    await rootFolder.save();
    const mailHtml = `Your OTP is ${otp}`;
    try {
        await sendMail(email,"OTP for verification",mailHtml);
    } catch (error) {
        throw new ApiError(500,error.message);
        
    }
    return res.json(new ApiResponse(200,{message:"User registered successfully"}))



});
const verifyOtpRegistration = asynchandler(async (req, res) => {
    const {email, otp } = req.body;
    if([email,otp].some((field)=>field?.trim === "")){
        throw new ApiError(400,"All fields are required")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400,"User not found")
    }
    if(!await user.checkOTP(otp)){
        throw new ApiError(400,"Invalid OTP")
    };
    user.isVerified = true;
    user.otp = null;
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const options={
        httpOnly:true,secure:true}
    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,{accessToken,refreshToken,user},"Login successful"))

});
const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if([email,password].some((field)=>field?.trim === "")){
        throw new ApiError(400,"All fields are required")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400,"User not found")
    }
    if(!await user.checkPassword(password)){
        throw new ApiError(400,"Invalid password")
    };
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const options={
        httpOnly:true,secure:true}
    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,{accessToken,refreshToken,user},"Login successful"))
});
const logOut = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    user.refreshToken = null;
    await user.save()


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
});
const refreshAccessToken = asynchandler( async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!refreshToken){
        throw new ApiError(401,"Unauthorized Access")
    }
    const decoded = jwtDecode(refreshToken)
    if(!decoded){
        throw new ApiError(401,"Unauthorized Access")
    }
    const user = await User.findById(decoded._id)
    if(!user){
        throw new ApiError(401,"User Not Registered")
    }
    if(user.refreshToken !== refreshToken){
        throw new ApiError(401,"Refresh Token Expired")
    }
    const accessToken = await user.generateAccessToken()
    const newRefreshToken = await user.generateRefreshToken()
    user.refreshToken = newRefreshToken
    await user.save()
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newRefreshToken,options).json(new ApiResponse(200,{accessToken},"Token refreshed"))
});

const getWorkSpace = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("workSpace");
    if(!user){
        throw new ApiError(404,"User not found")
    }
    return res.json(new ApiResponse(200,{workSpaces:user.workSpace}));
});
const forgotPassword = asynchandler(async (req, res) => {  
    const { email } = req.body;
    if(!email){
        throw new ApiError(400,"Email is required")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
    const mailHtml = `Your OTP is ${otp}`;
    try {
        await sendMail(email,"OTP for verification",mailHtml);
    } catch (error) {
        throw new ApiError(500,error.message);
        
    }
    return res.json(new ApiResponse(200,{message:"OTP sent successfully"}))
});
const verifyForgotPassword = asynchandler(async (req, res) => {
    const {email, otp ,password} = req.body;
    if([email,otp,password].some((field)=>field?.trim === "")){
        throw new ApiError(400,"All fields are required")
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400,"User not found")
    }
    if(!await user.checkOTP(otp)){
        throw new ApiError(400,"Invalid OTP")
    };
    user.otp = null;
    user.password = password;
    await user.save();
    return res.json(new ApiResponse(200,{message:"OTP verified successfully"}))
});

export { register,verifyOtpRegistration,login,logOut,refreshAccessToken ,getWorkSpace,forgotPassword,verifyForgotPassword}