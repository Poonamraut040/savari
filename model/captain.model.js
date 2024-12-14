import mongoose, {Schema} from "mongoose";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";



const captainSchema = new Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'first name must be three character long'],
        },
        lastname:{
            type: String,
            minlength: [3, 'first name must be three character long'],
        },

    },
    email: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        minlength:[5,'email must be 5 character long'],
        
    },
    password: {
        type: String,
        required: true,
        select: false, 
    },
    SocketId: {
        type: String,
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: 'inactive',
    },
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength:[3,'email must be 3 character long'],
        },
        plate:{
            type: String,
            required: true,
            minlength:[3,'email must be 3 character long'],
        },
        capacity:{
            type: Number,
            required: true,
            minlength:[3,'email must be 3 character long'],
        },
        VehicleType:{
            type: String,
            required: true,
            enum:['car', 'motorcycle','auto']
        }
    },
    location:{
        lat:{
            type: Number,
        },
        lng:{
            type: Number,
        }
    }
});

captainSchema.methods.generateAuthToken = function () {  // Use regular function
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

captainSchema.methods.isPasswordCorrect = async function(password){
    try {
          return await bcrypt.compare(password, this.password)
      
    } catch (error) {
      throw new ApiError(404,"issue in comparing")
      next(error);
    }}
    

captainSchema.statics.hashedPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error("Error in password hashing");
    }
};    


export const Captain = mongoose.model("Captain", captainSchema);