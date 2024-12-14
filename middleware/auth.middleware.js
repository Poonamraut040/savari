import { User } from "../model/user.model.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import cookieParser from "cookie-parser";
import { BlacklistToken } from "../model/blacklisttoken.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {                  
            
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","")   //check if the client requesting have cookies or not
        //const token = userUid.split("Bearer ")[1]; token = "Bearer 2687980934334$%^&*9876" therefore token = 2687980934334$%^&*9876
        if(!token){                            // jo string hai usko bearer  se split kiya to jo next word hai vo 1st index pe jayega
            throw new ApiError(401,"Unauthorized request")
        }

        const isBlacklisted = await User.findOne({token: token});

        if(isBlacklisted){
            throw new ApiError(401,"Unauthorized user check again")
        }

    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id)
      
    
        if(!user){
            throw new ApiError(401, "invalid Access Token")
        }

    
        req.user = user;
        next()
    
} catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
} 
}) 
