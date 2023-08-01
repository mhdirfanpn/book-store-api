import mongoose from "mongoose";

const connectDb = async () => {
  const connection = await mongoose
    .connect("mongodb+srv://mhdirfanpn:sG0ov99WO10SmrrY@cluster0.eclevvn.mongodb.net/book-store", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DATABASE CONNECTED");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDb;


// mongodb://localhost:27017/book-store