import mongoose from "mongoose";
const ATLAS_URI = process.env.LOCAL_URL_Mongo;
const PORT = process.env.PORT||5000;

const connectMongo = async () => {

     try {
    let uri = ATLAS_URI;
    if (!uri) {
      console.error("MongoDB Atlas URI is missing, check your env file...");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Mongo DB connected : and running in:" + uri);
  } catch (error) {
    console.error("MongoDB is failing" + error);
    process.exit(1);
  }
}
export default connectMongo