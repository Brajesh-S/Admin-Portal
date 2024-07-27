// index.js
const express = require('express'); 
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./middleware/verifyToken');
require('dotenv').config();

app.use(express.json());

app.use(cors({
    origin:["http://localhost:3001"],
    methods:['POST' , 'GET', 'PUT', 'DELETE'],
    credentials: true
})); 


app.use('/api/protected', auth, (req, res) => {
  res.send('This is a protected route');
});
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  })
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
