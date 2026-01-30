import { chatClient } from "../config/stream.js";

const getStreamToken = async (req, res) => {
  try {
    const token = chatClient.createToken(req.user.clerkId);
    res.status(200).json({
        token,
        userId:req.user.clerkId,
        userName:req.user.name,
        userImage:req.user.profileImage
    })
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"});
    console.log("Error in getStreamToken controller : ",error.message)
  }
};

export { getStreamToken };
