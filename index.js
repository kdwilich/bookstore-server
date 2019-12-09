const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_BOOKS_QUERY = 'SELECT * FROM books';
const SELECT_ALL_CARTS_QUERY = 'SELECT * FROM carts';
const SELECT_ALL_PAYMENTS_QUERY = 'SELECT * FROM payments';
const DELETE_ALL_CARTS_QUERY = 'TRUNCATE TABLE carts';

const pool = mysql.createPool( {
    connectionLimit : 10,
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'ba74ad5c9d3120',
    password: 'd9cf6ee6',
    database: 'heroku_995327c1b8fd6b9'
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('go to /books')
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

app.get('/carts/delete', (req, res) => {
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