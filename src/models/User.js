import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
}, {timestamps: true});

//Hashing the password before saving it to the database
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Later MongoDB converts it to a collection named "users" {"User" --> "users"}
const User= mongoose.model("User", userSchema);
export default User;