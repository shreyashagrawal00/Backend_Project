import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { error } from "console"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content.trim()){
        throw new ApiError(400,"Please fill the Content||");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
    throw new ApiError(404, "Author not found");
  }

    const tweet = await Tweet.create({
        content,
        owner:user._id,
    })


    const updatedTweet = await tweet.populate("owner","username avatar")

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet created successfully"));


});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params
    const user = await User.findById(userId);
    
    if (!user) {
    throw new ApiError(404, "User not found");
    }

    const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt:-1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            }
          }
        ]
      }
    },
    {
      $addFields: {
        owner: {
          $first:"$owner"
        }
      }
    }
  ]);

  return res
    .status(200)
  .json(new ApiResponse(200,tweets,"All tweets are fetched succefully"))



})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}