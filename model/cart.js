import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
      user: mongoose.Types.ObjectId,
      cartProducts: [
        {
          item: String,
          quantity: Number,
          price:Number,
        },
      ],
    },
    {
      timestamps: true
    }
  );
  

export const Cart = mongoose.model('Cart',CartSchema);