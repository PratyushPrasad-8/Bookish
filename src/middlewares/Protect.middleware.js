import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const protect = async (req, res, next) => {
    try {
        //extracting token
        const token = req.headers.authorization.replace("Bearer ", "");

        //checking if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        //verifying token by checking it is valid user_id or not
        //user_id + JWT secret -> token 
        //similar token + JWT secret -> user_id
        //format of decoded token -> {id: user_id}
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const validUser = await User.findById(decodedToken.id);
        if(!validUser){
            return res.status(401).json({ message: "Illegal access" });
        }

        req.user=validUser;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Error during handling verification" });
    }
};