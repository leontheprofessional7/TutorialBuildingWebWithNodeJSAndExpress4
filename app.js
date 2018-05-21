const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

// To create an instance of express
const app = express();
const port = process.env.PORT || 3000;

const config = {
    user: 'leon',
    password: 'Dad19630320',
    server: 'pslibraryleon.database.windows.net',
    database: 'PSLibrary',

    options: {
        encrypt: true   // Use this if you're on Windows Azure
    }
};
sql.connect(config).catch(err => debug(err));

app.use(morgan('combined'));

app.use((req, res, next) => {
    debug('my middleware');
    next();
});
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
    { link: '/books', title: 'Book' },
    { link: '/authors', title: 'Author' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
    res.render(
        'index',
        {
            nav: [{ link: '/books', title: 'Books' },
            { link: '/authors', title: 'Authors' }],
            title: 'Library'
        }
    );
});

app.listen(port, (err) => {
    if (err) {
        debug('Server error: ' + chalk.red(err));
    } else {
        debug(`Running server on port: ${chalk.green(port)}`);
    }
});
