import mongoose from "mongoose";

const connectToMongoDB = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_URI,) // CHANGED: Use MONGO_URI for Render deployment
        console.log("Connected to MongoDB successfully!");
        
    } catch (error) {
      console.error("Error connecting to MongoDB:", error); 
    }
}

export default connectToMongoDB;

