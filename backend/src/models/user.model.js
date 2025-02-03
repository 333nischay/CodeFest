import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true ,lowercase:true,trim:true},
    password: { type: String},
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    refreshToken: { type: String }, 
    workSpace : [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkSpace" }],
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    if(this.isModified("otp") && this.otp){
        this.otp = await bcrypt.hash(this.otp, 10);
    }
    next()
})

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.checkOTP = async function(otp){
     return await bcrypt.compare(otp, this.otp);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);