import jwt from "jsonwebtoken";
import Book from "../model/books.js";
import User from "../model/user.js";
import { Cart } from "../model/cart.js";
import mongoose from "mongoose";



let JWT_SECRET = "hello-world"

export const booksData = async (req, res) => {
    try {
        const books = await Book.find()
        return res
            .status(200)
            .json({ message: "books data", books });
    } catch (err) {
        res.status(400).json({ error: err });
    }
};


export const getBook = async (req, res) => {
    try {
        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid book ID format." });
        }

        const bookId = new mongoose.Types.ObjectId(req.params.id);
        console.log(typeof bookId); // Check if bookId is of type ObjectId
        const book = await Book.findOne({ _id: bookId });

        if (!book) {
            return res.status(404).json({ error: "Book not found." });
        }

        console.log(book);
        return res.status(200).json({ message: "book details", book });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong." });
    }
};


export const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: "all fields are required" });
        }

        const userDetails = await User.findOne({ email });

        if (userDetails) {
            res
                .status(200)
                .json({ success: false, message: "User already Registered" });
        } else {
            const newUser = await User.create({
                email,
                password
            });
            res.status(200).json({
                success: true,
                message: "success new user created",
                user: newUser,
            });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: "all fields are required" });
        }

        const userDetails = await User.findOne({ email });

        if (userDetails) {

            if (password !== userDetails.password) {
                return res
                    .status(200)
                    .json({ success: false, message: "User Password is Invalid" });
            }

            const token = jwt.sign(
                {
                    id: userDetails._id,
                    email: userDetails.email,
                },
                JWT_SECRET,
                { expiresIn: "30d" }
            );
            res.status(200).json({ success: true, token, userDetails });
        } else {
            res.status(200).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
};


export const addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const { email } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email })
        const product = await Book.findOne({ _id: productId })
        const amount = parseFloat(product.price.replace('$', ''));

        const proObj = {
            item: productId,
            quantity: 1,
            price: amount,
        };

        const userCart = await Cart.findOne({ user: user._id })

        if (userCart) {
            let proExist = userCart.cartProducts.findIndex(
                (cartProducts) => cartProducts.item == productId
            );
            console.log(proExist);
            if (proExist != -1) {
                await Cart.updateOne(
                    { user: user, "cartProducts.item": productId },

                    {
                        $inc: {
                            "cartProducts.$.quantity": 1,
                            "cartProducts.$.price": amount,
                        },
                    }
                )
            } else {
                await Cart.updateOne(
                    { user: user._id },
                    {
                        $push: {
                            cartProducts: proObj,
                        },
                    }
                )
            }
        } else {
            let cartObj = {
                user: user._id,
                cartProducts: [proObj],
            };
            console.log(cartObj);
            await Cart.create(cartObj);
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};


export const getCartCount = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email })
        const userId = user._id

        Cart.findOne({ user: userId }, { cartProducts: 1 })
            .then((result) => {
                if (result) {
                    const cartProducts = result.cartProducts;
                    const totalQuantity = cartProducts.reduce((sum, cartProduct) => sum + cartProduct.quantity, 0);
                    res.json(totalQuantity)

                } else {
                    console.log("Cart not found for the user.");

                }
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
};


export const getCart = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        const isCart = await Cart.findOne({ user: user._id })
        if (!isCart) return res.json({ message: "not cart found" })
        const userId = user._id;

        Cart.aggregate([
            {
                $match: { user: userId },
            },
            {
                $unwind: "$cartProducts",
            },
            {
                $addFields: {
                    itemId: { $toObjectId: "$cartProducts.item" } // Convert item field to ObjectId
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "itemId",
                    foreignField: "_id",
                    as: "cartItems",
                },
            },
            {
                $project: {
                    _id: 1,
                    item: "$cartProducts.item",
                    quantity: "$cartProducts.quantity",
                    price: "$cartProducts.price",
                    product: { $arrayElemAt: ["$cartItems", 0] },
                },
            },
        ]).then((cartItems) => {
            res.json(cartItems)
        })

    } catch (error) {
        console.log(error);
    }

};

export const deleteProduct = async (req, res) => {
    const { id, userEmail } = req.body
    const user = await User.findOne({ email: userEmail })

    Cart.updateOne(
        { user: user._id },
        { $pull: { cartProducts: { item: id } } }
    )
        .then(() => {
            res.json("deleted succesfully")
        })
        .catch((err) => {
            console.error(err);
        });
};


export const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const { email } = req.body;
        const user = await User.findOne({ email })
        const product = await Book.findOne({ _id: productId })
        const amount = parseFloat(product.price.replace('$', ''));

        await Cart.updateOne(
            { user: user, "cartProducts.item": productId },

            {
                $inc: {
                    "cartProducts.$.quantity": -1,
                    "cartProducts.$.price": -amount,
                },
            })
            res.json("updated succesfully");
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
};