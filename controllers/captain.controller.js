import { Captain } from "../model/captain.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BlacklistToken } from "../model/blacklisttoken.model.js";


const registerCaptain = asyncHandler(async (req, res) => {
    const { fullname, email, password, vehicle} = req.body;
    const { firstname, lastname } = fullname; // Destructure fullname object here
    const {color,plate,capacity,VehicleType} = vehicle;
    // Check if all fields are filled
    if (
        !firstname?.trim() || 
        !lastname?.trim() ||  // Make sure lastname is checked too
        !email?.trim() || 
        !password?.trim()||
        !color?.trim()||
        !plate?.trim()||
        !capacity === undefined||
        !VehicleType?.trim()

    )
       {
        throw new ApiError(400, "All field is required");
    }
    //check if owner already existed by email
    const existedCaptain = await Captain.findOne({email});
    if(existedCaptain){
        throw new ApiError(409, "Captain ALREADY EXISTED")
    }

    const hashedPassword = await Captain.hashedPassword(password);

    // create new User

    const captain = await Captain.create({
        fullname: { firstname, lastname }, 
        email,
        password: hashedPassword,
        vehicle:{
            color,
            plate,
            capacity,
            VehicleType
        }
    });

    const createdCaptain = await Captain.findById(captain._id)

    //check if user created or not in db
    if(!createdCaptain){
        throw new ApiError(500,"something went wrong while registering user")
    }

    const token = createdCaptain.generateAuthToken();

    //return success response
    res.status(201).json(
        new ApiResponse(201, {token, createdCaptain}, " captain registered successfully")
    )
})
const loginCaptain = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    if(!email && !password){
        throw new ApiError(400,"email and password is required");
    }

    const captain = await Captain.findOne({email}).select( '+password')

    if(!captain){
        throw new ApiError(404," user does not exist or inavlid username or password ")
    }

    const isPasswordValid = await captain.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"invalid password is types")
    }

    const loggedCaptain = await Captain.findById(captain._id).select("+password")

    const token = loggedCaptain.generateAuthToken();
    
    const options = {
        httpOnly: true,
        secure: true
    }


    return res
    .status(200)
    .cookie("token", token, options)
    .json(
        new ApiResponse(200,{token, captain: loggedCaptain}, "captain logged in successfully")
    )

})

const getCaptainProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.captain, "current captain fetched successfully")
    )
})

const logoutCaptain = asyncHandler(async(req,res, next) => {

    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","")   //check if the client requesting have cookies or not

    await BlacklistToken.create({token}); // we create the token as blacklist now we will check in auth middleware that if logout user are trying to access

    return res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, {},"Captain logged out successfully"))

})


export {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain,
}