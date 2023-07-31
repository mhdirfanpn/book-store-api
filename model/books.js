import mongoose from "mongoose";


const BookSchema = mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  authors: { type: String },
  publisher: { type: String },
  language: { type: String },
  isbn10: { type: String },
  isbn13: { type: String },
  pages: { type: Number },
  year: { type: String },
  rating: { type: Number },
  desc: { type: String },
  price: { type: String },
  image: { type: String },
  url: { type: String },
  pdf: {
    type: {
      "Chapter 2": { type: String },
      "Chapter 5": { type: String },
    },
    default: {}
  },
})

const Book = mongoose.model('Book', BookSchema);
export default Book;