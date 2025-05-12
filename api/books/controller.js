const Book = require("./model");
const {findBookById} = require("../services/bookService");

const createBook = async (req, res) => {
    const { title, author, genre, publishedYear, editorial} = req.body;
    
    const book = {
        title,
        author,
        genre,
        publishedYear,
        editorial,
        available: true
    };

    const newBook = new Book(book);
    try {
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const findBook = async (req, res) => {
    const {id} = req.body;

    const foundBook = await findBookById(id);

    if (!foundBook) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(200).json(foundBook);
    }
    
};

const updateBook = async (req, res) => {
    const { id } = req.query;
    const { title, author, genre, publishedYear, editorial, available } = req.body;

    if (title && author && genre && publishedYear && editorial) {
        const book = {
            title,
            author,
            genre,
            publishedYear,
            editorial,
            available
        };

        const bookFind = await findBookById(id);

        if (!bookFind) {
            return res.status(404).json({ message: "Book not found" });
        } else {
            const bookUptdated = await Book.updateOne(
                { _id: bookFind._id },
                { $set: { title: book.title, author: book.author, genre: book.genre, publishedYear: book.publishedYear, editorial: book.editorial, available: book.available } }
            );

            if (bookUptdated.ok === 1) {
                return res.status(200).json({ message: "Book updated successfully" });
            } else {
                return res.status(500).json({ message: "Error updating book" });
            }
        };
    };
};

const removeBook = async (req, res) => {
    const { id } = req.query;

    const bookFind = await findBookById(id);

    if (!bookFind) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        const softDeleteResult = await Book.updateOne(
            { _id: id },
            { 
                $set: { 
                    isDeleted: true,
                    available: false
                } 
            }
        );

        if (softDeleteResult.ok === 1) {
            return res.status(200).json({ message: "Book deleted successfully" });
        } else {
            return res.status(500).json({ message: "Error deleting Book" });
        }
    }
};

const findBooksByFilter = async (req, res) => {
    const { title, author, genre, publishedYear, editorial, available } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (author) filter.author = { $regex: author, $options: "i" };
    if (genre) filter.genre = { $regex: genre, $options: "i" };
    if (publishedYear) filter.publishedYear = publishedYear;
    if (editorial) filter.editorial = { $regex: editorial, $options: "i" };
    if (available !== undefined) filter.available = available === "true";

    try {
        const books = await Book.find(filter);
        res.status(200).json({books, message : "Books found successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBook,
    findBook,
    updateBook,
    removeBook,
    findBooksByFilter
};