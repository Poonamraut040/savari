import mongoose,{ Schema} from "mongoose";

const blacklisttoken = new Schema({
    token:{
        type: String,
        require: true,
        unique: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires:86400 //24 hours in second
    }
});

export const BlacklistToken = mongoose.model("BlacklistToken", blacklisttoken)
