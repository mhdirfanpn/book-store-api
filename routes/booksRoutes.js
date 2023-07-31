import express from "express";
import { verifyToken } from "../middleware/userAuth.js";
import { booksData, getBook, registerUser, userLogin, removeFromCart, getCartCount, getCart, deleteProduct, addToCart } from "../controller/booksController.js";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", userLogin);

router.get("/book/:id", verifyToken, getBook)

router.get("/books", verifyToken, booksData)

router.patch("/addToCart/:id", addToCart)

router.get("/cartCount", getCartCount)

router.get("/getCart", getCart)

router.get("/deleteProduct", deleteProduct)

router.patch("/removeProduct/:id",removeFromCart)

export default router;