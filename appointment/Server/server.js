const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const upload = multer();
const { dbconnection } = require('./config/database');
const { SERVER_PORT } = require('./config/variables');
const routes = require('./config/routes');

// HTTPS CORS Permission added
app.use(cors({
  origin: ['http://creat.ink', 'http://localhost:5173', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Database Connection Function
//dbconnection();

// App Permissions Enables
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/Server', routes);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});

