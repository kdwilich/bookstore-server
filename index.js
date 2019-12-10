const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_BOOKS_QUERY = 'SELECT * FROM books';
const SELECT_ALL_CARTS_QUERY = 'SELECT * FROM carts';
const SELECT_ALL_PAYMENTS_QUERY = 'SELECT * FROM payments';
const DELETE_ALL_CARTS_QUERY = 'TRUNCATE TABLE carts';
const CART_TOTAL_PRICE_QUERY = 'SELECT SUM(price * Cart_Quantity) AS Total FROM carts c, books b WHERE b.ISBN = c.ISBN';
const COMPLETE_PURCHASE = 'UPDATE books b, carts c set b.Stock=b.Stock-c.Cart_Quantity WHERE b.ISBN = c.ISBN'

const pool = mysql.createPool( {
    connectionLimit : 10,
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'ba74ad5c9d3120',
    password: 'd9cf6ee6',
    database: 'heroku_995327c1b8fd6b9'
});

app.use(cors());

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('<div>Auto-deploy Test</div><div><ul><li href="/books">Books</li><li href="/carts">Carts</li><li href="/carts/add">Add Carts</li><li href="/carts/total_price">Price of Cart</li><li href="/carts/delete/all">Delete All Carts</li><li href="/payments">Payments</li><li href="/payments/add">Add Payments</li></ul></div>')
})

app.get('/carts/update/add', (req, res) => {
    const { ISBN } = req.query;

    console.log(ISBN)

    const UPDATE_CART_QT_ADD = `UPDATE carts SET Cart_Quantity=Cart_Quantity+1 WHERE ISBN=${ISBN}`;

    pool.query(UPDATE_CART_QT_ADD, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})



app.get('/carts/update/delete', (req, res) => {
    const { ISBN } = req.query;

    const UPDATE_CART_QT_DEL = `UPDATE carts SET Cart_Quantity=Cart_Quantity-1 WHERE ISBN=${ISBN}`;

    pool.query(UPDATE_CART_QT_DEL, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/carts/price', (req, res) => {
    const { ISBN } = req.query;

    const GET_BOOK_PRICE_QUERY = `SELECT price FROM books WHERE ISBN=${ISBN}`;

    pool.query(GET_BOOK_PRICE_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/payments/add', (req, res) => {
    const { PID, OID, Bstreet, Bcity, Bstate, Bzip, card_info } = req.query;
    
    const INSERT_PAYMENTS_QUERY = `INSERT INTO Payments Values('${PID}', '${OID}', '${Bstreet}', '${Bcity}', '${Bstate}', '${Bzip}', '${card_info}')`;
    // /add?PID=24&OID=52342&Bstreet=123%20Walnut&Bcity=Rogers&Bstate=AR&Bzip=72756&card_info=34123562349390
    pool.query(INSERT_PAYMENTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Successfully Added Payment');
        }
    });
})

app.get('/payments', (req, res) => {
    pool.query(SELECT_ALL_PAYMENTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/cart/checkout', (req, res) => {
    pool.query(COMPLETE_PURCHASE, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/carts/total_price', (req, res) => {
    pool.query(CART_TOTAL_PRICE_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/carts/add', (req, res) => {
    const { AccountID, cartID, Book, ISBN, Cart_Quantity } = req.query;
    
    const INSERT_CART_QUERY = `INSERT INTO Carts Values('${AccountID}', '${cartID}', '${Book}', '${ISBN}', '${Cart_Quantity}')`;
    // /add?AccountID=111111&cartID=2&Book=book2&ISBN=9787892881657&Cart_Quantity=1
    pool.query(INSERT_CART_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Successfully Added Cart');
        }
    });
})

app.get('/carts/delete/all', (req, res) => {
    pool.query(DELETE_ALL_CARTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/carts', (req, res) => {
    pool.query(SELECT_ALL_CARTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/books', (req, res) => {
    pool.query(SELECT_ALL_BOOKS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.listen(process.env.PORT || 4000, () => {
    let port = process.env.PORT ? `Heroku port` : `port 4000`;
    console.log(`books on ${port}` );
})