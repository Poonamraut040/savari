import {User}from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BlacklistToken } from "../model/blacklisttoken.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname; // Destructure fullname object here

    // Check if all fields are filled
    if (
        !firstname?.trim() || 
        !lastname?.trim() ||  // Make sure lastname is checked too
        !email?.trim() || 
        !password?.trim()
    )
       {
        throw new ApiError(400, "All field is required");
    }
    //check if owner already existed by email
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(409, "USER ALREADY EXISTED")
    }

    const hashedPassword = await User.hashedPassword(password);

    // create new User

    const user = await User.create({
        fullname: { firstname, lastname }, 
        email,
        password: hashedPassword
    });

    const createdUser = await User.findById(user._id).select("-password")

    //check if user created or not in db
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
    }

    const token = createdUser.generateAuthToken();

    //return success response
    res.status(201).json(
        new ApiResponse(201, {token, createdUser}, " user registered successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    if(!email && !password){
        throw new ApiError(400,"email and password is required");
    }

    const user = await User.findOne({email}).select( '+password')

    if(!user){
        throw new ApiError(404," user does not exist or inavlid username or password ")
    }

    const loggedUser = await User.findById(user._id).select("+password")


    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"invalid password is types")
    }
    const token = loggedUser.generateAuthToken();
    
    const options = {
        httpOnly: true,
        secure: true
    }


    return res
    .status(200)
    .cookie("token", token)
    .json(
        new ApiResponse(200,{token, user: loggedUser}, "user logged in successfully")
    )

})

const getUserProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "current user fetched successfully")
    )
})

const logoutUser = asyncHandler(async(req,res, next) => {

    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","")   //check if the client requesting have cookies or not

    await BlacklistToken.create({token}); // we create the token as blacklist now we will check in auth middleware that if logout user are trying to access

    return res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, {},"Owner logged out successfully"))

})

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
}