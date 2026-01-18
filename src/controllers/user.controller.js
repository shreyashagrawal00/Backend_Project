import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUSer = asyncHandler(async (req, res) => {
  const  {username, email, password,fullName}=req.body;
  console.log("email",email);
   
/*if(fullName===""){
  throw new apiError(400,"Full name is required");
}
You can use this method for all response but for proffesional projects use SOME method 
*/

if(
  [fullName,email,password,username].some((field)=>field?.trim()==="")
){
  throw new ApiError(400,"All Fields are required");
}

const existedUser = await User.findOne({
  $or : [{ username } , { email }]
})

if(existedUser){
  throw new ApiError(409,"user already exisits!")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400,"Avatar is required");
}

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
  throw new ApiError(400,"Avatar and Cover Image are required");
}

const user = await User.create({
  fullName,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  password,
  username:username.toLowerCase()
})

const createdUSer = await User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createdUSer){
  throw new ApiError(500,"Something went wrong while creating user");
}

return res.status(201).json(
  new ApiResponse(200,createdUSer,"User created successfully")
);

});

export { registerUSer };