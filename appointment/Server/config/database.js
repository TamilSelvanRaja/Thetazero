const mysql = require('mysql');
const { HOST_NAME, USER_NAME, PASSWORD, DATABASE } = require('./variables');

const db = mysql.createConnection({
    host: HOST_NAME,
    user: USER_NAME,
    password: PASSWORD,
    database: DATABASE,
});

//***************** Data Base Connection Function ************************\\
const dbconnection = () => {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            process.exit(1);
        } else {
            console.log('Connected to MySQL database');
        }
    });
};

//***************** Data Base Query Function ************************\\
const queryservices = (conditions, values) => {
    db.query(conditions, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        } else {
            return results;
        }
    });
};

module.exports = { dbconnection, queryservices };