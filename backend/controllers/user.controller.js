import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {

   try {
    
       const loggedInUserId = req.user._id; // Assuming the logged-in user's ID is available in req.user
        
       const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }) // Fetch all users except the logged-in user

         return res.status(200).json(filteredUsers); // Return the list of users for the sidebar

   } 
   
   catch (error) {
      console.error("Error fetching users for sidebar:", error);
     res.status(500).json({ message: "Internal server error" });
   }  

 }