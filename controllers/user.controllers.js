import {User}from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export {
    registerUser,
}