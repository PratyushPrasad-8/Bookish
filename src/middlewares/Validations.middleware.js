import User from "../models/User.js";

export const serverSideRegisterValidations = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  if (!email.includes("@") || !email.endsWith(".com")) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }
  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Name must be at least 3 characters long" });
  }

  //checking if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  //checking if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  next();
};

export const serverSideLoginValidations = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  if (!email.includes("@") || !email.endsWith(".com")) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  next();
};

export const UploadBookValidations = async (req, res, next) => {
  const {title, caption, image, rating} = req.body;

  if(!title){
      return res.status(400).json({message: "Please fill the title field"});
  }
  if(!caption){
      return res.status(400).json({message: "Please fill the caption field"});
  }
  if(!image){
      return res.status(400).json({message: "Please fill the image field"});
  }
  if(!rating){
      return res.status(400).json({message: "Please fill the rating field"});
  }

  next();
};
