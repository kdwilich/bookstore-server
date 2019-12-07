const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_BOOKS_QUERY = 'SELECT * FROM books';
const SELECT_ALL_EMPLOYEES_QUERY = 'SELECT * FROM employees';

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

app.get('/employees/add', (req, res) => {
    const { name, employee_no, address, salary, isManager } = req.query;
    
    const INSERT_EMPLOYEE_QUERY = `INSERT INTO Employees Values('${employee_no}', '${name}', '${address}', '${salary}', '${isManager}')`;
    // /add?employee_no=0420&name=Kyle&address=123DankSt&salary=69.42&isManager=false
    pool.query(INSERT_EMPLOYEE_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Successfully Added Employee');
        }
    });
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

app.get('/employees', (req, res) => {
    pool.query(SELECT_ALL_EMPLOYEES_QUERY, (err, results) => {
        if(err) return res.send(err)
        else return res.json({ data: results })
    })
})

app.listen(process.env.PORT || 4000, () => {
    let port = process.env.PORT ? `Heroku port` : `port 4000`;
    console.log(`books on ${port}` );
})