import express from "express";
import Book from "../models/Book.js";
import { UploadBookValidations } from "../middlewares/Validations.middleware.js";
import { protect } from "../middlewares/Protect.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.post("/", protect, UploadBookValidations, async(req, res) => {
    try{
        //fetching data
        const { title, caption, image, rating} = req.body;

        //Uploading image to cloudinary
        const result = await cloudinary.uploader.upload(image);
        const imageUrl= result.secure_url; 
        
        
        //save book to database
        const newBook = new Book({title, caption, image: imageUrl, rating, user: req.user._id});
        await newBook.save();

        //sending response
        return res.status(201).json(newBook);
    }catch(error){
        console.log("Error while uploading book",error);
        return res.status(500).json({message: "Error while uploading book"});
    }
});

router.get("/user", protect, async(req, res)=>{
    try{
        //fetching data
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        
        //sending response
        res.status(200).json({books, user: req.user});
    }catch(error){
        console.log("Error while fetching user books",error);
        res.status(500).json({message: "Error while fetching user books"});
    }
});

router.get("/", async(req, res) => {
    try{
        //Implementing pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit; 

        //fetching data
        const books = await Book.find().sort({createdAt: -1}).skip(skip).limit(limit).populate("user", "username profileImage");
        
        const totalBooks = await Book.countDocuments();
        
        //sending response
        res.status(200).send({books, currentPage: page, totalBooks, totalPages: Math.ceil(totalBooks / limit)});
    }catch(error){
        console.log("Error while fetching books",error);
        res.status(500).json({message: "Error while fetching books"});
    }
});

router.delete("/:id", protect, async(req, res) => {
    try{
        //fetching data
        const {id} = req.params;
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        //checking if user is authorized
        if(req.user._id.toString() !== book.user.toString()){
            return res.status(401).json({message: "Unauthorized to delete this book"});
        }

        //deleting image from cloudinary
        //extracting publicId from cloudinary URL
        //format of cloudinary URL -> https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
        try{
            const publicId = book.image.split("/").pop().split(".")[0];
            const result = await cloudinary.uploader.destroy(book.image);
            if(result.result !== "ok"){
                return res.status(500).json({message: "Error while deleting service"});
            }
        }catch(error){
            console.log("Error while handling deleting service",error);
            return res.status(500).json({message: "Error while handling deleting service"});
        }

        //deleting book from database
        await Book.findByIdAndDelete(id);

        //sending response
        return res.status(200).json({message: "Book deleted successfully"});
    }catch(error){
        console.log("Error while deleting book",error);
        return res.status(500).json({message: "Error while deleting book"});
    }
});

export default router;