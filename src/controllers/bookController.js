const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }
    function getIndex(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to the server');

                const db = client.db(dbName);
                const collection = await db.collection('books');
                const books = await collection.find().toArray();

                res.render(
                    'bookListView',
                    {
                        nav,
                        title: 'Library',
                        books
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    }
    function getById(req, res) {
        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to the server');

                const db = client.db(dbName);
                const collection = await db.collection('books');
                const book = await collection.findOne({ _id: new ObjectID(id) });
                debug(book);

                book.details = await bookService.getBookById(book.bookId);
                res.render(
                    'bookView',
                    {
                        nav,
                        title: 'Library',
                        book
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    }
    // Revealing Module Pattern
    return {
        getIndex,
        getById,
        middleware
    };
}

module.exports = bookController;
