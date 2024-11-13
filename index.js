const app = require('express')()
const server = require('http').createServer(app)
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const { MY_PORT, MANGODB_URL } = require('./config/variables');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Mongo DB Connection
async function connectToMongo() {
    mongoose.connect(MANGODB_URL);
    console.log('Connected to MongoDB');
}
connectToMongo();


app.get('/', (req, res) => {
    res.send("Server Started..!!!")
})

//api routes
app.use('/api', routes);

server.listen(MY_PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port}`);
});