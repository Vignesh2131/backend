import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from "../models/user.modal.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log(fullName);

  //validation - not empty
  if (fullName === "" || email === "" || username === "" || password === "") {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists : username, email
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) throw new ApiError(409, "User already exists");

  //check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar");
  
  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar");

  //create user object - create entry in db
  const newUser = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
  });

  //remove password & refreshtoken field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!createdUser) throw new ApiError(500, "Something went wrong");

  //return response
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )
})

export {registerUser}