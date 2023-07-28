import express from "express";
import { verifyToken } from "../middleware/userAuth.js";
import { booksData, getBook, registerUser, userLogin, getCartCount,getCart,deleteProduct, addToCart} from "../controller/booksController.js";

const router = express.Router();

router.get("/sampe",(req,res)=>{
    res.send("hai")
})



 router.post("/register", registerUser);

router.post("/login",userLogin);

router.get("/books",booksData)

router.get("/book/:id",getBook)

router.patch("/addToCart/:id", addToCart)

router.get("/cartCount",getCartCount)

router.get("/getCart",getCart)

router.get("/deleteProduct",deleteProduct)


export default router;