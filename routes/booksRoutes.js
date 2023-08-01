import express from "express";
import { verifyToken } from "../middleware/userAuth.js";
import { booksData, getBook, registerUser, userLogin, removeFromCart, getCartCount, getCart, deleteProduct, addToCart } from "../controller/booksController.js";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", userLogin);

router.get("/book/:id", verifyToken, getBook)

router.get("/books", verifyToken, booksData)

router.patch("/addToCart/:id",verifyToken,addToCart)

router.get("/cartCount", verifyToken,getCartCount)

router.get("/getCart", verifyToken,getCart)

router.patch("/deleteProduct/:id", verifyToken,deleteProduct)

router.patch("/removeProduct/:id",verifyToken,removeFromCart)

export default router;