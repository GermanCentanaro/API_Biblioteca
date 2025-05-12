const mongoose = require("mongoose");

const collection = "books";

const objectSchema = {
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true 
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    genre: { 
        type: String, 
        required: [true, 'Genre is required'],
        trim: true
    },
    publishedYear: { 
        type: Number, 
        required: [true, 'Published Year is required'],
        min: [1450, 'Published Year must be after 1450'],
        max: [new Date().getFullYear(), 'Published Year cannot be in the future']
    },
    editorial: {
        type: String,
        required: [true, 'Editorial is required'],
        trim: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
};

const options = {
  timestamps: true,
};

const schema = new mongoose.Schema(objectSchema, options);

schema.pre("updateOne", function (next) {
    const data = this.getUpdate()["$set"];
    next();
});

const Book = mongoose.model(collection, schema);

module.exports = Book;