const Book = require("../books/model");

const findBookById = async (id) => {

    const bookId = id;

    const bookFound = await Book.findById(bookId)
        .then((book) => {
            
            return book;
        }).catch((error) => {
            console.error("Error finding book by ID:", error);
            return null;
        });

    return bookFound;
};

module.exports = {
    findBookById,
};
